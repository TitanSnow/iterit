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

function decorateToFsharp(func, name, length) {
  return decorateMeta(
    (...args) => subject => func.apply(subject, args),
    name,
    length
  )
}

function decorateToSmart(func, name, length) {
  return decorateMeta(
    (subject, ...args) => func.apply(subject, args),
    name,
    length
  )
}

async function genFsharp(funcs) {
  const f = fs.createWriteStream('lib/fsharp.mjs')
  const fw = promisify(f.write.bind(f))
  await fw("import * as it from './lib.mjs'\n\n")
  await fw(decorateMeta.toString() + '\n\n')
  await fw(decorateToFsharp.toString() + '\n\n')
  for (const [name, meta] of Object.entries(funcs)) {
    if (meta.needCurry) {
      await fw(
        `export const ${name} = decorateToFsharp(it.${name}, '${name}', ${
          meta.length
        })\n`
      )
    } else {
      await fw(`export const ${name} = it.${name}\n`)
    }
  }
}

async function genSmart(funcs) {
  const f = fs.createWriteStream('lib/smart.mjs')
  const fw = promisify(f.write.bind(f))
  await fw("import * as it from './lib.mjs'\n\n")
  await fw(decorateMeta.toString() + '\n\n')
  await fw(decorateToSmart.toString() + '\n\n')
  for (const [name, meta] of Object.entries(funcs)) {
    if (meta.needCurry) {
      await fw(
        `export const ${name} = decorateToSmart(it.${name}, '${name}', ${meta.length +
          1})\n`
      )
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
