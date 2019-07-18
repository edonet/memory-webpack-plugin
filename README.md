# memory-webpack-plugin
A webpack plugin for create memory assets

## Install

1. add package
``` shell
$ yarn add memory-webpack-plugin
```

2. edit `webpack.config.js`
``` javascript
const MemoryWebpackPlugin = require('memory-webpack-plugin');

module.exports = {
    ...
    plugins: [
        ...
        new MemoryWebpackPlugin({
            'abc.css': async () => '.app { display: flex; }'
        })
    ]
};
```

3. `import` in code;
``` javascript
import style from '@memory/abc.css';

// do something;
console.log(style);
```

## Usage

1. set/get memory in loader
``` javascript
module.exports = function loader(source) {

    // set memory
    this.$memory('abc.css', source);

    // get memory
    this.$memory('abc.css');

    // do something;
    ...
};
```

2. extends `MemoryWebpackPlugin`
``` javascript
const MemoryWebpackPlugin = require('memory-webpack-plugin');

// MyPlugin
module.exports = class MyPlugin extends MemoryWebpackPlugin {

    // init
    constructor(data) {
        super(data);

        this.descriptor = { name: 'my-plugin' };
    }

    // apply
    apply(compiler) {
        super.apply(compiler);

        // set memory
        this.$set('abc.css', source);

        // get memory
        this.$get('abc.css');

        // do something;
        ...
    }
}
```
