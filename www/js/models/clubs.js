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
            var self = this;

            Utils.onCurrentPosition( function( coords ){
                var clubLat, clubLong, distance;
                for (var i = 0, l = self._C.length; i < l; i+=1) {
                    clubLat = self._C[ i ].latitude;
                    clubLong = self._C[ i ].longitude;
                    distance = Utils.distance( coords.lon, coords.lat, clubLong, clubLat ); //km
                    self._C[ i ].distance = distance;
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