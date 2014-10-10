# Sweetjsify

A [sweet.js][sweetjs] transform for [Browserify][browserify].

## Usage

The transform will process all javascript (.js and .sjs) files, which have the following directive inside:

```js
"use macros";

// any other code
```

The macros to use are defined in your `package.json` file:

```json
{
  // other stuff ...

  "sweetjsify": {
    "modules": {
      "./path/tomodule",
      "other/path"
    }
  }
}
```

You can also configure the transform programatically:

```js
var sweetjsify = require('sweetjsify').configure({
  modules: ['some/module']
});
```

## Installation

Install the module using npm:

    $ npm install sweetjsify

## License

MIT

## Author

Adam Pohorecki

[sweetjs]: http://sweetjs.com
[browserify]: http://browserify.org
