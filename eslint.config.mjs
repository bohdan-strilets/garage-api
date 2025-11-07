import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

import unicorn from 'eslint-plugin-unicorn';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '**/*.generated.ts'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'commonjs',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      unicorn,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { args: 'after-used', argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^\\u0000'],
            ['^node:'],
            ['^@nestjs(/.*)?$'],
            ['^@?\\w'],
            ['^@app/(.*)$'],
            ['^@/config(/.*)?$'],
            ['^@/modules(/.*)?$'],
            ['^@/common(/.*)?$'],
            ['^/'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?!/?$)', '^\\./?$'],
            ['^.+\\.d\\.ts$', '^.+\\.types$'],
            [
              '^.+\\.(json|ya?ml)$',
              '^.+\\.(css|scss|sass|less)$',
              '^.+\\.(png|jpe?g|gif|svg|webp)$',
            ],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',

      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
  },

  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-expressions': 'off',
    },
  },
];
