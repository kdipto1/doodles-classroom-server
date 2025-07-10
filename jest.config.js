module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\.ts$': 'ts-jest',
    '^.+\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!nanoid|other-esm-modules-if-any)/',
  ],
};