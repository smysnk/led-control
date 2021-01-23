let config = {
  extends: 'airbnb',
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    jsx: true,
    requireConfigFile: false,
  },
  plugins: [
    '@babel',
    '@babel/plugin-syntax-jsx',
    'import',
    'jsx-a11y',
    'jest',
  ],
  rules: {
    // Spacing
    'template-curly-spacing': ['error', 'always'],

    // General
    'arrow-parens': ['error', 'as-needed'],
    'function-paren-newline': ['error', 'consistent'],
    'object-curly-newline': ['error', { consistent: true }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'linebreak-style': 0,
    'global-require': 0,
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: { var: 2, let: 2, const: 3 },
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: { body: 1, parameters: 2 },
        FunctionExpression: { body: 1, parameters: 2 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ignoredNodes: ['JSXAttribute', 'JSXSpreadAttribute'],
      },
    ],

    // React
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/forbid-prop-types': [1, { forbid: ['any'] }],
    'react/prefer-stateless-function': [2, { ignorePureComponents: true }],
    'react/no-multi-comp': 0,
    'react/jsx-closing-bracket-location': [1, 'tag-aligned'],
    'react/jsx-curly-spacing': [2, {
      when: 'always',
      allowMultiline: false,
      spacing: { objectLiterals: 'never' },
    }],
    'react/prop-types': [1, {
      ignore: [
        // `dispatch` is typically used by Redux `@connect`
        'dispatch',
        // `data` is injected by Apollo
        'data',
      ],
    }],

    // Import
    'import/no-unresolved': [2, { commonjs: true }],

    // JSX-a11y
    'jsx-a11y/anchor-is-valid': ['error', {
      components: ['a'],
      aspects: ['noHref', 'invalidHref', 'preferButton'],
    }],
  },
};

// Disable eslint rule enforcement for local dev
if (process.env.WEBPACK_DEV_SERVER) {
  config = {
    extends: [
      'react-app',
    ],
    rules: {
      'import/no-anonymous-default-export': 0,
    },
  };
}

module.exports = config;
