import fs from 'node:fs'
import path from 'node:path'
import { LOG_CDP_FILE_PATH } from './utils.js'

export type CdpLogEntry = {
  timestamp: string
  direction: 'from-playwright' | 'to-playwright' | 'from-extension' | 'to-extension'
  clientId?: string
  source?: 'extension' | 'server'
  message: unknown
}

export type CdpLogger = {
  log(entry: CdpLogEntry): void
  logFilePath: string
}

const DEFAULT_MAX_STRING_LENGTH = Number(process.env.PLAYWRITER_CDP_LOG_MAX_STRING_LENGTH || 2000)

function truncateString(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value
  }
  const truncatedCount = value.length - maxLength
  return `${value.slice(0, maxLength)}…[truncated ${truncatedCount} chars]`
}

function createTruncatingReplacer({ maxStringLength }: { maxStringLength: number }) {
  const seen = new WeakSet<object>()
  return (_key: string, value: unknown) => {
    if (typeof value === 'string') {
      return truncateString(value, maxStringLength)
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]'
      }
      seen.add(value)
    }
    return value
  }
}

const DEFAULT_MAX_ENTRIES = Number(process.env.PLAYWRITER_CDP_LOG_MAX_ENTRIES || 10_000)

export function createCdpLogger({
  logFilePath,
  maxStringLength,
  maxEntries,
}: { logFilePath?: string; maxStringLength?: number; maxEntries?: number } = {}): CdpLogger {
  const resolvedLogFilePath = logFilePath || LOG_CDP_FILE_PATH
  const logDir = path.dirname(resolvedLogFilePath)
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }
  fs.writeFileSync(resolvedLogFilePath, '')

  let queue: Promise<void> = Promise.resolve()
  let lineCount = 0
  let rotating = false
  const maxLength = maxStringLength ?? DEFAULT_MAX_STRING_LENGTH
  const resolvedMaxEntries = maxEntries ?? DEFAULT_MAX_ENTRIES
  // Keep half the entries after rotation so we don't rotate on every write
  const keepAfterRotation = Math.floor(resolvedMaxEntries / 2)

  const rotate = async (): Promise<void> => {
    rotating = true
    const content = await fs.promises.readFile(resolvedLogFilePath, 'utf-8')
    const lines = content.split('\n').filter((l) => {
      return l.length > 0
    })
    const kept = lines.slice(-keepAfterRotation)
    await fs.promises.writeFile(resolvedLogFilePath, kept.join('\n') + '\n')
    lineCount = kept.length
    rotating = false
  }

  const log = (entry: CdpLogEntry): void => {
    const replacer = createTruncatingReplacer({ maxStringLength: maxLength })
    const line = JSON.stringify(entry, replacer)
    queue = queue.then(async () => {
      await fs.promises.appendFile(resolvedLogFilePath, `${line}\n`)
      lineCount++
      if (lineCount > resolvedMaxEntries && !rotating) {
        await rotate()
      }
    })
  }

  return {
    log,
    logFilePath: resolvedLogFilePath,
  }
}
