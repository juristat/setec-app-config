/* eslint-disable class-methods-use-this */

module.exports = class MockSetec {
  get(secret) {
    if (/error/.test(secret)) throw new Error('unable to load secret');
    return secret;
  }
};
