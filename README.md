Elephant.js
===========

_Elephants never forget_

About
------

Elephant.js is a simple localStorage wrapper that serializes and deserializes
JavaScript objects to a single JSON object using `window.localStorage` if
available.

Browser Support
---------------

If `window.localStorage` isn't available Elephant.js will try to fallback
on cookies - but this isn't really reliable for data sets bigger than `4kb`. It could
also hurt HTTP performance by unnecessarily burdening all HTTP transactions
with possible huge cookies.

Use at your own risk.

Usage
------

_Where does an elephant keep his clothes?_

_In his trunk!_

```javascript
// Setup a store
var store = new Elephant.Trunk('mystore');

// Save a monkey
var monkey = {
	name: 'Bobo',
	age: 3,
	abilities: ['sign language', 'eating bananas']
};

monkey = store.save(monkey);

// Saved objects get guids
console.log(monkey);

// Object
// 	abilities: Array[2]
// 		0: "sign language"
// 		1: "eating bananas"
// 		length: 2
// 		__proto__: Array[0]
// 	age: 3
// 	guid: "53b425a6-47cb-462c-9498-ba236becee06"
// 	name: "Bobo"
// 	__proto__: Object

// Find a monkey
store.find(monkey.guid) === monkey; // true

// Destroy a monkey
monkey = store.destroy(monkey);

monkey.guid === undefined; // true
```

TODO
-----

* Implement cookie fallback
* Look at msgpack instead of JSON
* Make Backbone.sync compatible

License
--------

MIT License, use this for whatever you want, but at your own risk. See `LICENSE`.