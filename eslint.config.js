// Linter: `npm run lint`. Busca errores (variables sin usar, cosas mal escritas, reglas de los hooks de React).
// El formato del código no lo revisa: de eso se ocupa Prettier (`npm run format`).
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

// Lo que empieza con guion bajo se puede dejar sin usar a propósito (por ejemplo, al separar un campo de un objeto)
const sinUsar = ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }]

export default [
  { ignores: ['dist/', 'dev-dist/', 'test-results/', 'playwright-report/', 'pruebas/e2e/capturas/', 'supabase/functions/'] },
  js.configs.recommended,
  {
    // La app
    files: ['src/**/*.{js,jsx}', 'public/*.js'],
    languageOptions: { globals: globals.browser, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': sinUsar,
    },
  },
  {
    // Lo que corre con Node: configuración, scripts y pruebas (las de navegador además corren pedazos adentro de la página)
    files: ['*.config.js', 'scripts/**', 'pruebas/**'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: { 'no-unused-vars': sinUsar },
  },
  prettier,
]
