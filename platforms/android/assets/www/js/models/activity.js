;define('models/activity', ['jquery', 'utils'], (function( $, Utils ){

    function Activity( activity, fn ) {
        var self = this;

        this._A = activity;
        // get image with proper res
        this._A  = Utils.loadAppropriateImage( this._A  );
        // link to activity planning, first page, 0
        this._A[ 'link_planning' ] = '/activity/' + this._A[ 'id_heitz_activity' ] + '/planning/0';

        // Now we need the 1st 3 lessons to display activity
        $.ajax($.extend(
          Utils.json,
          {
            url: Utils.url('activity/' + activity['id_heitz_activity'] + '/lessons' ),
            success: function( json ) {
                // update with lessons & return complete activity
                self._A[ 'lessons' ] = json.response;
                fn( self );
            },
            error: function( jqXHR, errorType ) {
                console.log('failed!');
            }
          })
        );
    }

    Activity.prototype = {

        get: function get () {
            return this._A;
        }
    }; // proto

    return {
        initialize: Activity
    };

}));