;define('models/cours', ['utils'], (function( Cours ){

    function Cours( cours ) {
        this._C = cours.slice( 0 );

        // link to cours
        for (var i = 0, l = this._C.length; i < l; i+=1) {
            this._C[ i ][ 'link' ] = '/activity/' + this._C[ i ][ 'id_heitz_activity' ] + '/info';
        }
    }

    Cours.prototype = {

        get: function get () {
            return this._C;
        }
    }; // proto

    return {
        initialize: Cours
    };

}));