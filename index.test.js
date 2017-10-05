const SetecAppConfig = require('./index');

jest.mock('setec');

test('loads correctly from an object', () => {
  const config = new SetecAppConfig({
    config: {
      top: { secret: 'top-secret' },
      array: [
        'value',
        { secret: 'array-secret' },
      ],
      object: {
        child: { secret: 'child-secret' },
        nesting: [
          { secret: 'nested-secret' },
        ],
      },
    },
  });

  return config.load().then((loaded) => {
    expect(loaded).toEqual({
      top: 'top-secret',
      array: [
        'value',
        'array-secret',
      ],
      object: {
        child: 'child-secret',
        nesting: [
          'nested-secret',
        ],
      },
    });
  });
});

test('loads correctly from a file', () => {
  const config = new SetecAppConfig({
    configFile: './__fixtures__/test-config.js',
  });

  return config.load().then((loaded) => {
    expect(loaded).toEqual({
      top: 'top-secret',
      array: [
        'value',
        'array-secret',
      ],
      object: {
        child: 'child-secret',
        nesting: [
          'nested-secret',
        ],
      },
    });
  });
});

test('throws an error', async () => {
  const config = new SetecAppConfig({
    config: {
      object: {
        nesting: [
          { secret: 'nested-secret-error' },
        ],
      },
    },
  });

  try {
    await config.load();
    throw new Error('should not have succeeded');
  } catch (err) {
    expect(err.message).toMatch('object.nesting.0');
  }
});
