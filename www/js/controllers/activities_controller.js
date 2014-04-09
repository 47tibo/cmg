;define('controllers/activities_controller', ['mustache', 'jquery', 'utils', 'models/activities', 'models/activity', 'models/lessons'],
    (function( mustache, $, Utils, Activities, Activity, Lessons ){

        //mandatory for jqueryjsonp
        function jsonp() {}


        // routing conf
        var _load = {
            'index': index,
            'show': show,
            'planning': planning
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
                  var activities = new Activities.initialize( json.response );

                    require(['text!../tpl/search_activity.tpl.html'], function onTplLoaded( tpl ) {
                        var view = mustache.to_html(tpl, { items: activities.get() }),
                            attachEvents = Utils.initSearchActivitiesView( activities, 'text!../tpl/search_activity_partial.tpl.html' );

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

        function planning ( params ) {
            var lessons,
                activityId = params.id,
                page = parseInt( params.page, 10),
                activityName;

            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('activity/' + activityId + '/info' ),
                success: function( json ) {
                    activityName = json.response.name;

                    // now retrieve cours
                    $.ajax($.extend(
                      Utils.json,
                      {
                        url: Utils.url('activity/' + activityId + '/planning/0'),
                        success: function( json ) {
                          lessons = new Lessons.initialize( json.response );
                            require(['text!../tpl/search_activity_schedule.tpl.html'], function onTplLoaded( tpl ) {
                                var view = mustache.to_html(tpl, {  'name': activityName, items: lessons.get() } );

                                function attachEvents( currentLevel ) {
                                    var lessonList = currentLevel.querySelector('ul'),
                                        locateButton = currentLevel.querySelector('.locate'),
                                        searchButton = currentLevel.querySelector('.search'),
                                        searchBar = currentLevel.querySelector('.search-field'),
                                        deleteButton = currentLevel.querySelector('.delete'),

                                    // state when switching between search
                                    lessonsByTerms;

                                    // locate: filter by location
                                    locateButton.addEventListener( 'click', function sortClubsByLocation() {
                                        if ( lessonsByTerms ) { 
                                            // previously searched by terms -> sort the lessonsByTerms subset but also lessons in
                                            // case of the specific use case: filter by term + locate + unfiter by term
                                            lessonsByTerms.sortByLocation( function whenSorted() {
                                                require(['text!../tpl/search_activity_schedule_partial.tpl.html'], function onTplLoaded( tpl ) {
                                                    lessonList.innerHTML = mustache.to_html(tpl, { items: lessonsByTerms.get() });
                                                });
                                            });
                                            lessons.sortByLocation(); // no callback needed
                                        } else { // search by location first
                                            lessons.sortByLocation( function whenSorted() {
                                                require(['text!../tpl/search_activity_schedule_partial.tpl.html'], function onTplLoaded( tpl ) {
                                                    lessonList.innerHTML = mustache.to_html(tpl, { items: lessons.get() });
                                                });
                                            });
                                        }
                                    });

                                    // search: filter by term
                                    searchButton.addEventListener( 'click', function sortClubsByTerms() {
                                        lessonsByTerms = lessons.clone();
                                        lessonsByTerms.sortByTerms( $(searchBar).val() );
                                        require(['text!../tpl/search_activity_schedule_partial.tpl.html'], function onTplLoaded( tpl ) {
                                            lessonList.innerHTML = mustache.to_html(tpl, { items: lessonsByTerms.get() });
                                        });
                                    });

                                    // search: unfilter by term
                                    deleteButton.addEventListener( 'click', function resetClubsByTerms() {
                                        $(searchBar).val('');
                                        // just reload the "lessons" reference - might be sorted by location
                                        require(['text!../tpl/search_activity_schedule_partial.tpl.html'], function onTplLoaded( tpl ) {
                                            lessonList.innerHTML = mustache.to_html(tpl, { items: lessons.get() });
                                        });
                                    });

                                } // attachEvent

                                _onViewLoaded( view, attachEvents );
                            });
                        },
                        error: function( jqXHR, errorType ) {
                            console.log('failed!');
                        }
                      })
                    );
                },
                error: function( jqXHR, errorType ) {
                    console.log('failed!');
                }
              })
            );
        } // planning

        return {
            load: load
        };

}));