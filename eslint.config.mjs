import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    ignores: ['dist', 'coverage', 'node_modules', 'eslint.config.*', '**/*.config.*', '**/.*rc.*'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': {
        typescript: { project: ['./tsconfig.json'] },
      },
    },
    plugins: { import: importPlugin, 'simple-import-sort': simpleImportSort },
    rules: {
      'no-unused-vars': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              '^node:',
              `^(${[
                'assert',
                'buffer',
                'child_process',
                'cluster',
                'console',
                'constants',
                'crypto',
                'dgram',
                'dns',
                'domain',
                'events',
                'fs',
                'http',
                'http2',
                'https',
                'inspector',
                'module',
                'net',
                'os',
                'path',
                'perf_hooks',
                'process',
                'punycode',
                'querystring',
                'readline',
                'repl',
                'stream',
                'string_decoder',
                'timers',
                'tls',
                'tty',
                'url',
                'util',
                'v8',
                'vm',
                'zlib',
              ].join('|')})(/|$)`,
            ],

            ['^@nestjs(/|$)'],
            ['^@?\\w'],

            ['^@app(/|$)'],
            ['^@config(/|$)'],
            ['^@common(/|$)'],
            ['^@modules(/|$)'],
            ['^@lib(/|$)'],

            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?!/?$)', '^\\./?$'],

            ['^\\u0000'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-duplicates': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],

      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
      'import/order': 'off',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],
      'import/no-unresolved': 'error',
    },
  },
];
