// this model covers multiple activities

;define('models/activities', ['utils'], (function( Utils ){

    function Activities( activities ) {
        this._A = activities.slice( 0 );

        for (var i = 0, l = this._A.length; i < l; i+=1) {
            this._A[ i ][ 'link' ] = '/activity/' + this._A[ i ][ 'id_heitz_activity' ] + '/info';
        }
    }

    Activities.prototype = {

        get: function get () {
            return this._A;
        },

        clone: function clone() {
            return new Activities( this.get() );
        }
    }; // proto

    return {
        initialize: Activities
    };

}));