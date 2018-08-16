const fs = require('fs')
const rimraf = require('rimraf')
const babel = require('@babel/core')
const promisify = require('util').promisify
;(async function() {
  const rm = promisify(rimraf)('lib')
  const bb = promisify(babel.transformFile)('src/lib.js')
  try {
    await rm
  } catch (_) {}
  await promisify(fs.mkdir)('lib')
  const code = (await bb).code
  fs.writeFileSync('lib/lib.mjs', code)
})()
