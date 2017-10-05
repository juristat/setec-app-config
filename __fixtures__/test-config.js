module.exports = {
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
};
