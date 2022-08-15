const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: slsw.lib.entries,
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    target: 'node',
    externals: [nodeExternals()],
    optimization: {
        minimize: true
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                "templates/**.handlebars"
            ],
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            "@resolvers": path.resolve(__dirname, './resolvers'),
            "@schemas": path.resolve(__dirname, './schemas'),
            "@helpers": path.resolve(__dirname, './helpers'),
            "@validators": path.resolve(__dirname, './validators'),
            "@translations": path.resolve(__dirname, './translations'),
            "@octopy/serverless-core": path.resolve(__dirname, 'artifacts/core/nodejs'),
            "@octopy/serverless-mongoose": path.resolve(__dirname, 'artifacts/mongoose/nodejs'),
            "@octopy/serverless-aws": path.resolve(__dirname, 'artifacts/aws/nodejs'),
            "@octopy/serverless-aws-lambda": path.resolve(__dirname, 'artifacts/aws-lambda/nodejs'),
            "@octopy/serverless-csv-writer": path.resolve(__dirname, 'artifacts/csv-writer/nodejs'),
            "@octopy/serverless-exceljs": path.resolve(__dirname, 'artifacts/exceljs/nodejs'),
            "@octopy/serverless-jsonwebtoken": path.resolve(__dirname, 'artifacts/jsonwebtoken/nodejs'),
            "@octopy/serverless-nodemailer": path.resolve(__dirname, 'artifacts/nodemailer/nodejs'),
            "@octopy/serverless-generate-password": path.resolve(__dirname, 'artifacts/generate-password/nodejs')
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            }
        ]
    }
}