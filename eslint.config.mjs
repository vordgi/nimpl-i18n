import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default [
    eslintPluginPrettierRecommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "prettier/prettier": [
                "error",
                {
                    endOfLine: "auto",
                    tabWidth: 4,
                    printWidth: 120,
                    arrowParens: "always",
                },
            ],
        },
        ignores: ["node_modules/", "**/node_modules/", "**/dist/"],
    },
];
