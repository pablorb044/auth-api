import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      'dist/**'
    ]
  },

  js.configs.recommended,

  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },

    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'eqeqeq': 'error'
    }
  }
]