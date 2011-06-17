Elephant.js
===========

_Elephants never forget_

About
------

Elephant.js is a simple localStorage wrapper that serializes and deserializes
JavaScript objects to a single JSON object using `window.localStorage` if
available.

Support
--------

If `window.localStorage` isn't available Elephant.js will try to fallback
on cookies - but this isn't really reliable for data sets bigger than `4kb`. It could
also hurt HTTP performance by unnecessarily burdening all HTTP transactions
with possible huge cookies.

Use at your own risk.

License
--------

MIT License, use this for whatever you want, but at your own risk. See `LICENSE`.