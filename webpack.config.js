var Encore = require('@symfony/webpack-encore');

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each "page" of your app
     * (including one that's included on every page - e.g. "app")
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if you JavaScript imports CSS.
     */
    .addEntry('js/app', ['babel-polyfill', './assets/js/app.js'])
    //.addEntry('page1', './assets/js/page1.js')
    //.addEntry('page2', './assets/js/page2.js')

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    .configureBabel(function (babelConfig) {
        babelConfig.presets.push('stage-3');
        babelConfig.presets.push('env');
        babelConfig.plugins.push(['import', { "libraryName": "antd", "libraryDirectory": "es", "style": true }]);
    })
    .enableReactPreset()

    .enableLessLoader(function(options) {
        // https://github.com/webpack-contrib/less-loader#examples
        // http://lesscss.org/usage/#command-line-usage-options
        // options.relativeUrls = false;
        options.modifyVars = {
            'primary-color': '#1DA57A',
            'link-color': '#1DA57A',
        };
        options.javascriptEnabled = true;
    });


    // enables Sass/SCSS support
    //.enableSassLoader()

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment if you're having problems with a jQuery plugin
    //.autoProvidejQuery()
;

module.exports = Encore.getWebpackConfig();
