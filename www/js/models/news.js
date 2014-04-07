;define('models/news' , ['utils'], (function( Utils ){

    // news must be an array
    function News( news ) {
        this._N = news.slice( 0 );
    }

    News.prototype = {

        get: function get () {
            var tmpNews;
            // get the appropriate image resolution and compute the link's value based on id
            for (var i = 0, l = this._N.length; i < l; i+=1) {
                tmpNews = this._N[ i ];
                tmpNews = Utils.loadAppropriateImage( tmpNews );
                tmpNews['link'] = 'news/' + tmpNews['id_news'] + '/info';
            }
            return this._N;
        }
    };

    return {
        initialize: News
    };

}));