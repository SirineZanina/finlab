import { defineConfig } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  ...compat.config({
    extends: ['next/core-web-vitals','prettier'],
  }),

  {
    rules: {
      'no-undef': ['warn'],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      indent: ['warn', 2],
	  'prefer-arrow-callback': ['error'],
	  'prefer-template': ['error'],
      'class-methods-use-this': 'warn',
      'eol-last': ['warn', 'always'],
      'no-unused-expressions': ['warn'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-trailing-spaces': ['warn'],
      'no-useless-constructor': 0,
      'no-loop-func': 0,
    },
  },
   {
    files: ['**/*.tsx'],
    rules: {
      'no-unused-vars': ['warn'], // Only show unused variable warnings in .tsx files
    },
  },

]);
