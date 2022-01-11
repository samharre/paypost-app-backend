module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  roots: ['<rootDir>/tests'],
  testEnvironment: 'node',
};
