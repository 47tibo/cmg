// this model covers multiple clubs, aka a list

;define('models/clubs', ['utils'], (function( Utils ){

    // clubs must be an array
    function Clubs( clubs, shallow ) {
        var day = new Date().getDay();

        this._C = clubs.slice( 0 );
        // create a "link" property for each club, type "/club/2188/info" & a planning link for current day
        for (var i = 0, l = this._C.length; i < l; i+=1) {
            this._C[ i ][ 'link' ] = '/club/' + this._C[ i ][ 'id_heitz_club' ] + '/info';
            this._C[ i ]['link_planning'] = '/club/' + this._C[ i ]['id_heitz_club'] + '/planning/' + day;
            if ( shallow ) {
                this._C[ i ]['notPlanning'] = {};
            }
        }
    }

    Clubs.prototype = {

        get: function get () {
            return this._C;
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
                for (var i = 0, l = self._C.length; i < l; i+=1) {
                    clubLat = self._C[ i ].latitude;
                    clubLong = self._C[ i ].longitude;
                    distance = Utils.distance( coords.lon, coords.lat, clubLong, clubLat ); //km
                    self._C[ i ].distance = distance;
                    // store a pretty distance for display
                    self._C[ i ][ 'distance_formated' ] = self.formatDistance( self._C[ i ].distance );
                }
                self._C.sort( function( a, b ) {
                    return a.distance - b.distance;
                });
                fn.call( self );
            });
        },

        checkAgainstAdress: function checkAgainstAdress( address, regex ) {
            var address = address.replace('<br />', ' ');
            addressChunk = address.split(' ');

            for (var i = 0, l = addressChunk.length; i < l; i+=1) {
                if ( regex.test( addressChunk[ i ] ) ) {
                    return true;
                }
            }
        },

        // sort by name, type & address, terms = '75 one paris'
        sortByTerms: function sortByTerms( terms ) {
            var  terms = terms.split(' '),
                regex = new RegExp(terms.join('|'), 'i');

            for (var i = 0, l = this._C.length; i < l; i+=1) {
                if ( !regex.test( this._C[ i ].name ) && !regex.test( this._C[ i ].type ) && !this.checkAgainstAdress( this._C[ i ].adress, regex ) ) {
                    // total mismatch, delete club from list
                    this._C.splice( i, 1 );
                    i -= 1;
                    l -= 1;
                }
            }
        },

        clone: function clone() {
            return new Clubs( this.get() );
        }
    }; // proto

    return {
        initialize: Clubs
    };

}));