module.exports = {
    ignorePatterns: ["node_modules/", "generated"],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript'
    ],
    root: true,
    env: {
        node: true,
        jest: true
    },
    rules: {
        "prettier/prettier": "error",
        "no-unused-vars": "off",
        "camelcase": "off",
        "indent": "off",
        "no-extra-semi": "off",
        "no-extra-parens": "off",
        "no-empty-function": "off",
        "no-dupe-class-members": "off",
        "no-array-constructor": "off",
        "brace-style": "off",
        "max-len": ["error", 120, 2],
        "eol-last": ["error", "always"],
        "keyword-spacing": ["error"],
        "key-spacing": ["error"],
        "block-spacing": ["error", "always"],
        "object-curly-spacing": ["error", "always"],
        "@typescript-eslint/await-thenable": 'error',
        '@typescript-eslint/interface-name-prefix': "off",
        '@typescript-eslint/explicit-function-return-type': "off",
        '@typescript-eslint/no-explicit-any': ["warn"],
        "@typescript-eslint/ban-ts-comment": ["error"],
        "@typescript-eslint/naming-convention": [
            "error",
            { "selector": "variableLike", "format": ["camelCase", "UPPER_CASE", "PascalCase"] }
        ],
        "@typescript-eslint/unbound-method": ["error"],
        "@typescript-eslint/restrict-plus-operands": "error",
        "@typescript-eslint/prefer-string-starts-ends-with": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/explicit-module-boundary-types": "error",
        "@typescript-eslint/no-unsafe-return": "error",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-extra-semi": "error",
        "@typescript-eslint/no-throw-literal": "error",
        "@typescript-eslint/no-empty-function": ["error", { "allow": ["arrowFunctions"] }],
        "@typescript-eslint/no-dynamic-delete": "error",
        "@typescript-eslint/no-dupe-class-members": "error",
        "@typescript-eslint/brace-style": "error",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
        "@typescript-eslint/no-unnecessary-qualifier": "error",
        "@typescript-eslint/no-unnecessary-type-arguments": "error",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/no-array-constructor": "warn",
        "import/first": "error",
        "import/order": ["error", { "newlines-between": "always" }],
        "import/no-useless-path-segments": ["error"]
    },
    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"]
            }
        }
    },
};
