;define('models/lessons', ['utils'], (function( Lessons ){

    function Lessons( lessons ) {
        this._L = lessons.slice( 0 );
    }

    Lessons.prototype = {

        get: function get () {
            return this._L;
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