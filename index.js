const fs = require('fs');
const _ = require('lodash');
const AWS = require('aws-sdk');
const Promise = require('bluebird');
const Setec = require('setec');

function loadSecrets(setec, config) {
  function scopedLoad(obj) {
    if (Array.isArray(obj)) {
      return Promise.map(obj, scopedLoad);
    } else if (obj instanceof Object) {
      if (Object.keys(obj).length === 1 && {}.hasOwnProperty.call(obj, 'secret')) {
        return setec.get(obj.secret);
      }
      return Promise.props(_.mapValues(obj, scopedLoad));
    }
    return Promise.resolve(obj);
  }

  return scopedLoad(config);
}

class SetecAppConfig {
  constructor(opts = {}) {
    this.opts = Object.assign({}, {
      configFile: null,
      config: null,
      s3Bucket: null,
      s3Prefix: 'setec',
    }, opts);

    if (this.opts.configFile) {
      const ext = this.opts.configFile.split('.').pop();
      const hasExt = /\/[^/]+\.[^.]+$/.test(this.opts.configFile);

      if (!hasExt) {
        throw new Error("Don't know what to do with a configFile with no extension");
      } else if (ext === 'json') {
        this.config = JSON.parse(fs.readFileSync(this.opts.configFile));
      } else if (ext === 'js') {
        /* eslint-disable global-require, import/no-dynamic-require */
        this.config = require(this.opts.configFile);
        /* eslint-enable global-require, import/no-dynamic-require */
      } else {
        throw new Error(`Don't know what to do with a configFile ending in .${ext}`);
      }
    } else if (this.opts.config) {
      this.config = this.opts.config;
    } else {
      throw new Error('must specify config or configFile');
    }

    if (this.config.aws) {
      AWS.config.update(this.config.aws);
    }

    this.setec = new Setec({
      's3-bucket': this.opts.s3Bucket,
      's3-prefix': this.opts.s3Prefix,
    });
  }

  load() {
    if (this.loaded) {
      return Promise.resolve(this.config);
    }

    return loadSecrets(this.setec, this.config).then((config) => {
      Object.assign(this.config, config);
      this.loaded = true;
      return config;
    });
  }

  exportable() {
    this.config.load = this.load.bind(this);
    return this.config;
  }
}

module.exports = SetecAppConfig;
