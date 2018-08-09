import * as it from './lib'

test('index', () => {
  expect(it.index.name).toBe('index')
  expect(it.index.length).toBe(1)
  expect(
    {
      awd: 'dwa',
      def: 'ccc'
    }::it.index('awd')
  ).toBe('dwa')
  const sb1 = Symbol()
  const sb2 = Symbol()
  expect(
    {
      [sb1]: 'awd',
      [sb2]: 'dwa'
    }::it.index(sb2)
  ).toBe('dwa')
  class C {
    get awd() {
      return 'dwa'
    }
  }
  const o = new C()
  expect(o::it.index('awd')).toBe('dwa')
})

test('bind', () => {
  expect(it.bind.name).toBe('bind')
  expect(it.bind.length).toBe(1)
  function f() {
    return this
  }
  expect(f::it.bind(1)()).toBe(1)
  const o = {}
  expect(f::it.bind(o)()).toBe(o)
})

test('getBound', () => {
  expect(it.getBound.name).toBe('getBound')
  expect(it.getBound.length).toBe(1)
  class C {
    awd() {
      return this
    }
  }
  const o = new C()
  expect(o::it.getBound('awd')()).toBe(o)
  const o2 = {
    dwa() {
      return this
    }
  }
  expect(o2::it.getBound('dwa')()).toBe(o2)
})

test('typeOf', () => {
  expect(it.typeOf.name).toBe('typeOf')
  expect(it.typeOf.length).toBe(0)
  expect('awd'::it.typeOf()).toBe('string')
  expect({}::it.typeOf()).toBe('object')
  expect(Symbol()::it.typeOf()).toBe('symbol')
  expect(null::it.typeOf()).toBe('object')
  expect(1::it.typeOf()).toBe('number')
  expect((void 0)::it.typeOf()).toBe('undefined')
  let awd
  expect(awd::it.typeOf()).toBe('undefined')
  expect(true::it.typeOf()).toBe('boolean')
})

test('is', () => {
  expect(it.is.name).toBe('is')
  expect(it.is.length).toBe(1)
  expect((void 0)::it.is(void 0)).toBe(true)
  expect(null::it.is(null)).toBe(true)
  expect(true::it.is(true)).toBe(true)
  expect('foo'::it.is('foo')).toBe(true)
  expect(0::it.is(0)).toBe(true)
  expect((+0)::it.is(-0)).toBe(false)
  expect((+0)::it.is(0)).toBe(true)
  expect((-0)::it.is(0)).toBe(false)
  expect(0::it.is(false)).toBe(false)
  expect(''::it.is(false)).toBe(false)
  expect('0'::it.is(0)).toBe(false)
  expect('17'::it.is(17)).toBe(false)
  expect([1, 2]::it.is('1,2')).toBe(false)
  expect(new String('foo')::it.is('foo')).toBe(false)
  expect(null::it.is(void 0)).toBe(false)
  expect(NaN::it.is(NaN)).toBe(true)
})

test('sameValueZero', () => {
  expect(it.sameValueZero.name).toBe('sameValueZero')
  expect(it.sameValueZero.length).toBe(1)
  expect((void 0)::it.sameValueZero(void 0)).toBe(true)
  expect(null::it.sameValueZero(null)).toBe(true)
  expect(true::it.sameValueZero(true)).toBe(true)
  expect('foo'::it.sameValueZero('foo')).toBe(true)
  expect(0::it.sameValueZero(0)).toBe(true)
  expect((+0)::it.sameValueZero(-0)).toBe(true)
  expect((+0)::it.sameValueZero(0)).toBe(true)
  expect((-0)::it.sameValueZero(0)).toBe(true)
  expect(0::it.sameValueZero(false)).toBe(false)
  expect(''::it.sameValueZero(false)).toBe(false)
  expect('0'::it.sameValueZero(0)).toBe(false)
  expect('17'::it.sameValueZero(17)).toBe(false)
  expect([1, 2]::it.sameValueZero('1,2')).toBe(false)
  expect(new String('foo')::it.sameValueZero('foo')).toBe(false)
  expect(null::it.sameValueZero(void 0)).toBe(false)
  expect(NaN::it.sameValueZero(NaN)).toBe(true)
})

test('isTypeOf', () => {
  expect(it.isTypeOf.name).toBe('isTypeOf')
  expect(it.isTypeOf.length).toBe(1)
  expect('awd'::it.isTypeOf('string')).toBe(true)
  expect({}::it.isTypeOf('object')).toBe(true)
  expect(Symbol()::it.isTypeOf('symbol')).toBe(true)
  expect(null::it.isTypeOf('object')).toBe(true)
  expect(1::it.isTypeOf('number')).toBe(true)
  expect((void 0)::it.isTypeOf('undefined')).toBe(true)
  let awd
  expect(awd::it.isTypeOf('undefined')).toBe(true)
  expect(true::it.isTypeOf('boolean')).toBe(true)
  expect(0::it.isTypeOf('object')).toBe(false)
})

test('isIterable', () => {
  expect(it.isIterable.name).toBe('isIterable')
  expect(it.isIterable.length).toBe(0)
  expect({}::it.isIterable()).toBe(false)
  expect((void 0)::it.isIterable()).toBe(false)
  expect(null::it.isIterable()).toBe(false)
  class C {}
  const o = new C()
  expect(o::it.isIterable()).toBe(false)
  C.prototype[Symbol.iterator] = function() {
    return [1, 2, 3][Symbol.iterator]()
  }
  expect(o::it.isIterable()).toBe(true)
  expect([1, 2, 3]::it.isIterable()).toBe(true)
  expect(new Int32Array()::it.isIterable()).toBe(true)
  expect(new Map()::it.isIterable()).toBe(true)
  expect(new Set()::it.isIterable()).toBe(true)
  expect('awd'::it.isIterable()).toBe(true)
  expect(new WeakMap()::it.isIterable()).toBe(false)
  expect(new WeakSet()::it.isIterable()).toBe(false)
  expect([1, 2, 3].entries()::it.isIterable()).toBe(true)
  expect(new Map().entries()::it.isIterable()).toBe(true)
  expect(Object.keys({})::it.isIterable()).toBe(true)
  expect('awd'[Symbol.iterator]()::it.isIterable()).toBe(true)
  expect(
    function*() {
      yield 0
    }::it.isIterable()
  ).toBe(false)
  expect(
    (function*() {
      yield 0
    })()::it.isIterable()
  ).toBe(true)
})

test('call', () => {
  expect(it.call.name).toBe('call')
  expect(it.call.length).toBe(0)
  function awd(...args) {
    return args
  }
  expect(awd::it.call(1, 2, 3)).toEqual([1, 2, 3])
})

test('iter', () => {
  expect(it.iter.name).toBe('iter')
  expect(it.iter.length).toBe(0)
  expect(() => void null::it.iter()).toThrow()
  expect(() => void {}::it.iter()).toThrow()
  class C {}
  const o = new C()
  expect(() => void o::it.iter()).toThrow()
  const sb = Symbol()
  C.prototype[Symbol.iterator] = function() {
    return sb
  }
  expect(o::it.iter()).toBe(sb)
  expect([...[1, 2, 3]::it.iter()]).toEqual([1, 2, 3])
  expect([1, 2, 3]::it.iter()).not.toEqual([1, 2, 3])
})

test('isIterator', () => {
  expect(it.isIterator.name).toBe('isIterator')
  expect(it.isIterator.length).toBe(0)
  const a = [1, 2, 3]
  expect(a::it.isIterator()).toBe(false)
  expect(a::it.iter()::it.isIterator()).toBe(true)
  const b = new Set(a)
  expect(b::it.values()::it.isIterator()).toBe(true)
  expect('awd'::it.isIterator()).toBe(false)
  expect('awd'::it.iter()::it.isIterator()).toBe(true)
  class C {
    [Symbol.iterator]() {
      return 'awd'
    }
  }
  const c = new C()
  expect(c::it.isIterable()).toBe(true)
  expect(c::it.isIterator()).toBe(false)
  C.prototype[Symbol.iterator] = function() {
    return this
  }
  expect(c::it.isIterator()).toBe(true)
  expect(null::it.isIterator()).toBe(false)
  expect({}::it.isIterator()).toBe(false)
})

test('keys', () => {
  expect(it.keys.name).toBe('keys')
  expect(it.keys.length).toBe(0)
  const o = { awd: 'dwa', def: 'ccc' }
  expect(o::it.keys()::it.isIterator()).toBe(true)
  expect([...o::it.keys()]::it.sort()).toEqual(['awd', 'def']::it.sort())
  const a = [1, 2, 3]
  expect(a::it.keys()::it.isIterator()).toBe(true)
  expect([...a::it.keys()]).toEqual([0, 1, 2])
  const sb = Symbol()
  const m = new Map([['awd', 'dwa'], ['def', 'ccc'], [sb, 'zzz']])
  expect(m::it.keys()::it.isIterator()).toBe(true)
  const cp = o => o.toString()
  expect([...m::it.keys()]::it.sort(cp)).toEqual(
    ['awd', 'def', sb]::it.sort(cp)
  )
  const s = new Set(a)
  expect(s::it.keys()::it.isIterator()).toBe(true)
  expect([...s::it.keys()]::it.sort()).toEqual([1, 2, 3]::it.sort())
  expect(1::it.keys).toThrow()
  expect(sb::it.keys).toThrow()
})

test('values', () => {
  expect(it.values.name).toBe('values')
  expect(it.values.length).toBe(0)
  const o = { awd: 'dwa', def: 'ccc' }
  expect(o::it.values()::it.isIterator()).toBe(true)
  expect([...o::it.values()]::it.sort()).toEqual(['dwa', 'ccc']::it.sort())
  const a = [1, 2, 3]
  expect(a::it.values()::it.isIterator()).toBe(true)
  expect([...a::it.values()]).toEqual([1, 2, 3])
  const sb = Symbol()
  const m = new Map([['awd', 'dwa'], ['def', 'ccc'], [sb, 'zzz']])
  expect(m::it.values()::it.isIterator()).toBe(true)
  const cp = o => o.toString()
  expect([...m::it.values()]::it.sort(cp)).toEqual(
    ['dwa', 'ccc', 'zzz']::it.sort(cp)
  )
  const s = new Set(a)
  expect(s::it.values()::it.isIterator()).toBe(true)
  expect([...s::it.values()]::it.sort()).toEqual([1, 2, 3]::it.sort())
  expect(1::it.values).toThrow()
  expect(sb::it.values).toThrow()
})

test('entries', () => {
  expect(it.entries.name).toBe('entries')
  expect(it.entries.length).toBe(0)
  const o = { awd: 'dwa', def: 'ccc' }
  expect(o::it.entries()::it.isIterator()).toBe(true)
  expect([...o::it.entries()]::it.sort()).toEqual(
    [['awd', 'dwa'], ['def', 'ccc']]::it.sort()
  )
  const a = [1, 2, 3]
  expect(a::it.entries()::it.isIterator()).toBe(true)
  expect([...a::it.entries()]).toEqual([[0, 1], [1, 2], [2, 3]])
  const sb = Symbol()
  const m = new Map([['awd', 'dwa'], ['def', 'ccc'], [sb, 'zzz']])
  expect(m::it.entries()::it.isIterator()).toBe(true)
  const cp = o => o.toString()
  expect([...m::it.entries()]::it.sort(cp)).toEqual(
    [['awd', 'dwa'], ['def', 'ccc'], [sb, 'zzz']]::it.sort(cp)
  )
  const s = new Set(a)
  expect(s::it.entries()::it.isIterator()).toBe(true)
  expect([...s::it.entries()]::it.sort()).toEqual(
    [[1, 1], [2, 2], [3, 3]]::it.sort()
  )
  expect(1::it.entries).toThrow()
  expect(sb::it.entries).toThrow()
})

test('isNullish', () => {
  expect(it.isNullish.name).toBe('isNullish')
  expect(it.isNullish.length).toBe(0)
  expect(null::it.isNullish()).toBe(true)
  expect((void 0)::it.isNullish()).toBe(true)
  expect(false::it.isNullish()).toBe(false)
})

test('not', () => {
  expect(it.not.name).toBe('not')
  expect(it.not.length).toBe(0)
  expect(true::it.not()).toBe(false)
  expect(false::it.not()).toBe(true)
  expect(1::it.not()).toBe(false)
  expect(0::it.not()).toBe(true)
})

test('map', () => {
  expect(it.map.name).toBe('map')
  expect(it.map.length).toBe(1)
  const a = [1, 2, 3]
  const m2 = x => x * 2
  expect(a::it.map(m2)::it.isIterator()).toBe(true)
  expect([...a::it.map(m2)]).toEqual([2, 4, 6])
  const etf = (item, idx) => [item, idx]
  expect([...a::it.map(etf)]).toEqual([[1, 0], [2, 1], [3, 2]])
  const slf = (item, idx, it) => it
  expect([...a::it.map(slf)][2]).toBe(a)
  let iter = a::it.iter()
  expect([...iter::it.map(slf)][2]).toBe(iter)
  iter = a::it.iter()
  const skp = (item, idx, it) => it.next().value
  expect([...iter::it.map(skp)]).toEqual([2, void 0])
  const thr = () => {
    throw 'awd'
  }
  expect(a::it.map(thr)::it.isIterator()).toBe(true)
  expect(a::it.map(thr).next).toThrow()
  function ths(x) {
    return x * this
  }
  expect(a::it.map(ths, 2)::it.toArray()).toEqual([2, 4, 6])
})
