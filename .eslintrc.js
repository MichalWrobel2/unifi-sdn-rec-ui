module.exports = {
    "env": {
        "es6": true,
        "browser": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "space-before-blocks": "error",
        "arrow-parens": ["error", "always"],
        "arrow-spacing": ["error", { "before": true, "after": true }],
        "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
        "no-trailing-spaces": ["error", { "ignoreComments": false, "skipBlankLines": false }],
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "curly": ["error"],
        "default-case": ["error"],
        "indent": ["error","tab"],
        "linebreak-style": ["error","unix"],
        "quotes": ["error","single"],
        "semi-style": ["error", "last"],
        "prefer-const": ["error", {"destructuring": "any","ignoreReadBeforeAssign": false}],
        "default-case": "error",
        "eqeqeq": ["error", "always"],
        "no-redeclare": "error",
        "jsx-quotes": ["error", "prefer-single"],
        "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1, "maxBOF": 1 }],
        "no-unneeded-ternary": ["error", { "defaultAssignment": false }],
        "object-curly-spacing": ["error", "always"],
        "space-infix-ops": "error",
        "no-unused-vars": "error",
        "no-useless-escape": "error",
        "no-multi-spaces": ["error", { ignoreEOLComments: true }],
        "newline-before-return": "error",
        "no-useless-return": "error",
        "no-else-return": ["error", { "allowElseIf": true }],
        "no-unreachable": "error",
        "no-inner-declarations": "error",
        "spaced-comment": ["error", "always"],
        "react/jsx-uses-vars": 2,
        //"space-in-parens": ["error", "never", { "exceptions": ["{}", "()"] }],
        "space-before-function-paren": ["error", "never"],
        "semi-spacing": ["error", {"before": false, "after": true}]

    }
};