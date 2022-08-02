#!/usr/bin/env node
try {
  await (await import('../dist/index.js')).run()
} catch (e) {
  console.dir(e)
}
