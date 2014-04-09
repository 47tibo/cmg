;define('controllers/application_controller', ['mustache', 'jquery', 'utils', 'models/clubs'], (function( mustache, $, Utils, Clubs ){

        //mandatory for jqueryjsonp
        function jsonp() {}


        var _load = {
            'home': home,
            'subscriptions': subscriptions,
            'search': search
        },
        _onViewLoaded;

        function load( action, params, onViewLoaded ){
            _load[ action ]( params );
            _onViewLoaded = onViewLoaded;
        }


        function home() {
            // here send XHR & handle params

            require([
            'text!../tpl/home.tpl.html'
            ], function onTplLoaded( tpl ) {
                // pass params
                var view = mustache.to_html(tpl);
                _onViewLoaded( view );
            });

        }

        function subscriptions() {
            var subscriptions;

            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('subscriptions'),
                success: function( json ) {
                  subscriptions = json.response.slice( 0 );

                  // get the right image resolution
                  for (var i = 0, l = subscriptions.length; i < l; i+=1) {
                      subscriptions[ i ] = Utils.loadAppropriateImage( subscriptions[ i ] );
                  }

                    require(['text!../tpl/subscriptions.tpl.html'], function onTplLoaded( tpl ) {
                        var view = mustache.to_html(tpl, { items: subscriptions });
                        _onViewLoaded( view );
                    });
                },
                error: function( jqXHR, errorType ) {
                    console.log('failed!');
                }
              })
            );
        }



        // those funcs are used in search view
        function _initSearchClub( clubsSection, clubs ) {
            var clubList = clubsSection.querySelector('ul'),
                locateButton = clubsSection.querySelector('.locate'),
                searchButton = clubsSection.querySelector('.search'),
                searchBar = clubsSection.querySelector('.search-field'),
                deleteButton = clubsSection.querySelector('.delete'),
            
            // state when switching between search
            clubsByTerms;

            clubs = new Clubs.initialize( clubs, true );

            require(['text!../tpl/search_club_partial.tpl.html'], function onTplLoaded( tpl ) {
                clubList.innerHTML = mustache.to_html(tpl, { items: clubs.get() });

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
            });

        } // _initSearchClub

        function search() {
            var clubs, activities;

            $.ajax($.extend(
              Utils.json,
              {
                url: Utils.url('clubs'),
                success: function( json ) {
                    clubs = json.response;
                    $.ajax($.extend(
                      Utils.json,
                      {
                        url: Utils.url('activities'),
                        success: function( json ) {
                            activities = json.response;
                            require(['text!../tpl/search_all.tpl.html'], function onTplLoaded( tpl ) {
                                var view = mustache.to_html(tpl);
                               
                                function attachEvents( currentLevel ) {
                                    var clubsButton = currentLevel.querySelector('#clubs-tab'),
                                        activitiesButton = currentLevel.querySelector('#type-activities'),
                                        horairesButton = currentLevel.querySelector('#horaires-tab'),

                                        resultsSection = currentLevel.querySelector('#search-results'),
                                        clubsSection = currentLevel.querySelector('#search-clubs'),
                                        activitiesSection = currentLevel.querySelector('#search-activities'),
                                        horairesSection = currentLevel.querySelector('#search-schedules');

                                    clubsButton.addEventListener( 'click', function clickClubButton() {
                                        resultsSection.classList.add('hide');
                                        activitiesSection.classList.add('hide');
                                        horairesSection.classList.add('hide');
                                        clubsSection.classList.remove('hide');

                                        _initSearchClub( clubsSection, clubs );

                                    }); // clickClubButton

                                    activitiesButton.addEventListener( 'click', function clickActivitiesButton() {
                                        resultsSection.classList.add('hide');
                                        activitiesSection.classList.remove('hide');
                                        horairesSection.classList.add('hide');
                                        clubsSection.classList.add('hide');
                                    }); // clickActivitiesButton

                                    horairesButton.addEventListener( 'click', function clickHorairesButton() {
                                        resultsSection.classList.add('hide');
                                        activitiesSection.classList.add('hide');
                                        horairesSection.classList.remove('hide');
                                        clubsSection.classList.add('hide');
                                    }); // clickHorairesButton

                                } // attachEvent

                                // once all in place, put the view in the app, visible for the user and attach events
                                _onViewLoaded( view, attachEvents );
                            });
                        },
                        error: function( jqXHR, errorType ) {
                            console.log('failed!');
                        }
                      }));
                },
                error: function( jqXHR, errorType ) {
                    console.log('failed!');
                }
              }
            ));
        }

        return {

            load: load

        }

}));