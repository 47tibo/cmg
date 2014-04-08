;define('controllers/clubs_controller', ['mustache', 'jquery', 'utils', 'models/clubs', 'models/club', 'models/activities', 'models/cours'],
    (function( mustache, $, Utils, Clubs, Club, Activities, Cours ){

        //mandatory for jqueryjsonp
        function jsonp() {}


        // routing conf
        var _load = {
            'index': index,
            'show': show,
            'activities': activities,
            'planning': planning
        },
        _onViewLoaded;


        function load( action, params, onViewLoaded ){
            _load[ action ]( params );
            _onViewLoaded = onViewLoaded;
        }


        function index() {
          var clubs;

            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('clubs'),
                success: function( json ) {
                  clubs = new Clubs.initialize( json.response );

                    require(['text!../tpl/search_club.tpl.html'], function onTplLoaded( tpl ) {
                        var view = mustache.to_html(tpl, { items: clubs.get() });
                        // lets put events the search bar & the locate button
                        // both will refresh the list of clubs

                        function attachEvents( currentLevel ) {
                            var clubList = currentLevel.querySelector('ul'),
                                locateButton = currentLevel.querySelector('.locate'),
                                searchButton = currentLevel.querySelector('.search'),
                                searchBar = currentLevel.querySelector('.search-field'),
                                deleteButton = currentLevel.querySelector('.delete'),

                            // state when switching between search
                            clubsByTerms;

                            // locate: filter by location
                            locateButton.addEventListener( 'click', function sortClubsByLocation() {
                                if ( clubsByTerms ) { 
                                    // previously searched by terms -> sort the clubsByTerms subset but also clubs in
                                    // case of the specific use case: filter by term + locate + unfiter by term
                                    clubsByTerms.sortByLocation( function whenSorted() {
                                        require(['text!../tpl/search_club_partial.tpl.html'], function onTplLoaded( tpl ) {
                                            clubList.innerHTML = mustache.to_html(tpl, { items: clubsByTerms.get() });
                                        });
                                    });
                                    clubs.sortByLocation(); // no callback needed
                                } else { // search by location first
                                    clubs.sortByLocation( function whenSorted() {
                                        require(['text!../tpl/search_club_partial.tpl.html'], function onTplLoaded( tpl ) {
                                            clubList.innerHTML = mustache.to_html(tpl, { items: clubs.get() });
                                        });
                                    });
                                }
                            });

                            // search: filter by term
                            searchButton.addEventListener( 'click', function sortClubsByTerms() {
                                clubsByTerms = clubs.clone();
                                clubsByTerms.sortByTerms( $(searchBar).val() );
                                require(['text!../tpl/search_club_partial.tpl.html'], function onTplLoaded( tpl ) {
                                    clubList.innerHTML = mustache.to_html(tpl, { items: clubsByTerms.get() });
                                });
                            });

                            // search: unfilter by term
                            deleteButton.addEventListener( 'click', function resetClubsByTerms() {
                                $(searchBar).val('');
                                // just reload the "clubs" reference - might be sorted by location
                                require(['text!../tpl/search_club_partial.tpl.html'], function onTplLoaded( tpl ) {
                                    clubList.innerHTML = mustache.to_html(tpl, { items: clubs.get() });
                                });
                            });

                        } // attachEvent

                        // once all in place, put the view in the app, visible for the user and attach events
                        _onViewLoaded( view, attachEvents );
                    });
                },
                error: function( jqXHR, errorType ) {
                    console.log('failed!');
                }
              })
            );

        } // index

        function show ( params ) {
            var aClub, clubId = params.id;

            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('club/' + clubId + '/info' ),
                success: function( json ) {
                  aClub = new Club.initialize( json.response );

                    require(['text!../tpl/club.tpl.html'], function onTplLoaded( tpl ) {
                        var view = mustache.to_html(tpl, aClub.get() );
                        _onViewLoaded( view );
                    });
                },
                error: function( jqXHR, errorType ) {
                    console.log('failed!');
                }
              })
            );
        } // show

        function activities ( params ) {
            var activities, clubId = params.id,
                clubName, clubType;

            // name & type of club are display ontop of the list, so retrieve them
            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('club/' + clubId + '/info' ),
                success: function( json ) {
                    clubName = json.response.name;
                    clubType = json.response.type;

                    // now retrieve activities
                    $.ajax($.extend(
                      Utils.json,
                      {
                        url: Utils.url('club/' + clubId + '/activities' ),
                        success: function( json ) {
                          activities = new Activities.initialize( json.response );

                            require(['text!../tpl/search_club_activity.tpl.html'], function onTplLoaded( tpl ) {
                                var view = mustache.to_html(tpl, {  'name': clubName, 'type': clubType, items: activities.get() } );
                                _onViewLoaded( view );
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
        } // activities



        // functions used in planning view to update day data & planning
        function _updateDay( day, dayMarkers, dayPlaceholder ) { // day is between 1 & 7
            var days = [ 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche' ];
            day -= 1;

            // unselect then, select the good day marker - nodelist
            for (var i = 0; i < 7; i+=1) {
                dayMarkers[ i ].className = '';
            }
            dayMarkers[ day ].className = 'current';
            // update day placeholder
            dayPlaceholder.innerHTML = days[ day ];
        }
        function _updatePlanning( clubId, day, planningList ) { // day is between 1 & 7
            var cours, pdfUrl;
            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('club/' + clubId + '/planning/' + day ),
                success: function( json ) {
                    cours = new Cours.initialize( json.response[ 0 ] );
                    pdfUrl = json.response[ 'url_pdf' ];

                    require(['text!../tpl/search_club_schedule_partial.tpl.html'], function onTplLoaded( tpl ) {
                        planningList.innerHTML = mustache.to_html(tpl, { items: cours.get(), 'url_pdf': pdfUrl } );
                    });
                },
                error: function( jqXHR, errorType ) {
                    console.log('failed!');
                }
              })
            );
        }


        function planning ( params ) {
            var cours,
                clubId = params.id,
                day = params.day,
                clubName, clubType, pdfUrl;

            // name & type of club are display ontop of the list, so retrieve them
            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('club/' + clubId + '/info' ),
                success: function( json ) {
                    clubName = json.response.name;
                    clubType = json.response.type;

                    // now retrieve cours
                    $.ajax($.extend(
                      Utils.json,
                      {
                        url: Utils.url('club/' + clubId + '/planning/' + day ),
                        success: function( json ) {
                          cours = new Cours.initialize( json.response[ 0 ] );
                          pdfUrl = json.response[ 'url_pdf' ];

                            require(['text!../tpl/search_club_schedule.tpl.html'], function onTplLoaded( tpl ) {
                                var view = mustache.to_html(tpl, {  'name': clubName, 'type': clubType, items: cours.get(), 'url_pdf': pdfUrl } );

                                // day between 1 & 7
                                function attachEvents( currentLevel ) {
                                    var
                                        // dom elems
                                        planningList = currentLevel.querySelector('ul:last-child'),
                                        dayMarkers = currentLevel.querySelectorAll('.time-caroussel li'),
                                        prevButton = currentLevel.querySelector('.prev'),
                                        nextButton = currentLevel.querySelector('.next'),
                                        dayPlaceholder = currentLevel.querySelector('.day');

                                    // init the current day
                                    _updateDay( day, dayMarkers, dayPlaceholder );

                                    // event handling
                                    prevButton.addEventListener( 'click', function previousDay() {
                                        day -= 1;
                                        if ( day > 0 ) {
                                            _updateDay( day, dayMarkers, dayPlaceholder );
                                            _updatePlanning( clubId, day, planningList );
                                        } else { // rich limit, clamp
                                            day = 1;
                                        }
                                    });
                                    nextButton.addEventListener( 'click', function nextDay() {
                                        day += 1;
                                        if ( day < 8 ) {
                                            _updateDay( day, dayMarkers, dayPlaceholder );
                                            _updatePlanning( clubId, day, planningList );
                                        } else {
                                            day = 7;
                                        }
                                    });

                                } // attachEvents

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