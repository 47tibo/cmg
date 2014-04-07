;define('controllers/clubs_controller', ['mustache'], (function( mustache ){

        var _load = {
            'index': index
        },
        _onViewLoaded;

        function load( action, params, onViewLoaded ){
            _load[ action ]( params );
            _onViewLoaded = onViewLoaded;
        }


        function index() {
            // here send XHR & handle params

            require([
            'text!../tpl/search_club.tpl.html'
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