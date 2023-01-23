const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const srcDir = path.resolve(__dirname, "..", "src");

module.exports = {
    entry: {
        background: path.join(srcDir, "background.ts"),
        // content_script: path.join(srcDir, "content_script.ts"),
        scraper: path.join(srcDir, "scraper.ts"),
        popup: path.join(srcDir, "popup.ts")
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: ".", context: "public" }]
        }),
    ],
};
