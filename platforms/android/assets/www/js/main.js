require.config({

    paths: {
        mustache: 'libs/mustache',
        jquery: 'libs/jquery-2.1.0.min',
        utils: 'utils',
        text: 'libs/require/text',
        templates: 'tpl',
        snapsvg: 'libs/snap.svg',
        svgicons: 'libs/svgicons',
        svgiconsconfig: 'libs/svgicons-config'
    },

    waitSeconds: 10

});

require([
    // Load our app module and pass it to our definition function
    'index'
], function(app){
    app.init();
});