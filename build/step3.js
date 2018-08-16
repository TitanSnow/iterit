const fs = require('fs')
const promisify = require('util').promisify

function decorateMeta(func, name, length) {
  Object.defineProperties(func, {
    name: {
      value: name,
      writable: false,
      enumerable: false,
      configurable: true
    },
    length: {
      value: length,
      writable: false,
      enumerable: false,
      configurable: true
    }
  })
  return func
}

function decorateToFsharp(func) {
  return decorateMeta(
    (...args) => subject => func.apply(subject, args),
    func.name,
    func.length
  )
}

function decorateToSmart(func) {
  return decorateMeta(
    (subject, ...args) => func.apply(subject, args),
    func.name,
    func.length + 1
  )
}

async function genFsharp(funcs) {
  const f = fs.createWriteStream('lib/fsharp.mjs')
  await promisify(f.write.bind(f))("import * as it from './lib.mjs'\n\n")
  const fmin = fs.createWriteStream('lib/fsharp.min.mjs')
  await promisify(fmin.write.bind(fmin))(
    "import * as it from './lib.min.mjs'\n\n"
  )
  async function fw(s) {
    const a = promisify(f.write.bind(f))(s)
    const b = promisify(fmin.write.bind(fmin))(s)
    await a
    await b
  }
  await fw(decorateMeta.toString() + '\n\n')
  await fw(decorateToFsharp.toString() + '\n\n')
  for (const [name, needCurry] of Object.entries(funcs)) {
    if (needCurry) {
      await fw(`export const ${name} = decorateToFsharp(it.${name})\n`)
    } else {
      await fw(`export const ${name} = it.${name}\n`)
    }
  }
}

async function genSmart(funcs) {
  const f = fs.createWriteStream('lib/smart.mjs')
  await promisify(f.write.bind(f))("import * as it from './lib.mjs'\n\n")
  const fmin = fs.createWriteStream('lib/smart.min.mjs')
  await promisify(fmin.write.bind(fmin))(
    "import * as it from './lib.min.mjs'\n\n"
  )
  async function fw(s) {
    const a = promisify(f.write.bind(f))(s)
    const b = promisify(fmin.write.bind(fmin))(s)
    await a
    await b
  }
  await fw(decorateMeta.toString() + '\n\n')
  await fw(decorateToSmart.toString() + '\n\n')
  for (const [name, needCurry] of Object.entries(funcs)) {
    if (needCurry) {
      await fw(`export const ${name} = decorateToSmart(it.${name})\n`)
    } else {
      await fw(`export const ${name} = it.${name}\n`)
    }
  }
}

;(async function() {
  const funcs = JSON.parse(
    await promisify(fs.readFile)('temp/funcs.json', { encoding: 'utf8' })
  )
  genFsharp(funcs)
  genSmart(funcs)
})()
