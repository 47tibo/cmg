;define('models/news' , ['jquery', 'utils'], (function( $, Utils ){

    // news can be an array or a unique news
    function News( news ) {
        if ( Object.prototype.toString.call( news ) === '[object Array]' ) {
            this._N = news.slice( 0 );
            var tmpNews;
            // get the appropriate image resolution and compute the link's value based on id
            for (var i = 0, l = this._N.length; i < l; i+=1) {
                tmpNews = this._N[ i ];
                tmpNews = Utils.loadAppropriateImage( tmpNews );
                tmpNews['link'] = '/news/' + tmpNews['id_news'] + '/info';
            }
        } else {
            // unique news, object
            this._N = $.extend(true, {}, news);
            this._N = Utils.loadAppropriateImage( this._N );
        }
    }

    News.prototype = {

        get: function get () {
            return this._N;
        }
    };

    return {
        initialize: News
    };

}));