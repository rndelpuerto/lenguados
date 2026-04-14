import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
 testEnvironment: 'node',
 testMatch: ['**/test/**/*.test.ts'],
 extensionsToTreatAsEsm: ['.ts'],
 transform: {
  '^.+\\.tsx?$': [
   '@swc/jest',
   {
    jsc: {
     parser: {
      syntax: 'typescript',
     },
     target: 'es2022',
    },
    module: {
     type: 'es6',
    },
   },
  ],
 },
 transformIgnorePatterns: ['node_modules/(?!mitata)'],
};

export default config;
