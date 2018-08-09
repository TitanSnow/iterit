import * as lib from './lib'

Object.entries(lib).forEach(([key, value]) => {
  const f = (...args) => subject => value.apply(subject, args)
  Object.defineProperties(f, {
    name: Object.assign(Object.getOwnPropertyDescriptor(f, 'name'), {
      value: value.name
    }),
    length: Object.assign(Object.getOwnPropertyDescriptor(f, 'length'), {
      value: value.length
    })
  })
  exports[key] = f
})
