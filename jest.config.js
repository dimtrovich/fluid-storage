module.exports = {
  	preset: 'ts-jest',
  	testEnvironment: 'jsdom',
  	roots: ['<rootDir>/tests'],
  	testMatch: ['**/*.test.ts'],
  	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/**/*.d.ts',
	],
  	coverageDirectory: 'coverage',
  	coverageReporters: ['text', 'lcov', 'html'],
  	moduleNameMapping: {
    	'^@/(.*)$': '<rootDir>/src/$1'
  	},
  	setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
