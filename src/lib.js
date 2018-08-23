export function index(key) {
  return this[key]
}

export function bind(thisArg, ...args) {
  return this.bind(thisArg, ...args)
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
  if (this::isInstanceOf(...CommonCollections)) {
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

class NoClosing {
  constructor(iterable) {
    this.iter = iterable::iter()
  }
  next() {
    return this.iter.next()
  }
  [Symbol.iterator]() {
    return this
  }
}

const no_closing = it => new NoClosing(it)

export function* map(func, thisArg = void 0) {
  func = func.bind(thisArg)
  let idx = 0
  for (const item of no_closing(this)) {
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
  yield* this
  for (const it of its) {
    if (it::isInstanceOf(...CommonCollections) || it::isIterator()) {
      yield* it
    } else {
      yield it
    }
  }
}

export function* concatFront(...its) {
  for (const it of its) {
    if (it::isInstanceOf(...CommonCollections) || it::isIterator()) {
      yield* it
    } else {
      yield it
    }
  }
  yield* this
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

export const range = (...args) => {
  const [start, stop, step] = parseSliceArg(...args)
  return (function*() {
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
      yield i
    }
  })()
}
Object.defineProperty(
  range,
  'length',
  Object.assign(Object.getOwnPropertyDescriptor(range, 'length'), { value: 1 })
)

export function loop(times) {
  for (const i of range(times)) {
    this()
  }
}

export function times(func) {
  for (const i of range(this)) {
    func()
  }
}

export function drop(n = 1) {
  const it = this::iter()
  ;it::next::loop(n)
  return it
}

export function reduce(func, initialValue = void 0) {
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
  for (const item of no_closing(it)) {
    accumulator = func(accumulator, item, idx++, this)
  }
  return accumulator
}

export function every(func, thisArg = void 0) {
  func = func.bind(thisArg)
  for (const item of no_closing(this)) {
    if (!func(item)) return false
  }
  return true
}

export function some(func, thisArg = void 0) {
  func = func.bind(thisArg)
  for (const item of no_closing(this)) {
    if (func(item)) return true
  }
  return false
}

export function find(func, thisArg = void 0) {
  return this::filter(func, thisArg)::firstItem()
}

export function findIndex(func, thisArg = void 0) {
  func = func.bind(thisArg)
  const r = this::enumerate()::find(([item], idx, it) => func(item, idx, it))
  return r::is(void 0) ? -1 : r[1]
}

const TypedArray = Object.getPrototypeOf(Int32Array)
const CommonCollections = [Array, TypedArray, Map, Set]

export function isInstanceOf(...classes) {
  return classes::some(cls => this instanceof cls)
}

export function isSubclassOf(...classes) {
  if (!this::isTypeOf('function')) {
    return false
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
  for (const item of no_closing(this)) {
    if (
      !depth::sameValueZero(0) &&
      (item::isInstanceOf(...CommonCollections) || item::isIterator())
    ) {
      yield* item::flat(depth - 1)
    } else {
      yield item
    }
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
  for (const item of no_closing(it)) {
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
  for (const item of no_closing(it)) {
    result += separator
    result += item ?? ''
  }
  return result
}

export function lastItem() {
  let item
  for (item of no_closing(this));
  return item
}

export function* take(stop) {
  if (!stop::sameValueZero(0))
    for (const [item, idx] of this::enumerate()) {
      yield item
      if (idx + 1 >= stop) break
    }
}

export function* step(step) {
  for (const [item, idx] of this::enumerate()) {
    if ((idx % step)::sameValueZero(0)) yield item
  }
}

export function piece(...args) {
  const [start, stop, stp] = parseSliceArg(...args)
  return this::drop(start)
    ::take(stop - start)
    ::step(stp)
}
Object.defineProperty(
  piece,
  'length',
  Object.assign(Object.getOwnPropertyDescriptor(piece, 'length'), { value: 1 })
)

export function slice(begin, end) {
  if (begin::isNullish()) begin = 0
  return this::piece(begin, end)
}

// I dislike this
// export function sort(compareFn = void 0) {
//   const r = [...this]
//   r.sort(compareFn)
//   return r
// }

export function toArray() {
  return [...this]
}

export function* chunk(size) {
  size = size ?? 1
  const it = this::iter()
  let chunk
  while ((chunk = it::take(size)::toArray()).length) {
    yield chunk
  }
}

export function compact() {
  return this::filter(x => x)
}

export function dropWhile(func, thisArg = void 0) {
  const it = this::iter()
  func = func.bind(thisArg)
  let last
  if (
    it::every((item, ...rest) => {
      last = item
      return func(item, ...rest)
    })
  )
    return it
  else return [last]::concat(it)
}

export function* fill(value, start = 0, end = void 0) {
  for (const [item, idx] of this::enumerate()) {
    if (idx >= start && (end::is(void 0) || idx < end)) {
      yield value
    } else {
      yield item
    }
  }
}

export function flatDeep() {
  return this::flat(1 / 0)
}

export function fromEntries() {
  const obj = {}
  ;this::forEach(([key, value]) => (obj[key] = value))
  return obj
}

export function firstItem() {
  return this::iter().next().value
}

export function* dropLast() {
  const it = this::iter()
  let last = it::firstItem()
  for (const item of no_closing(it)) {
    yield last
    last = item
  }
}

export function nth(n) {
  n = n ?? 0
  return this::filter((item, idx) => idx::sameValueZero(n))::firstItem()
}

export function* takeWhile(func, thisArg = void 0) {
  func = func.bind(thisArg)
  for (const item of no_closing(this)) {
    if (func(item)) yield item
    else break
  }
}

export function* zip(...its) {
  if (!this::isNullish()) {
    its = its::concatFront([this])
  }
  its = its::map(it => it::iter())::toArray()
  while (true) {
    const result = its::map(it => it.next())::toArray()
    if (result::some(r => r.done)) break
    yield result::map(r => r.value)::toArray()
  }
}

export function* zipLongest(...its) {
  if (!this::isNullish()) {
    its = its::concatFront([this])
  }
  its = its::map(it => it::iter())::toArray()
  while (true) {
    const result = its::map(it => it.next())::toArray()
    if (result::every(r => r.done)) break
    yield result::map(r => r.value)::toArray()
  }
}

export const count = (start = 0, step = 1) => {
  return (function*() {
    for (let i = start; ; i += step) yield i
  })()
}

export function enumerate() {
  return this::zip(count())
}

export function unzip() {
  return zip(...this)
}

export function* splice(start, deleteCount, ...newItems) {
  const it = this::iter()
  yield* it::take(start)
  yield* newItems
  if (!deleteCount::isNullish()) {
    yield* it::drop(deleteCount)
  }
}

export function countBy(func) {
  return this::reduce((map, item) => {
    const key = func(item)
    map.set(key, (map.get(key) ?? 0) + 1)
    return map
  }, new Map())
}

export function groupBy(func) {
  return this::reduce((map, item) => {
    const key = func(item)
    const value = map.get(key) ?? []
    value.push(item)
    map.set(key, value)
    return map
  }, new Map())
}

export function keyBy(func) {
  return this::reduce((map, item) => {
    const key = func(item)
    map.set(key, item)
    return map
  }, new Map())
}

// I dislike this
// export function invokeMap(path, ...args) {
//   if (path::isTypeOf('string')) {
//     path = path.split('.')
//   }
//   if (path::isInstanceOf(...CommonCollections) || path::isIterator()) {
//     const methodPath = path::toArray()
//     path = o =>
//       methodPath
//         ::dropLast()
//         ::reduce((o, idx) => o[idx], o)
//         ::getBound(methodPath::lastItem())
//         ::call(...args)
//   }
//   return this::map(path)
// }

export function partition(func, thisArg = void 0) {
  func = func.bind(thisArg)
  const r = [[], []]
  const t = [x => x, x => !x]
  const it = this::iter()
  function* f() {
    while (true) {
      if (r[this].length) yield r[this].shift()
      else {
        let nxt
        while (true) {
          nxt = it.next()
          if (nxt.done) return
          if (t[this](func(nxt.value))) {
            yield nxt.value
            break
          } else {
            r[this ^ 1].push(nxt.value)
          }
        }
      }
    }
  }
  return [f.call(0), f.call(1)]
}

export function reject(func, thisArg = void 0) {
  func = func.bind(thisArg)
  return this::filter((...args) => !func(...args))
}

export function length() {
  let len = 0
  ;this::forEach(() => ++len)
  return len
}

export function* cycle(times = 1 / 0) {
  const chunk = this::toArray()
  for (const i of range(times)) yield* chunk
}

export const repeat = (elem, times = 1 / 0) => {
  return [elem]::cycle(times)
}

class List {
  constructor(value) {
    this.value = value
    this.next = void 0
  }
}

const teeSymbol = Symbol('tee')
export function tee(n = 2) {
  if (this.hasOwnProperty(teeSymbol)) {
    return this[teeSymbol](n)
  } else if (this::iter()::is(this::iter())) {
    const it = this::iter()
    const genTee = list => {
      const teeIter = (function*() {
        while (true) {
          if (list.next::is(void 0)) {
            const { value, done } = it.next()
            if (done) return
            list.next = new List(value)
          }
          yield (list = list.next).value
        }
      })()
      teeIter[teeSymbol] = n => {
        if (n === 0) return []
        return [teeIter, ...range(n - 1)::map(() => genTee(list))]
      }
      return teeIter
    }
    return Array(n)
      .fill(new List())
      ::map(genTee)
      ::toArray()
  } else {
    return range(n)
      ::map(() => this::iter())
      ::toArray()
  }
}

export function* accumulate(func = (a, b) => a + b) {
  const it = this::iter()
  const fst = it.next()
  if (fst.done) return
  let total = fst.value
  yield total
  for (const element of no_closing(it)) {
    total = func(total, element)
    yield total
  }
}

export function compress(selectors) {
  return this::zip(selectors)
    ::filter(([d, s]) => s)
    ::map(([d]) => d)
}

export function spreadMap(func) {
  return this::map(elem => func(...elem))
}

export function sum() {
  return this::reduce((a, b) => a + b)
}
