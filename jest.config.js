/* eslint-disable */

const {defaults} = require('jest-config');

// eslint-disable-next-line no-undef
module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
    },
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'd.ts'],
  testMatch: ['**/test/**/*.+(spec.ts)'],
  transform: {
    '^.+\\.(d.ts|ts)?$': 'ts-jest',
  },
};