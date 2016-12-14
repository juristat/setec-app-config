# setec-app-config

A quick app configurator that loads AWS KMS secrets via Setec.

## API

### `class SetecAppConfig`

#### `new SetecAppConfig(opts)`

Options:

* `config`: your configuration object, with any Setec secrets as `{secret: 'secret-name'}`; required unless `configFile` is given
* `configFile`: a JSON file version of `config`, or a Javscript file exporting the same; overrides `config`; required unles `config` is given
* `s3Bucket`: the S3 bucket from which Setec should load secret configuration; required
* `s3Prefix`: the prefix for Setec to use when loading secret configuration; defaults to `'setec'`

#### `load()`

Asynchronously load Setec secrets and return the resolved configuration object via a Promise.

Returns `Promise(configWithSecretsLoaded)`

#### `exportable()`

Returns an object suitable for exporting as a Node.js module for the following convenient usage pattern:

##### my-config-module.js

```javascript
const SetecAppConfig = require('setec-app-config');

module.exports = new SetecAppConfig({
    configFile: 'path/to/my-secret-free-config.json',
    s3Bucket: 'my-setec-config-bucket'
}).exportable();
```

##### your app's entry point (index.js, i.e. the "main" file)

```javascript
const myConfig = require('./my-config-module');

// ES7 example
await myConfig.load();
db.connect(myConfig.user, myConfig.secretPassword); // i.e., do something with loaded secrets

// pre-ES7 example
myConfig.load().then(() => {
    db.connect(myConfig.user, myConfig.secretPassword); // i.e., do something with loaded secrets
});
```
