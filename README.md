# geheugen

[![Build Status](https://travis-ci.org/kjots/geheugen.svg?branch=master)](https://travis-ci.org/kjots/geheugen)
[![npm version](https://badge.fury.io/js/geheugen.svg)](https://www.npmjs.com/package/geheugen)

> A memoisation toolkit.

## Installation

```shell
npm install --save geheugen
```

## Usage

### As an ES6 module

```js
import 'promise.prototype.finally';

import { memoise } from 'geheugen';

let memo = memoise({ factory: () => getAsyncValue() });

let promise = memo.resolve()
    .then(asyncValue => { ... })
    
memo.reset();
```

### As an ES5 module

```js
require('babel-polyfill');
require('promise.prototype.finally');

var memoise = require('geheugen').memoise;

var memo = memoise({ factory: function () { return getAsyncValue(); } });

var promise = memo.resolve()
    .then(function (asyncValue) { ... })
    
memo.reset();
```

### In a browser

```html
<script src="babel-polyfill/dist/polyfill.js"></script>
<script src="promise.prototype.finally/finally.js"></script>

<script src="geheugen/dist/geheugen.js"></script>

<script>
    var memo = geheugen.memoise({ factory: function () { return getAsyncValue(); } });

    var promise = memo.resolve()
        .then(function (asyncValue) { ... })
    
    memo.reset();
</script>
```

## API

### Memo

#### constructors

##### new Memo({ Q, dependencies, factory, promise, value })

###### Q
Type: `Class`

Default: `Promise`

The promise implementation.

The promise implementation should at a minimum implement the following methods:

 * `Promise.resolve()`
 * `Promise.all()`
 
**Note:** The promise implementation must implement the `.finally()` promise method.  A polyfill for the ES6 Promise 
API can be found at https://www.npmjs.com/package/promise.prototype.finally.

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

###### Q
Type: `Class`

The promise implementation.

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