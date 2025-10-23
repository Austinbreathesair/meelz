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
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  }
};

