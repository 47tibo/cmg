;define('controllers/application_controller', ['mustache'], (function( mustache ){

        var _load = {
            'home': home,
            'subscriptions': subscriptions
        },
        _onViewLoaded;

        function load( action, params, onViewLoaded ){
            _load[ action ]( params );
            _onViewLoaded = onViewLoaded;
        }


        function home() {
            // here send XHR & handle params

            require([
            'text!../tpl/home.tpl.html'
            ], function onTplLoaded( tpl ) {
                // pass params
                var view = mustache.to_html(tpl);
                _onViewLoaded( view );
            });

        }

        function subscriptions() {
            require([
            'text!../tpl/subscriptions.tpl.html'
            ], function onTplLoaded( tpl ) {
                // pass params
                var view = mustache.to_html(tpl);
                _onViewLoaded( view );
            });
        }

        return {

            load: load

        }

}));