function decorateFunction(origin, decorator, length = 0) {
    const decorated = decorator(origin)
    const decoratedLength = do {
        if (typeof length === 'string') {
            // '+1', '-1', etc
            const originLength = origin.length
            const relativeLength = Number.parseInt(length)
            Math.max(0, originLength + relativeLength)
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

export const isTypeOf = function isTypeOf(obj, type) {
    return obj
        |> typeOf()
        |> is(type)
} |> curry()

export const isIterable = function isIterable(obj) {
    return obj
        |> index(Symbol.iterator)
        |> isTypeOf('function')
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
    if (keysFunc |> isTypeOf('function')) {
        return keysFunc
            |> bind(obj)
            |> call()
    } else if (obj |> isTypeOf('object')) {
        return Object.keys(obj) |> iter()
    } else {
        throw new TypeError('object has no "keys"')
    }
} |> curry()

export const values = function values(obj) {
    const valuesFunc = obj |> index('values')
    if (valuesFunc |> isTypeOf('function')) {
        return valuesFunc
            |> bind(obj)
            |> call()
    } else if (obj |> isTypeOf('object')) {
        return Object.values(obj) |> iter()
    } else {
        throw new TypeError('object has no "values"')
    }
} |> curry()

export const entries = function entries(obj) {
    const entriesFunc = obj |> index('entries')
    if (entriesFunc |> isTypeOf('function')) {
        return entriesFunc
            |> bind(obj)
            |> call()
    } else if (obj |> isTypeOf('object')) {
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
    func = func |> bind(thisArg)
    let idx = 0
    for (const item of it) {
        yield func(item, idx++, it)
    }
} |> curry()

export const forEach = function forEach(it, func, thisArg) {
    const r = it |> map(func, thisArg)
    for (const item of r);
} |> curry()

export const filter = function* filter(it, func, thisArg) {
    func = func |> bind(thisArg)
    const r = it |> map((item, idx, it) => [item, func(item, idx, it)])
    for (const [item, result] of r) {
        if (result) yield item
    }
} |> curry()

export const concat = function* concat(...its) {
    for (const it of its) {
        for (const item of it) {
            yield item
        }
    }
} |> curry()

export const next = function next(it) {
    return it.next()
} |> curry()

export const range = function* range(...args) {
    let start, stop, step
    switch (args.length) {
        case 1:
            [stop] = args
            start = 0
            step = 1
            break
        case 2:
            [start, stop] = args
            step = 1
            break
        case 3:
            [start, stop, step] = args
            break
        default:
            throw new TypeError('invalid arguments')
    }
    for (let i = start; step > 0 ? i < stop : i > stop ; i += step) {
        yield i
    }
}

export const times = function times(func, times) {
    for (const i of range(times)) {
        func()
    }
} |> curry()

export const drop = function drop(it, n = 1) {
    it = it |> iter()
    it |> getBound('next') |> times(n)
    return it
} |> curry()

export const reduce = function reduce(it, func, initialValue) {
    it = it |> iter()
    let accumulator
    let idx
    if (initialValue |> isNullish()) {
        accumulator = it |> next() |> index('value')
        idx = 1
    } else {
        accumulator = initialValue
        idx = 0
    }
    for (const item of it) {
        accumulator = func(accumulator, item, idx++, it)
    }
    return accumulator
} |> curry()
