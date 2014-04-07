;define('controllers/news_controller', ['mustache', 'jquery', 'utils', 'models/news'], (function( mustache, $, Utils, News ){

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
          var news;

            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('news'),
                success: function( json ) {
                  news = new News.initialize( json.response );

                    require(['text!../tpl/news_list.tpl.html'], function onTplLoaded( tpl ) {
                        var view = mustache.to_html(tpl, { items: news.get() });
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