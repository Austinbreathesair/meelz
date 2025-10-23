module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['tests/**/*.{test,spec}.{ts,tsx,js,jsx}','tests/**/*.{ts,tsx,js,jsx}'],
      env: { jest: true, node: true, browser: true },
      globals: { describe: 'readonly', it: 'readonly', expect: 'readonly' }
    }
  ],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  }
};
