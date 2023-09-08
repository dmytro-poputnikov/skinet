module.exports = {
  // Add any other Jest configuration options you need

  // Specify the pattern to match unit test files
  testMatch: ['**/*.spec.ts'],

  // Exclude files matching the integration test pattern
  testPathIgnorePatterns: ['\\.integration\\.spec\\.ts$'],
};
