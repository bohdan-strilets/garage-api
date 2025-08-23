import tsPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import prettierPlugin from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    ignores: ['.eslintrc.js', 'dist/**', 'node_modules/**', 'coverage/**'],
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'unused-imports': unusedImports,
      prettier: prettierPlugin,
      jest: jestPlugin,
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'prettier/prettier': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        { 'ts-ignore': 'allow-with-description' },
      ],

      // импорт-гигиена + алиас '@/'
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            { pattern: '@/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/no-duplicates': 'warn',
      'import/no-useless-path-segments': 'warn',
      'import/extensions': [
        'warn',
        'ignorePackages',
        { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
      ],
      'import/no-extraneous-dependencies': [
        'warn',
        {
          devDependencies: [
            '**/*.spec.ts',
            '**/*.test.ts',
            'test/**',
            '**/jest.config.ts',
            '**/jest.setup.ts',
            '**/*.config.ts',
            'scripts/**',
          ],
        },
      ],

      '@typescript-eslint/member-ordering': 'warn',
    },
  },

  {
    files: ['**/*.spec.ts', '**/*.test.ts', 'test/**/*.ts'],
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'warn',
    },
  },

  eslintConfigPrettier,
];
