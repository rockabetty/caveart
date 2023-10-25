module.exports = {
  roots: ["<rootDir>/src"], 
  testEnvironment: "node",
  testMatch: [
    "**/*.test.[jt]s?(x)"
  ],
  preset: 'ts-jest',
};