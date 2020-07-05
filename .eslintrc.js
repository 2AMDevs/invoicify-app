module.exports = {
    env: {
      browser: true,
      es6: true
    },
    extends: ["airbnb"],
    globals: {
      Atomics: "readonly",
      SharedArrayBuffer: "readonly"
    },
    parser: "babel-eslint",
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      ecmaVersion: 2018,
      sourceType: "module"
    },
    plugins: ["react",],
    rules: {
      "array-bracket-spacing": [2, "never"],
      "brace-style": [2, "1tbs", { allowSingleLine: false }],
      "camelcase": [1, {
        "allow": ["^UNSAFE_"],
        "ignoreDestructuring": true,
        "properties": "always",
      }],
      "comma-spacing": [1, { before: false, after: true }],
      "comma-style": [1, "last"],
      "computed-property-spacing": [1, "never"],
      "eol-last": [2, "always"],
      "func-names": [2, "always"],
      "react/prop-types": [0],
      "consistent-return": 0,
      "import/no-extraneous-dependencies": 0,
      "react/destructuring-assignment": [0],
      "react/jsx-equals-spacing": [2, "never"],
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "react/jsx-first-prop-new-line": [1, "multiline"],
      "react/jsx-tag-spacing": [1, {"beforeSelfClosing": "always"}],
      "react/jsx-indent": [2, 2],
      "react/jsx-indent-props": [2, 2],
      "arrow-parens": [2, "always"],
      "no-multi-spaces": ["error", { exceptions: { "BinaryExpression": true }, "ignoreEOLComments": true }],
      "react/jsx-max-props-per-line": [1, { "when": "always" }],
      "react/jsx-props-no-spreading": [0],
      "react/jsx-closing-bracket-location": [2, "tag-aligned"],
      "react/jsx-curly-brace-presence": [0, { "props": "never", "children": "never" }],
      "jsx-quotes": [2, "prefer-double"],
      "indent": [2, 2],
      "key-spacing": [1, { beforeColon: false, afterColon: true }],
      "new-cap": 2,
      "no-inline-comments": 2,
      "no-multiple-empty-lines": 2,
      "quotes": [2, "single", "avoid-escape"],
      "semi-spacing": [0, { before: false, after: true }],
      "semi": [2, "never"],
      "space-before-function-paren": ["error", {
          "anonymous": "always",
          "named": "always",
          "asyncArrow": "always"
      }],
      "space-unary-ops": [2, {"words": true, "nonwords": false}],
      "spaced-comment": ["error", "always", {
        "line": {
          "markers": ["/"],
          "exceptions": ["-", "+"]
        },
        "block": {
          "markers": ["!"],
          "exceptions": ["*"],
          "balanced": true
        }
      }]
    }
  };
