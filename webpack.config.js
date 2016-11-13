var webpack = require('webpack')
var path = require('path')

module.exports = [{
    entry: {
        app: "./src/js/app.js",
        vendor: ["react", "react-dom"],
    },
    output: {
        path: './bin/js',
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
            },
            {
                test: /\.scss$/,
                loaders: [ 'style', 'css', 'sass' ],
            }
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
        }),
        //new webpack.DefinePlugin({
        //    "process.env": {
        //        NODE_ENV: JSON.stringify("production")
        //    }
        //})
    ],
    resolve: {
        alias: {'~': path.resolve(__dirname + '/src/js')},
    }
}, {
    entry: {
        app: "./src/styles/app.scss",
    },
    output: {
        path: './bin/css',
        filename: "[name].bundle.css"
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: [ 'style', 'css', 'sass' ],
            }
        ],
    },
}]
