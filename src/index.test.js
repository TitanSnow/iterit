import * as it from './index'
Object.assign(global, it)

test('index', () => {
  expect(index.name).toBe('index')
  expect(index.length).toBe(1)
  expect(
    {
      awd: 'dwa',
      def: 'ccc'
    }::index('awd')
  ).toBe('dwa')
  const sb1 = Symbol()
  const sb2 = Symbol()
  expect(
    {
      [sb1]: 'awd',
      [sb2]: 'dwa'
    }::index(sb2)
  ).toBe('dwa')
  class C {
    get awd() {
      return 'dwa'
    }
  }
  const o = new C()
  expect(o::index('awd')).toBe('dwa')
})

test('bind', () => {
  expect(bind.name).toBe('bind')
  expect(bind.length).toBe(1)
  function f() {
    return this
  }
  expect(f::bind(1)()).toBe(1)
  const o = {}
  expect(f::bind(o)()).toBe(o)
})

test('getBound', () => {
  expect(getBound.name).toBe('getBound')
  expect(getBound.length).toBe(1)
  class C {
    awd() {
      return this
    }
  }
  const o = new C()
  expect(o::getBound('awd')()).toBe(o)
  const o2 = {
    dwa() {
      return this
    }
  }
  expect(o2::getBound('dwa')()).toBe(o2)
})

test('typeOf', () => {
  expect(typeOf.name).toBe('typeOf')
  expect(typeOf.length).toBe(0)
  expect('awd'::typeOf()).toBe('string')
  expect({}::typeOf()).toBe('object')
  expect(Symbol()::typeOf()).toBe('symbol')
  expect(null::typeOf()).toBe('object')
  expect(1::typeOf()).toBe('number')
  const dwa = void 0
  expect(dwa::typeOf()).toBe('undefined')
  let awd
  expect(awd::typeOf()).toBe('undefined')
  expect(true::typeOf()).toBe('boolean')
})

test('is', () => {
  expect(is.name).toBe('is')
  expect(is.length).toBe(1)
  const undefined = void 0
  expect(undefined::is(undefined)).toBe(true)
  expect(null::is(null)).toBe(true)
  expect(true::is(true)).toBe(true)
  expect('foo'::is('foo')).toBe(true)
  expect(0::is(0)).toBe(true)
  const p0 = +0
  const n0 = -0
  expect(p0::is(-0)).toBe(false)
  expect(p0::is(0)).toBe(true)
  expect(n0::is(0)).toBe(false)
  expect(0::is(false)).toBe(false)
  expect(''::is(false)).toBe(false)
  expect('0'::is(0)).toBe(false)
  expect('17'::is(17)).toBe(false)
  expect([1, 2]::is('1,2')).toBe(false)
  expect(new String('foo')::is('foo')).toBe(false)
  expect(null::is(undefined)).toBe(false)
  expect(NaN::is(NaN)).toBe(true)
})

test('sameValueZero', () => {
  expect(sameValueZero.name).toBe('sameValueZero')
  expect(sameValueZero.length).toBe(1)
  const undefined = void 0
  expect(undefined::sameValueZero(undefined)).toBe(true)
  expect(null::sameValueZero(null)).toBe(true)
  expect(true::sameValueZero(true)).toBe(true)
  expect('foo'::sameValueZero('foo')).toBe(true)
  expect(0::sameValueZero(0)).toBe(true)
  const p0 = +0
  const n0 = -0
  expect(p0::sameValueZero(-0)).toBe(true)
  expect(p0::sameValueZero(0)).toBe(true)
  expect(n0::sameValueZero(0)).toBe(true)
  expect(0::sameValueZero(false)).toBe(false)
  expect(''::sameValueZero(false)).toBe(false)
  expect('0'::sameValueZero(0)).toBe(false)
  expect('17'::sameValueZero(17)).toBe(false)
  expect([1, 2]::sameValueZero('1,2')).toBe(false)
  expect(new String('foo')::sameValueZero('foo')).toBe(false)
  expect(null::sameValueZero(undefined)).toBe(false)
  expect(NaN::sameValueZero(NaN)).toBe(true)
})

test('isTypeOf', () => {
  expect(isTypeOf.name).toBe('isTypeOf')
  expect(isTypeOf.length).toBe(1)
  expect('awd'::isTypeOf('string')).toBe(true)
  expect({}::isTypeOf('object')).toBe(true)
  expect(Symbol()::isTypeOf('symbol')).toBe(true)
  expect(null::isTypeOf('object')).toBe(true)
  expect(1::isTypeOf('number')).toBe(true)
  const dwa = void 0
  expect(dwa::isTypeOf('undefined')).toBe(true)
  let awd
  expect(awd::isTypeOf('undefined')).toBe(true)
  expect(true::isTypeOf('boolean')).toBe(true)
  expect(0::isTypeOf('object')).toBe(false)
})

test('isIterable', () => {
  expect(isIterable.name).toBe('isIterable')
  expect(isIterable.length).toBe(0)
  expect({}::isIterable()).toBe(false)
  const undefined = void 0
  expect(undefined::isIterable()).toBe(false)
  expect(null::isIterable()).toBe(false)
  class C {}
  const o = new C()
  expect(o::isIterable()).toBe(false)
  C.prototype[Symbol.iterator] = function() {
    return [1, 2, 3][Symbol.iterator]()
  }
  expect(o::isIterable()).toBe(true)
  expect([1, 2, 3]::isIterable()).toBe(true)
  expect(new Int32Array()::isIterable()).toBe(true)
  expect(new Map()::isIterable()).toBe(true)
  expect(new Set()::isIterable()).toBe(true)
  expect('awd'::isIterable()).toBe(true)
  expect(new WeakMap()::isIterable()).toBe(false)
  expect(new WeakSet()::isIterable()).toBe(false)
  expect([1, 2, 3].entries()::isIterable()).toBe(true)
  expect(new Map().entries()::isIterable()).toBe(true)
  expect(Object.keys({})::isIterable()).toBe(true)
  expect('awd'[Symbol.iterator]()::isIterable()).toBe(true)
  expect(
    function*() {
      yield 0
    }::isIterable()
  ).toBe(false)
  expect(
    (function*() {
      yield 0
    })()::isIterable()
  ).toBe(true)
})

test('call', () => {
  expect(call.name).toBe('call')
  expect(call.length).toBe(0)
  function awd(...args) {
    return args
  }
  expect(awd::call(1, 2, 3)).toEqual([1, 2, 3])
})

test('iter', () => {
  expect(iter.name).toBe('iter')
  expect(iter.length).toBe(0)
  expect(() => void null::iter()).toThrow()
  expect(() => void {}::iter()).toThrow()
  class C {}
  const o = new C()
  expect(() => void o::iter()).toThrow()
  const sb = Symbol()
  C.prototype[Symbol.iterator] = function() {
    return sb
  }
  expect(o::iter()).toBe(sb)
  expect([...[1, 2, 3]::iter()]).toEqual([1, 2, 3])
  expect([1, 2, 3]::iter()).not.toEqual([1, 2, 3])
})
