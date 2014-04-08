// this model covers a unique club

;define('models/club', ['jquery', 'utils'], (function( $, Utils ){

    function Club( club ) {
        var days = ['Lundi: ', 'Mardi: ', 'Mercredi: ', 'Jeudi: ', 'Vendredi: ', 'Samedi: ', 'Dimanche: '],
            tmpNews;

        this._C = $.extend(true, {}, club);

        // update horaire club et piscine
        for (var i = 0 ; i < 7; i += 1) {
            if ( this._C['horaire_club'][ i ] === 'fermé' ) {
                this._C['horaire_club'][ i ] = ( days[ i ] + this._C['horaire_club'][ i ] );
            } else {
                this._C['horaire_club'][ i ] = ( days[ i ] + 'de ' + this._C['horaire_club'][ i ] );
            }
        }

        // maybe there's no swiming pool -> no horaire_piscine key (oui j'aime le franglishe :)
        if ( this._C['horaire_piscine'] ) {
            this._C.hasSwimmingPool = {};
            for (var i = 0 ; i < 7; i += 1) {
                if ( this._C['horaire_piscine'][ i ] === 'fermé' ) {
                    this._C['horaire_piscine'][ i ] = ( days[ i ] + this._C['horaire_piscine'][ i ] );
                } else {
                    this._C['horaire_piscine'][ i ] = ( days[ i ] + 'de ' + this._C['horaire_piscine'][ i ] );
                }
            } 
        } // else no hit in template

        // each club has many news, for each of one, load appropriate image & compute its link
        if ( this._C.news ) {
            for (var i = 0, l = this._C.news.length; i < l; i += 1) {
                tmpNews = this._C.news[ i ];
                Utils.loadAppropriateImage( tmpNews );
                tmpNews['link'] = '/news/' + tmpNews['id_news'] + '/info';
            } 
        }

        this._C['tel_command'] = "javascript: alert('rr');";
    }

    Club.prototype = {

        get: function get () {
            return this._C;
        }
    }; // proto

    return {
        initialize: Club
    };

}));