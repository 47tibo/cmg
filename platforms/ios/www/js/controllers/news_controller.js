;define('controllers/news_controller', ['mustache', 'jquery', 'utils', 'models/news'], (function( mustache, $, Utils, News ){

        //mandatory for jqueryjsonp
        function jsonp() {}


        // routing conf
        var _load = {
            'index': index,
            'show': show
        },
        _onViewLoaded;


        function load( action, params, onViewLoaded ){
            _load[ action ]( params );
            _onViewLoaded = onViewLoaded;
        }


        function index() {
          var news;

            Utils.ajax(
                'news',
                function( json ) {
                  news = new News.initialize( json.response );

                    require(['text!../tpl/news_list.tpl.html'], function onTplLoaded( tpl ) {
                        var view = mustache.to_html(tpl, { items: news.get() });
                        _onViewLoaded( view );
                    });
                },
                function( jqXHR, errorType ) {
                    console.log('failed!');
                }
            );
        }

        function show ( params ) {
            var aNews, newsId = params.id;

            Utils.ajax(
                'news/' + newsId + '/info',
                function( json ) {
                  aNews = new News.initialize( json.response );

                    require(['text!../tpl/news.tpl.html'], function onTplLoaded( tpl ) {
                        var view = mustache.to_html(tpl, aNews.get() );
                        _onViewLoaded( view );
                    });
                },
                function( jqXHR, errorType ) {
                    console.log('failed!');
                }
            );
        }

        return {
            load: load
        };

}));