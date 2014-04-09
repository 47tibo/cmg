;define('models/lessons', ['utils'], (function( Utils ){

    function Lessons( lessons ) {
        this._L = lessons.slice( 0 );
    }

    Lessons.prototype = {

        get: function get () {
            return this._L;
        },

        formatDistance: function formatDistance( distance ) {
           // possible formats are "2.60 km", "26.4 km", "1.63 km", "630 m"
           // distance is a number
           var distanceChunks;
           distance = distance + '';
           distanceChunks = distance.split('');
           if ( distanceChunks[ 0 ] === '0' ) {
                // " 0.630 " ie "630 m"
                distance = distanceChunks.splice( 2, 3 ).join('') + ' m';
           } else {
            // "2.60 km", "26.4 km", "1.63 km", simply keep 1st 4 char
                distance = distanceChunks.splice( 0, 4 ).join('') + ' km';
           }
           return distance;
        },

        // create a "distance" field for each club & sort on it
        sortByLocation: function sortByLocation( fn ) {
            var self = this;

            Utils.onCurrentPosition( function( coords ){
                var clubLat, clubLong, distance;
                for (var i = 0, l = self._L.length; i < l; i+=1) {
                    clubLat = self._L[ i ].latitude;
                    clubLong = self._L[ i ].longitude;
                    distance = Utils.distance( coords.lon, coords.lat, clubLong, clubLat ); //km
                    self._L[ i ].distance = distance;
                    // store a pretty distance for display
                    self._L[ i ][ 'distance_formated' ] = self.formatDistance( self._L[ i ].distance );
                }
                self._L.sort( function( a, b ) {
                    return a.distance - b.distance;
                });
                fn.call( self );
            });
        },

        // sort by name, type
        sortByTerms: function sortByTerms( terms ) {
            var  terms = terms.split(' '),
                regex = new RegExp(terms.join('|'), 'i');

            for (var i = 0, l = this._L.length; i < l; i+=1) {
                if ( !regex.test( this._L[ i ].name ) && !regex.test( this._L[ i ].type ) ) {
                    // total mismatch, delete lessons from list
                    this._L.splice( i, 1 );
                    i -= 1;
                    l -= 1;
                }
            }
        },

        clone: function clone () {
            return new Lessons( this.get() );
        }
    }; // proto

    return {
        initialize: Lessons
    };

}));