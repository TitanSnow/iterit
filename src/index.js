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

const _kve = (obj, tp) => {
    if (obj |> isInstanceOf(CommonCollections)) {
        return obj[tp]()
    } else if (obj |> isTypeOf('object')) {
        return Object[tp](obj) |> iter()
    } else {
        throw new TypeError(`object has no '${tp}'`)
    }
}

export let keys = obj => _kve(obj, 'keys')
keys = keys |> curry()
export let values = obj => _kve(obj, 'values')
values = values |> curry()
export let entries = obj => _kve(obj, 'entries')
entries = entries |> curry()

export const isNullish = function isNullish(obj) {
    return obj === null || obj === void 0
} |> curry()

export const not = function not(obj) {
    return !obj
} |> curry()

export const and = function and(it) {
    return it |> every(x => x)
} |> curry()

export const or = function or(it) {
    return it |> some(x => x)
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
        const first = it |> next()
        if (first |> index('done')) {
            throw new TypeError('reduce of done iterator with no initial value')
        }
        accumulator = first |> index('value')
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

export const every = function every(it, func, thisArg) {
    func = func |> bind(thisArg)
    for (const item of it) {
        if (item |> func |> not()) return false
    }
    return true
} |> curry()

export const some = function some(it, func, thisArg) {
    func = func |> bind(thisArg)
    for (const item of it) {
        if (item |> func) return true
    }
    return false
} |> curry()

export const find = function find(it, func, thisArg) {
    return it
        |> filter(func, thisArg)
        |> next()
        |> index('value')
} |> curry()

export const findIndex = function findIndex(it, func, thisArg) {
    func = func |> bind(thisArg)
    let index
    it |> find((item, idx, it) => {
        const found = func(item, idx, it)
        if (found) index = idx
        return found
    })
    return index ?? -1
} |> curry()

const TypedArray = Object.getPrototypeOf(Int32Array)
const CommonCollections = [
    Array,
    TypedArray,
    Map,
    Set,
]

export const isInstanceOf = function isInstanceOf(obj, classes) {
    if (!Array.isArray(classes)) {
        classes = [classes]
    }
    return classes
        |> some(cls => obj instanceof cls)
} |> curry()

export const isSubclassOf = function isSubclassOf(subcls, classes) {
    if (subcls |> isTypeOf('function') |> not()) {
        return false
    }
    if (!Array.isArray(classes)) {
        classes = [classes]
    }
    return classes
        |> some(cls => {
            let cur = subcls
            while (cur |> is(null) |> not()) {
                if (cur |> is(cls)) return true
                cur = Object.getPrototypeOf(cur)
            }
            return false
        })
} |> curry()

const _flat = function* flat(it, depth = 1) {
    for (const item of it) {
        if (
            (depth |> is(0) |> not()) &&
            (
                (item |> isInstanceOf(CommonCollections)) ||
                (item |> isIterator())
            )
        ) {
            for (const subitem of item |> _flat(depth - 1)) {
                yield subitem
            }
        } else yield item
    }
} |> curry()
export const flat = _flat
