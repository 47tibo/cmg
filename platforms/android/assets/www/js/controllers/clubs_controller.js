;define('controllers/clubs_controller', ['mustache', 'jquery', 'utils', 'models/clubs', 'models/club'], (function( mustache, $, Utils, Clubs, Club ){

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

        return {
            load: load
        };

}));