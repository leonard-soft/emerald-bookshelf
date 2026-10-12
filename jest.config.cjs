module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }] },
  moduleNameMapper: { '\\.(css)$': 'identity-obj-proxy' },
  testMatch: ['<rootDir>/src/__tests__/**/*.test.{ts,tsx}']
};
