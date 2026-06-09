import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { createCdpLogger, type CdpLogEntry } from './cdp-log.js'

function makeTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-log-test-'))
}

function makeEntry(i: number): CdpLogEntry {
  return {
    timestamp: new Date().toISOString(),
    direction: 'from-extension',
    message: { method: `Test.method${i}`, id: i },
  }
}

describe('CDP log rotation', () => {
  it('rotates when lineCount exceeds maxEntries, keeping last half', async () => {
    const tmpDir = makeTmpDir()
    const logFile = path.join(tmpDir, 'cdp.jsonl')
    const logger = createCdpLogger({ logFilePath: logFile, maxEntries: 20 })

    // Write 25 entries to trigger rotation (threshold is 20)
    for (let i = 0; i < 25; i++) {
      logger.log(makeEntry(i))
    }
    // Wait for the async queue to drain
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })

    const content = fs.readFileSync(logFile, 'utf-8').trim()
    const lines = content.split('\n').filter((l) => {
      return l.length > 0
    })

    // After rotation at entry 21 (0-indexed 20), we keep last 10 entries (half of 20),
    // then entries 21-24 are appended = 10 + 4 = 14 lines
    // The kept entries should be the last 10 before rotation (entries 11-20),
    // plus entries 21-24 appended after rotation
    expect(lines.length).toBeLessThanOrEqual(20)
    expect(lines.length).toBeGreaterThanOrEqual(10)

    // Verify the last entry is the most recent one (entry 24)
    const lastEntry = JSON.parse(lines[lines.length - 1])
    expect(lastEntry.message.id).toBe(24)

    // Verify oldest kept entry is not from the very beginning
    const firstEntry = JSON.parse(lines[0])
    expect(firstEntry.message.id).toBeGreaterThan(0)

    fs.rmSync(tmpDir, { recursive: true })
  })

  it('does not rotate when under maxEntries', async () => {
    const tmpDir = makeTmpDir()
    const logFile = path.join(tmpDir, 'cdp.jsonl')
    const logger = createCdpLogger({ logFilePath: logFile, maxEntries: 50 })

    for (let i = 0; i < 30; i++) {
      logger.log(makeEntry(i))
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 300)
    })

    const lines = fs
      .readFileSync(logFile, 'utf-8')
      .trim()
      .split('\n')
      .filter((l) => {
        return l.length > 0
      })

    expect(lines.length).toBe(30)

    fs.rmSync(tmpDir, { recursive: true })
  })

  it('handles multiple rotations', async () => {
    const tmpDir = makeTmpDir()
    const logFile = path.join(tmpDir, 'cdp.jsonl')
    const logger = createCdpLogger({ logFilePath: logFile, maxEntries: 10 })

    // Write 35 entries, should trigger multiple rotations
    for (let i = 0; i < 35; i++) {
      logger.log(makeEntry(i))
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })

    const lines = fs
      .readFileSync(logFile, 'utf-8')
      .trim()
      .split('\n')
      .filter((l) => {
        return l.length > 0
      })

    // Should never exceed maxEntries + a small buffer from writes between check and rotation
    expect(lines.length).toBeLessThanOrEqual(15)
    expect(lines.length).toBeGreaterThanOrEqual(5)

    // Last entry should be the most recent
    const lastEntry = JSON.parse(lines[lines.length - 1])
    expect(lastEntry.message.id).toBe(34)

    fs.rmSync(tmpDir, { recursive: true })
  })
})
