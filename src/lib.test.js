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
