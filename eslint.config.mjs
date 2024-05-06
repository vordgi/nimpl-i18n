import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

const ignores = ["**/node_modules/**", "**/dist/**"];

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
    },
].map((r) => Object.assign(r, { ignores }));
