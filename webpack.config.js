const path = require('path');

module.exports = {
    resolve: {
        extensions: [".jsx", ".js"],
    },
    entry: "./frontend/js/comments.js",
    mode: process.env.NODE_ENV || "development",
    watch: process.env.NODE_ENV === "development",
    watchOptions: {
        ignored: /node_modules/,
    },
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: "/",
        filename: "js/comments.js",
        library: "Ghost",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                        ],
                    }
                }
            },
        ]
    },
};
