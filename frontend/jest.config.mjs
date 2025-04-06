import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  // Since jest.config.mjs is in frontend/, './' correctly points to frontend/
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // <rootDir> will resolve to the 'frontend' directory where this config file is located
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: 'jest-environment-jsdom',
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // The directory where Jest should output its coverage files (frontend/coverage/)
  coverageDirectory: "coverage",
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // Include app directory components/logic if needed
    "./lib/**/*.{js,jsx,ts,tsx}", // Include lib directory utils if needed
    "!./app/layout.tsx", // Often exclude layout
    "!./app/**/page.tsx", // Often exclude top-level page files unless testing page logic
    "!./app/**/layout.tsx", // Exclude nested layouts too
    "!./**/route.ts", // Exclude route handlers (API)
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!./coverage/**",
    "!./.next/**",
    "!./*.config.js", // Exclude config files
    "!./*.config.mjs",
    "!./middleware.ts", // Exclude middleware
    "!./jest.setup.js",
    "!./__mocks__/**", // Exclude mocks
  ],
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    // Handle CSS imports (using styleMock.js)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports (using fileMock.js)
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': `<rootDir>/__mocks__/fileMock.js`,

    // Handle module aliases (this will be automatically configured by next/jest based on tsconfig.json)
    // Example: '@/(.*)$': '<rootDir>/$1' is handled automatically
    '^@/(.*)$': '<rootDir>/$1', // Add explicit mapping
  },
  // Use this pattern to match test files
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "/node_modules/",
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config) 