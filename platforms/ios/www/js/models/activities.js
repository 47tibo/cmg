// this model covers multiple activities

;define('models/activities', ['utils'], (function( Utils ){

    function Activities( activities, shallow ) {
        this._A = activities.slice( 0 );

        if ( !shallow ) {
            for (var i = 0, l = this._A.length; i < l; i+=1) {
                // link to activity details
                this._A[ i ][ 'link' ] = '/activity/' + this._A[ i ][ 'id_heitz_activity' ] + '/info';
                // link to activity planning, first page, 0
                this._A[ i ][ 'link_planning' ] = '/activity/' + this._A[ i ][ 'id_heitz_activity' ] + '/planning/0';
            }
        }
    }

    Activities.prototype = {

        get: function get () {
            return this._A;
        },

        length: function length() {
            return this._A.length;
        },

        splice: function splice( i, nb ) {
            return this._A.splice( i, nb );
        },

        noSchedule: function noSchedule() {
            for (var i = 0, l = this._A.length; i < l; i+=1) {
                this._A[ i ].hasNoSchedule = {};
            }
        },

        // sort by term on each activity name
        sortByTerms: function sortByTerms( terms ) {
            var  terms = terms.split(' '),
                regex = new RegExp(terms.join('|'), 'i');

            for (var i = 0, l = this._A.length; i < l; i+=1) {
                if ( !regex.test( this._A[ i ].name ) ) {
                    this._A.splice( i, 1 );
                    i -= 1;
                    l -= 1;
                }
            }
        },

        clone: function clone() {
            return new Activities( this.get() );
        }
    }; // proto

    return {
        initialize: Activities
    };

}));