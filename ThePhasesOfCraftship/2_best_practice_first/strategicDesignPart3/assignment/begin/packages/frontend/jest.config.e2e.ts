import path from 'path';
import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from '../../tsconfig.json';

const config: Config.InitialOptions = {
  displayName: 'Frontend (E2E)',
  testMatch: ['**/@(src|tests)/**/*.@(e2e).*'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { diagnostics: false }],
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: path.resolve(__dirname, '../../'),
  })
}

export default config;