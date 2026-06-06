---
'playwriter': patch
---

Fix race condition where two simultaneous CLI/MCP commands could both try to spawn the relay server, causing one to crash with `EADDRINUSE` on port 19988.

The relay server now awaits the port bind before returning, turning `EADDRINUSE` into a catchable error. If a competing relay already won the bind, the losing process exits cleanly instead of crashing. Concurrent `ensureRelayServer()` calls within the same Node.js process are also deduplicated.

Fixes #75
