;define('models/news' , ['utils'], (function( Utils ){

    // news must be an array
    function News( news ) {
        this._N = news;
    }

    News.prototype = {

        get: function get () {
            // get the appropriate image resolution
            for (var i = 0, l = this._N.length; i < l; i+=1) {
                this._N[ i ] = Utils.loadAppropriateImage( this._N[ i ] );
            }
            return this._N;
        }
    };

    return {
        initialize: News
    };

}));