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

const getIteratorFactory = function getIteratorFactory(obj) {
    return obj
        |> getBound(Symbol.iterator)
} |> curry()

export const typeOf = function typeOf(obj) {
    return typeof obj
} |> curry()

export const is = function is(a, b) {
    return Object.is(a, b)
} |> curry()

export const isIterable = function isIterable(obj) {
    return obj
        |> getIteratorFactory()
        |> typeOf()
        |> is('function')
} |> curry()

export const call = function call(func, ...args) {
    return func(...args)
} |> curry()

export const iter = function iter(obj) {
    if (!(obj |> isIterable())) {
        throw new TypeError('object not iterable')
    } else {
        return obj
            |> getIteratorFactory()
            |> call()
    }
} |> curry()

export const isIterator = function isIterator(obj) {
    if (!(obj |> isIterable())) {
        return false
    } else {
        return obj
            |> iter()
            |> is(obj)
    }
} |> curry()
