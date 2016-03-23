# geheugen

> A memoisation toolkit.

## Installation

```shell
npm install --save geheugen
```

## Usage

```js
import { memoise } from 'geheugen';

let memo = memoise({ factory: () => getAsyncValue() });

let promise = memo.resolve()
    .then(asyncValue => { ... })
    
memo.reset();
```

## API

### Memo

#### constructors

##### new Memo({ dependencies, factory, promise, value })

###### dependencies
Type: `Array<Memo>`

Default: `[]`

The dependencies.

###### factory
Type: `Function`

Default: `() => {}`

The factory.

###### promise
Type: `Promise`

The promise.

###### value

The value.

#### methods

##### resolve()

Resolve the memo.

###### If the memo has a value

Return a promise resolved with the value.

###### If the memo has a promise

Return the promise.

###### Otherwise

Invoke the factory and return a promise for the returned value.

The factory will be invoked via `.then()` of a promise resolved with the values of all of the dependencies.

Whilst the promise is pending it will be stored on the memo. When the promise is fulfilled the stored promise will
be removed.

The returned value will be stored on the memo.

##### reset()

Remove the value from the memo.

Any memo that has specified this memo as a dependency will also be reset.

#### properties 

#### dependencies
Type: `Array<Memo>`

The dependencies.

##### factory
Type: `Function`

The factory.

##### promise
Type: `Promise`

The promise.

##### value

The value.

#### dependants
Type: `Array<Memo>`

The dependants.

Any memo that has specified this memo as a dependency will be added to this array.