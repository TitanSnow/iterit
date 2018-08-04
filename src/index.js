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

export function curry(f) {
    return decorateFunction(f, f => (...args) => arg1 => f(arg1, ...args), '-1')
}
