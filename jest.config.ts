import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  collectCoverage: true,
  collectCoverageFrom: ["./src/**"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  preset: "ts-jest/presets/default-esm",
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "mts",
    "tsx",
    "json",
    "node",
  ],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    "^.+\\.m?[tj]sx?$": [
      "ts-jest",
      {
        tsconfig: "./configs/tsconfig.test.json",
        useESM: true,
      },
    ],
  },
};

export default jestConfig;
