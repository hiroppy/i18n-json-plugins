module.exports = {
  preset: "ts-jest",
  moduleFileExtensions: ["json", "ts", "js"],
  rootDir: ".",
  testRegex: ".*\\.test\\.ts$",
  collectCoverageFrom: ["**/*.ts", "!**/node_modules/**"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
};
