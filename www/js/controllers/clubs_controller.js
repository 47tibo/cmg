;define('controllers/clubs_controller', ['mustache', 'jquery', 'utils', 'models/clubs'], (function( mustache, $, Utils, Clubs ){

        //mandatory for jqueryjsonp
        function jsonp() {}


        // routing conf
        var _load = {
            'index': index
        },
        _onViewLoaded;


        function load( action, params, onViewLoaded ){
            _load[ action ]( params );
            _onViewLoaded = onViewLoaded;
        }


        function index() {
          var clubs;

            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('clubs'),
                success: function( json ) {
                  clubs = new Clubs.initialize( json.response );

                    require(['text!../tpl/search_club.tpl.html'], function onTplLoaded( tpl ) {
                        // pass params
                        var view = mustache.to_html(tpl, { items: clubs.getClubs() });
                        _onViewLoaded( view );
                    });
                },
                error: function( jqXHR, errorType ) {
                    console.log('failed!');
                }
              })
            );

        }

        return {
            load: load
        };

}));