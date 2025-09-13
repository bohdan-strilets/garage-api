import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import pluginUnused from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', '**/*.d.ts'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      import: pluginImport,
      'unused-imports': pluginUnused,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['backend/tsconfig.json', 'frontend/tsconfig.json'],
        },
        node: {},
      },
    },
    rules: {
      'no-console': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['backend/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    env: { node: true, es2021: true },

    rules: {},
  },

  {
    files: ['frontend/**/*.{ts,tsx,jsx,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
    env: { browser: true, es2021: true },
    plugins: { react, 'react-hooks': reactHooks },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'import/order': [
        'error',
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
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  prettier,
];
