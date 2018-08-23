# iterit
Itertools for Future ECMAScript

[![build](https://flat.badgen.net/travis/TitanSnow/iterit?icon=travis&label=build)](https://travis-ci.org/TitanSnow/iterit)
[![coverage](https://flat.badgen.net/codecov/c/github/TitanSnow/iterit?icon=codecov)](https://codecov.io/gh/TitanSnow/iterit)
[![version](https://flat.badgen.net/npm/v/iterit?icon=npm&label=version)](https://www.npmjs.com/package/iterit)
[![license](https://flat.badgen.net/npm/license/iterit)](LICENSE)

## Installation
```console
$ npm i iterit      # or
$ yarn add iterit
```

## Usage

There're four schemes.

### Injure

This scheme can be used in present ECMAScript (ES2015).

```javascript
import * as it from 'iterit/lib/injure.mjs'

it.range(10)
  [it.filter](x => x % 2)
  [it.map](x => x * 2)
```

### Bind

This scheme is based on [Stage 0 "Function bind syntax" proposal](https://github.com/zenparsing/es-function-bind).
([babel plugin](https://babeljs.io/docs/en/next/babel-plugin-proposal-function-bind.html))

```javascript
import * as it from 'iterit/lib/lib.mjs'

it.range(10)
  ::it.filter(x => x % 2)
  ::it.map(x => x * 2)
```

### Fsharp

This scheme is based on [Stage 1 "F# pipeline operator" proposal](https://github.com/valtech-nyc/proposal-fsharp-pipelines).
([babel plugin](https://babeljs.io/docs/en/next/babel-plugin-proposal-pipeline-operator.html))

```javascript
import * as it from 'iterit/lib/fsharp.mjs'

it.range(10)
  |> it.filter(x => x % 2)
  |> it.map(x => x * 2)
```

### Smart

This scheme is based on [Stage 1 "Smart pipeline operator" proposal](https://github.com/js-choi/proposal-smart-pipelines).
([babel plugin](https://babeljs.io/docs/en/next/babel-plugin-proposal-pipeline-operator.html))

```javascript
import * as it from 'iterit/lib/smart.mjs'

it.range(10)
  |> it.filter(#, x => x % 2)
  |> it.map(#, x => x * 2)
```

## Examples

### [Find all even fibonacci numbers that is less than ten](https://fitzgen.github.io/wu.js/#basics) (as a comparison with [wu.js](https://fitzgen.github.io/wu.js))

```javascript
import * as it from 'iterit/lib/injure.mjs'

// Generate an infinite sequence of the fibonacci numbers.
function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const isEven      = n => n % 2 == 0;
const lessThanTen = n => n < 10;

// Log each even fibonacci number that is less than ten.
fibs()
  [it.filter](isEven)
  [it.takeWhile](lessThanTen)
  [it.forEach](item => console.log(item));
```

The API of iterit is designed to be more compatible with existed ECMAScript API as possible. e.g., `it.forEach` & `Array.prototype.forEach`:
```typescript
Array<T>.forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;

it.forEach<T>(
  this: IterableIterator<T>,
  callbackfn: (value: T, index: number, iter: IterableIterator<T>) => void,
  thisArg?: any): void
```

### Find all [narcissistic numbers](https://en.wikipedia.org/wiki/Narcissistic_number)

```javascript
import * as it from 'iterit/lib/lib.mjs'

let NarcissisticNumbers =
  it.count()
    ::it.filter(x => {
      const digits = x.toString()::it.map(Number)::it.toArray()
      return x === digits::it.map(d => d ** digits.length)::it.sum()
    })

function nthNarcissisticNumber(x) {
  let temp
  ;[NarcissisticNumbers, temp] = NarcissisticNumbers::it.tee(2)
  return temp::it.nth(x)
}

// Log the 10th narcissistic number.
console.log(nthNarcissisticNumber(10))
//= 153
```
