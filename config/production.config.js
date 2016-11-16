var webpack = require('webpack')
var path = require('path')

var CopyWebpackPlugin = require('copy-webpack-plugin');

const ROOT = path.resolve(__dirname + '/..')

module.exports = [
    // scripts
    {
        context: ROOT,
        entry: {
            app: path.resolve(ROOT + '/src/js/app.js'),
            vendor: ['react', 'react-dom'],
        },
        output: {
            path: path.resolve(ROOT + '/build/js'),
            filename: '[name].bundle.js',
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
                },
            ],
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: 'vendor.bundle.js',
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.AggressiveMergingPlugin()
        ],
        resolve: {
            alias: {'~': path.resolve(ROOT + '/src/js')},
        },
    },
    // styles
    {
        context: path.resolve(__dirname + '/..'),
        entry: {
            app: path.resolve(ROOT + '/src/styles/app.scss'),
        },
        output: {
            path: path.resolve(ROOT + '/build/css'),
            filename: '[name].bundle.css',
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
        context: path.resolve(__dirname + '/..'),
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
                    from: path.join(__dirname, '../src/static'),
                    to: path.join(__dirname, '../build'),
                },
            ])
        ]
    }
]
