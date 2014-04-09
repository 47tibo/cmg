;define('controllers/activities_controller', ['mustache', 'jquery', 'utils', 'models/activities', 'models/activity'],
    (function( mustache, $, Utils, Activities, Activity ){

        //mandatory for jqueryjsonp
        function jsonp() {}


        // routing conf
        var _load = {
            'index': index,
            'show': show
        },
        _onViewLoaded;


        function load( action, params, onViewLoaded ){
            _load[ action ]( params );
            _onViewLoaded = onViewLoaded;
        }


        function index() {

            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('activities'),
                success: function( json ) {
                  // cache all activities
                  var _allActivities = new Activities.initialize( json.response );

                    require(['text!../tpl/search_activity.tpl.html'], function onTplLoaded( tpl ) {
                        var view = mustache.to_html(tpl, { items: _allActivities.get() });
                        var attachEvents = Utils.initSearchActivitiesView(_allActivities);


                        _onViewLoaded( view, attachEvents );
                    });
                },
                error: function( jqXHR, errorType ) {
                    console.log('failed!');
                }
              })
            );

        }

        function show ( params ) {
            var aActivity, activityId = params.id;

            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('activity/' + activityId + '/info' ),
                success: function( json ) {
                  new Activity.initialize( json.response, function activityWithLessons( aActivity ) {
                    require(['text!../tpl/activity.tpl.html'], function onTplLoaded( tpl ) {
                        var view = mustache.to_html(tpl, aActivity.get() );
                        _onViewLoaded( view );
                    });
                  });
                },
                error: function( jqXHR, errorType ) {
                    console.log('failed!');
                }
              })
            );
        } // show

        return {
            load: load
        };

}));