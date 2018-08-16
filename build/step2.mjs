import * as it from '../lib/lib'
import isArrowFunction from 'is-arrow-function'
import fs from 'fs'

let funcs = {}
for (const [name, f] of Object.entries(it)) {
  funcs[name] = !isArrowFunction(f)
}

fs.writeFileSync('temp/funcs.json', JSON.stringify(funcs, null, 2))
