;define('controllers/application_controller', ['mustache', 'jquery', 'utils', 'models/clubs'], (function( mustache, $, Utils, Clubs ){

        //mandatory for jqueryjsonp
        function jsonp() {}


        var _load = {
            'home': home,
            'subscriptions': subscriptions,
            'search': search,
            'credits': credits
        },
        _onViewLoaded,
        // only load search pages (clubs, activités, time) one time
        _searchLockers = [ false, false, false ];

        function load( action, params, onViewLoaded ){
            _load[ action ]( params );
            _onViewLoaded = onViewLoaded;
        }


        function home() {
            Utils.ajax(
                'home',
                function( json ) {
                  var homeNews = json.response.slice( 0 ), firstHomeNews;

                  // get the right image resolution
                  for (var i = 0, l = homeNews.length; i < l; i+=1) {
                      homeNews[ i ] = Utils.loadAppropriateImage( homeNews[ i ] );
                  }

                  // TODO, handle multiple news in caraousel
                  firstHomeNews = homeNews[ 0 ];

                    require([
                    'text!../tpl/home.tpl.html'
                    ], function onTplLoaded( tpl ) {
                        var view = mustache.to_html(tpl, firstHomeNews);

                        function attachEvents( currentLevel ) {
                            var homeCarousel = currentLevel.querySelector('#home-carousel'),
                                homeImage = currentLevel.querySelector('#home-carousel > img'),
                                homeFooter = currentLevel.querySelector('footer'),
                                mainHeader = document.querySelector('#app-header'),
                                // compute height of image overlay, cropped by homecarousel elem
                                deviceHeight = $(window).height(),
                                imageOverlayHeight = (deviceHeight * 80) / 100,
                                homeFooterHeight = (deviceHeight * 10) / 100,
                                mainHeaderHeight = (deviceHeight * 10) / 100;

                            imageOverlayHeight = parseInt( imageOverlayHeight, 10 );

                            // resize homecarousel & image to properly fill screen
                            homeCarousel.style.height = imageOverlayHeight + 'px';
                            homeImage.height = imageOverlayHeight;
                            homeFooter.style.height = homeFooterHeight + 'px';
                            mainHeader.style.height = mainHeaderHeight + 'px';
                            mainHeader.style.lineHeight = mainHeaderHeight + 'px';
                        } // attachEvent

                        // once all in place, put the view in the app, visible for the user and attach events
                        _onViewLoaded( view, attachEvents );
                    });

                },
                function( jqXHR, errorType ) {
                    console.log('failed!');
                }
            );
        }


        function subscriptions() {
            Utils.ajax(
                'subscriptions',
                function( json ) {
                  var subscriptions;
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
                function( jqXHR, errorType ) {
                    console.log('failed!');
                }
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
            Utils.ajax(
                'clubs',
                function( json ) {
                    var clubs, activities;

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

                                        if ( !_searchLockers[ 0 ] ) {
                                            _initSearchClub( clubsSection, clubs );
                                            _searchLockers[ 0 ] = true;
                                        }

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
                function( jqXHR, errorType ) {
                    console.log('failed!');
                }
            );
        }

        function credits() {
            Utils.ajax(
                'credits',
                function( json ) {
                    var credits;
                    credits = json.response;
                    require(['text!../tpl/credits.tpl.html'], function onTplLoaded( tpl ) {
                      var view = mustache.to_html( tpl, {'credits': credits} );
                      _onViewLoaded( view );
                    });
                },
                function( jqXHR, errorType ) {
                    console.log('failed!');
                }
            );
        }

        return {

            load: load

        }

}));