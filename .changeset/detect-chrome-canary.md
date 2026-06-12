---
'playwriter': patch
---

Improve browser names in `playwriter session new` when multiple browsers are connected.

The extension now checks the browser's full user-agent client hints before falling back to the low-entropy browser brand and user agent string. Browsers that expose a more specific brand, such as Chromium or Chrome Canary, can now show that name in the browser list.
