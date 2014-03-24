require.config({

    paths: {
        mustache: 'libs/mustache',
        text: 'libs/require/text',
        templates: 'tpl'
    },

    waitSeconds: 10

});

require([
    // Load our app module and pass it to our definition function
    'index'
], function(app){

    var appData = {

        phrase: 'Hello CMG bla'

    };

    // The "app" dependency is passed in as "App"
    app.init(appData);
});