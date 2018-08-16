const fs = require('fs')
const babel = require('@babel/core')
fs.writeFileSync('lib/lib.mjs', babel.transformFileSync('src/lib.js').code)
