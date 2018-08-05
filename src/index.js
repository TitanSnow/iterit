function decorateFunction(origin, decorator, length = 0) {
    const decorated = decorator(origin)
    const decoratedLength = do {
        if (typeof length === 'string') {
            // '+1', '-1', etc
            const originLength = origin.length
            const relativeLength = Number.parseInt(length)
            originLength + relativeLength
        } else {
            length
        }
    }
    function modifyProperty(obj, prop, value) {
        Object.defineProperty(
            obj,
            prop,
            Object.assign(
                Object.getOwnPropertyDescriptor(
                    obj,
                    prop
                ),
                { value }
            )
        )
    }
    modifyProperty(decorated, 'name', origin.name)
    modifyProperty(decorated, 'length', decoratedLength)
    return decorated
}

export function curry() {
    return f => decorateFunction(f, f => (...args) => arg1 => f(arg1, ...args), '-1')
}

export const index = function index(obj, key) {
    return obj[key]
} |> curry()

export const bind = function bind(func, obj) {
    return func.bind(obj)
} |> curry()

export const getBound = function getBound(obj, key) {
    return obj
        |> index(key)
        |> bind(obj)
} |> curry()

export const typeOf = function typeOf(obj) {
    return typeof obj
} |> curry()

export const is = function is(a, b) {
    return Object.is(a, b)
} |> curry()

export const isIterable = function isIterable(obj) {
    return obj
        |> index(Symbol.iterator)
        |> typeOf()
        |> is('function')
} |> curry()

export const call = function call(func, ...args) {
    return func(...args)
} |> curry()

export const iter = function iter(obj) {
    if (obj |> isIterable() |> not()) {
        throw new TypeError('object not iterable')
    } else {
        return obj
            |> getBound(Symbol.iterator)
            |> call()
    }
} |> curry()

export const isIterator = function isIterator(obj) {
    if (obj |> isIterable() |> not()) {
        return false
    } else {
        return obj
            |> iter()
            |> is(obj)
    }
} |> curry()

export const keys = function keys(obj) {
    const keysFunc = obj |> index('keys')
    if (
        keysFunc
            |> typeOf()
            |> is('function')
    ) {
        return keysFunc
            |> bind(obj)
            |> call()
    } else if (
        obj
            |> typeOf()
            |> is('object')
    ) {
        return Object.keys(obj) |> iter()
    } else {
        throw new TypeError('object has no "keys"')
    }
} |> curry()

export const values = function values(obj) {
    const valuesFunc = obj |> index('values')
    if (
        valuesFunc
            |> typeOf()
            |> is('function')
    ) {
        return valuesFunc
            |> bind(obj)
            |> call()
    } else if (
        obj
            |> typeOf()
            |> is('object')
    ) {
        return Object.values(obj) |> iter()
    } else {
        throw new TypeError('object has no "values"')
    }
} |> curry()

export const entries = function entries(obj) {
    const entriesFunc = obj |> index('entries')
    if (
        entriesFunc
            |> typeOf()
            |> is('function')
    ) {
        return entriesFunc
            |> bind(obj)
            |> call()
    } else if (
        obj
            |> typeOf()
            |> is('object')
    ) {
        return Object.entries(obj) |> iter()
    } else {
        throw new TypeError('object has no "entries"')
    }
} |> curry()

export const isNullish = function isNullish(obj) {
    return obj === null || obj === void 0
} |> curry()

export const not = function not(obj) {
    return !obj
} |> curry()

export const map = function* map(it, func, thisArg) {
    if (thisArg |> isNullish() |> not()) {
        func = func |> bind(thisArg)
    }
    let idx = 0
    for (const item of it) {
        yield func(item, idx++, it)
    }
} |> curry()

export const forEach = function forEach(it, func, thisArg) {
    const r = it |> map(func, thisArg)
    for (const item of r);
} |> curry()
