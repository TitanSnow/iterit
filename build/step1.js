const fs = require('fs')
const babel = require('@babel/core')
const cp = require('child_process')
fs.writeFileSync('temp/lib.ts', babel.transformFileSync('src/lib.ts').code)
try {
  cp.execFileSync('tsc --target es2017 --module es2015 temp/lib.ts', {
    stdio: 'inherit',
    shell: true
  })
} catch (_) {}
fs.renameSync('temp/lib.js', 'lib/lib.mjs')
