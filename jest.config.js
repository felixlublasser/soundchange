module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
  setupFilesAfterEnv: ['bdd-lazy-var/global'],
}
