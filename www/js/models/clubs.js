;define('models/clubs', ['utils'], (function( Utils ){

    // clubs must be an array
    function Clubs( clubs ) {
        this._C = clubs.slice( 0 );
    }

    Clubs.prototype = {

        get: function get () {
            return this._C;
        },

        // create a "distance" field for each club & sort on it
        sortByLocation: function sortByLocation( fn ) {
            Utils.onCurrentPosition( function( coords ){
                var clubLat, clubLong, distance;
                for (var i = 0, l = this._C.length; i < l; i+=1) {
                    clubLat = this._C[ i ].latitude;
                    clubLong = this._C[ i ].longitude;
                    distance = Utils.distance( coords.lon, coords.lat, clubLong, clubLat ); //km
                    this._C[ i ].distance = distance;
                }
                this._C.sort( function( a, b ) {
                    return a.distance - b.distance;
                });
                fn();
            });
        }
    };

    return {
        initialize: Clubs
    };

}));