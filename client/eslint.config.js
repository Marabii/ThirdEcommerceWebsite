import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierPlugin from 'eslint-plugin-prettier'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'

export default [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest', // Use the latest ECMAScript version
      sourceType: 'module', // Enable ECMAScript modules
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed for React 17+
      'prettier/prettier': 'error',
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
      'react-refresh/only-export-components': 'off', // Disable Fast Refresh rule
      'react-hooks/exhaustive-deps': 'off', // Disable exhaustive deps rule
      'react/jsx-key': 'off', // Disable missing 'key' prop rule
      'react/no-unescaped-entities': 'off', // Disable unescaped entities rule
    },
  },
]

//Testing npx lint-staged
