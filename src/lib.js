export function index(key) {
  return this[key]
}

export function bind(obj) {
  return this.bind(obj)
}

export function getBound(key) {
  return ::this[key]
}

export function typeOf() {
  return typeof this
}

export function is(obj) {
  return Object.is(this, obj)
}

export function sameValueZero(obj) {
  return this::is(obj) || this === obj
}

export function isTypeOf(type) {
  return this::typeOf()::is(type)
}

export function isIterable() {
  try {
    return this[Symbol.iterator]::isTypeOf('function')
  } catch {
    return false
  }
}

export function call(...args) {
  return this(...args)
}

export function iter() {
  if (!this::isIterable()) {
    throw new TypeError('object not iterable')
  } else {
    return this[Symbol.iterator]()
  }
}

export function isIterator() {
  if (!this::isIterable()) {
    return false
  } else {
    return this::iter()::is(this)
  }
}

function _kve(tp) {
  if (this::isInstanceOf(CommonCollections)) {
    if (tp::is('values') && Array.isArray(this)) {
      return this::iter()
    } else {
      return this[tp]()
    }
  } else if (this::isTypeOf('object')) {
    return Object[tp](this)::iter()
  } else {
    throw new TypeError(`object has no '${tp}'`)
  }
}

export function keys() {
  return this::_kve('keys')
}
export function values() {
  return this::_kve('values')
}
export function entries() {
  return this::_kve('entries')
}

export function isNullish() {
  return this === null || this === void 0
}

export function not() {
  return !this
}

export function* map(func, thisArg = void 0) {
  func = func.bind(thisArg)
  let idx = 0
  for (const item of this) {
    yield func(item, idx++, this)
  }
}

export function forEach(func, thisArg = void 0) {
  const r = this::map(func, thisArg)
  for (const item of r);
}

export function* filter(func, thisArg = void 0) {
  func = func.bind(thisArg)
  const r = this::map((item, idx, it) => [item, func(item, idx, it)])
  for (const [item, result] of r) {
    if (result) yield item
  }
}

export function* concat(...its) {
  for (const item of this) {
    yield item
  }
  for (const it of its) {
    for (const item of it) {
      yield item
    }
  }
}

export function next() {
  return this.next()
}

function parseSliceArg(...args) {
  let start, stop, step
  switch (args.length) {
    case 1:
      ;[stop] = args
      start = 0
      step = 1
      break
    case 2:
      ;[start, stop] = args
      step = 1
      break
    case 3:
      ;[start, stop, step] = args
      break
    default:
      throw new TypeError('invalid arguments')
  }
  return [start, stop, step]
}

export function* range(...args) {
  const [start, stop, step] = parseSliceArg(...args)
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    yield i
  }
}

export function times(times) {
  for (const i of range(times)) {
    this()
  }
}

export function drop(n = 1) {
  const it = this::iter()::it.next::times(n)
  return it
}

export function reduce(func, initialValue) {
  const it = this::iter()
  let accumulator
  let idx
  if (initialValue::isNullish()) {
    const first = it.next()
    if (first.done) {
      throw new TypeError('reduce of done iterator with no initial value')
    }
    accumulator = first.value
    idx = 1
  } else {
    accumulator = initialValue
    idx = 0
  }
  for (const item of it) {
    accumulator = func(accumulator, item, idx++, it)
  }
  return accumulator
}

export function every(func, thisArg = void 0) {
  func = func.bind(thisArg)
  for (const item of this) {
    if (!func(item)) return false
  }
  return true
}

export function some(func, thisArg = void 0) {
  func = func.bind(thisArg)
  for (const item of this) {
    if (func(item)) return true
  }
  return false
}

export function find(func, thisArg = void 0) {
  return this::filter(func, thisArg).next().value
}

export function findIndex(func, thisArg = void 0) {
  func = func.bind(thisArg)
  let index
  ;this::find((item, idx, it) => {
    const found = func(item, idx, it)
    if (found) index = idx
    return found
  })
  return index ?? -1
}

const TypedArray = Object.getPrototypeOf(Int32Array)
const CommonCollections = [Array, TypedArray, Map, Set]

export function isInstanceOf(classes) {
  if (
    !(
      Array.isArray(classes) ||
      classes::isInstanceOf(CommonCollections) ||
      classes::isIterator()
    )
  ) {
    classes = [classes]
  }
  return classes::some(cls => this instanceof cls)
}

export function isSubclassOf(classes) {
  if (!this::isTypeOf('function')) {
    return false
  }
  if (!(classes::isInstanceOf(CommonCollections) || classes::isIterator())) {
    classes = [classes]
  }
  return classes::some(cls => {
    if (cls::is(null)) return true
    let cur = this
    while (!cur::is(null)) {
      if (cur::is(cls)) return true
      cur = Object.getPrototypeOf(cur)
    }
    return false
  })
}

export function* flat(depth = 1) {
  for (const item of this) {
    if (
      !depth::sameValueZero(0) &&
      (item::isInstanceOf(CommonCollections) || item::isIterator())
    ) {
      for (const subitem of item::flat(depth - 1)) {
        yield subitem
      }
    } else yield item
  }
}

export function flatMap(func, thisArg = void 0) {
  return this::map(func, thisArg)::flat()
}

export function includes(searchElement, fromIndex = 0) {
  return this::drop(fromIndex)::some(x => x::sameValueZero(searchElement))
}

export function indexOf(searchElement, fromIndex = 0) {
  let result = fromIndex
  const it = this::drop(fromIndex)
  for (const item of it) {
    if (item === searchElement) return result
    ++result
  }
  return -1
}

export function join(separator) {
  separator = separator ?? ','
  const it = this::iter()
  let result = ''
  result += it.next().value ?? ''
  for (const item of it) {
    result += separator
    result += item ?? ''
  }
  return result
}

export function lastItem() {
  let item
  for (item of this);
  return item
}

export function* take(stop) {
  let idx = 0
  for (const item of this) {
    if (idx++ >= stop) break
    yield item
  }
}

export function* step(step) {
  let idx = 0
  for (const item of this) {
    if ((idx++ % step)::sameValueZero(0)) yield item
  }
}

export function piece(...args) {
  const [start, stop, stp] = parseSliceArg(...args)
  return this::drop(start)
    ::take(stop - start)
    ::step(stp)
}

export function slice(begin, end = void 0) {
  return this::piece(begin, end)
}

export function sort(compareFn = void 0) {
  const r = [...this]
  r.sort(compareFn)
  return r
}
