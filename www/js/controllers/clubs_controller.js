;define('controllers/clubs_controller', ['mustache', 'jquery', 'utils', 'models/clubs'], (function( mustache, $, Utils, Clubs ){

        //mandatory for jqueryjsonp
        function jsonp() {}


        // routing conf
        var _load = {
            'index': index
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
                                searchBar = currentLevel.querySelector('.search-field');

                            // locate: filter by location
                            locateButton.addEventListener( 'click', function sortClubsByLocation() {
                                clubs.sortByLocation( function whenSorted() {
                                    require(['text!../tpl/search_club_partial.tpl.html'], function onTplLoaded( tpl ) {
                                        clubList.innerHTML = mustache.to_html(tpl, { items: clubs.get() });
                                    });
                                }); // click on locate
                            });

                            // search: filter by term
                            searchButton.addEventListener( 'click', function sortClubsByTerms() {
                                clubs.sortByTerms( $(searchBar).val() );
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

        }

        return {
            load: load
        };

}));