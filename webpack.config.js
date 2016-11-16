var webpack = require('webpack')
var path = require('path')

var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
    // scripts
    {
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
                    loaders: ['style', 'css', 'sass'],
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
    },
    // styles
    {
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
                    loaders: ['style', 'css', 'sass'],
                }
            ],
        },
    },
    // static
    {
        context: path.join(__dirname, '.'),
        output: {
            path: '',
            filename: '[name]',
        },
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'sass'],
                }
            ],
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.join(__dirname, '/src/static'),
                    to: path.join(__dirname, '/bin')
                },
            ])
        ]
    }
]
