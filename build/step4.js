const fs = require('fs')
const babel = require('@babel/core')
const promisify = require('util').promisify
;(async function() {
  async function minify(path) {
    const bb = promisify(babel.transformFile)(path, {
      babelrc: false,
      presets: [
        [
          'minify',
          {
            mangle: { topLevel: true }
          }
        ]
      ]
    })
    return (await bb).code
  }
  const lib = minify('lib/lib.mjs')
  const fsharp = minify('lib/fsharp.min.mjs')
  const smart = minify('lib/smart.min.mjs')
  promisify(fs.writeFile)('lib/lib.min.mjs', await lib)
  promisify(fs.writeFile)('lib/fsharp.min.mjs', await fsharp)
  promisify(fs.writeFile)('lib/smart.min.mjs', await smart)
})()
