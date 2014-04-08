;define('controllers/application_controller', ['mustache', 'jquery', 'utils'], (function( mustache, $, Utils ){

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
            var subscriptions;

            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('subscriptions'),
                success: function( json ) {
                  subscriptions = json.response.slice( 0 );

                  // get the right image resolution
                  for (var i = 0, l = subscriptions.length; i < l; i+=1) {
                      subscriptions[ i ] = Utils.loadAppropriateImage( subscriptions[ i ] );
                  }

                    require(['text!../tpl/subscriptions.tpl.html'], function onTplLoaded( tpl ) {
                        var view = mustache.to_html(tpl, { items: subscriptions });
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

        }

}));