module.exports = {
  moduleFileExtensions: ["js", "ts", "json"],
  testRegex: "(/test/.*|(\\.|/)(test|spec))\\.ts?$",
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testEnvironment: 'jsdom'
};