;define('utils', ['mustache', 'models/activities'], (function( mustache, Activities ){

    // jsonp settings
    var jsonSettings = {
      dataType: 'jsonp',
      contentType: "application/json",
      jsonpCallback: 'jsonp'
    },

      _retina,

      // used in activities view utility
      _activitiesStack, _allActivities, _activitiesPartial;

    if (typeof(Number.prototype.toRad) === "undefined") {
      Number.prototype.toRad = function() {
        return this * Math.PI / 180;
      }
    }

    function distance(lon1, lat1, lon2, lat2) {
      // lon2 & lat2 are from json
      lon2 = parseFloat( lon2, 10 );
      lat2 = parseFloat( lat2, 10 );

      var R = 6371; // Radius of the earth in km
      var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
      var dLon = (lon2-lon1).toRad(); 
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
              Math.sin(dLon/2) * Math.sin(dLon/2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    }

    function onCurrentPosition( fn ) {
      window.navigator.geolocation.getCurrentPosition(function(pos) {
        var myLong = pos.coords.longitude,
          myLat = pos.coords.latitude;
        fn( { lon: myLong, lat: myLat } );
      });
    }

    function urlFormat( segment ) {
      return 'http://www-tmp.cmgsportsclub.com/api/get/' + segment;
    }

    // object must has 2 fields, image_retina & image_simple
    function loadAppropriateImage( object ) {
      if ( window.devicePixelRatio > 1 ) {
        object['image_finale'] = object['image_retina'];
      } else {
        object['image_finale'] = object['image_simple'];
      }
      return object;
    }

      // for categories:, detect if SVG needed or simple picto. also put category's first letter in uppercase & create a link
      function _formatCategories( categories ) {
            var tmp, svgList = ['danse', 'force', 'piscine'],
                svgContent = [
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"> \
      <path d="M31.716,11.832v2.797h-0.027v59.523c-3.111-1.391-6.916-1.955-10.897-1.393c-9.153,1.293-15.768,8.035-14.775,15.064  c0.992,7.027,9.216,11.676,18.369,10.383c8.646-1.221,15.023-7.307,14.867-13.9h0.006V35.628c16.611-4.931,33.46-6.991,42.868-7.816  v36.465c-3.111-1.393-6.917-1.957-10.897-1.395c-9.153,1.293-15.768,8.037-14.775,15.064s9.216,11.678,18.369,10.385  c8.645-1.223,15.023-7.309,14.866-13.902h0.008V27.293V4.753V1.202C52.01-0.73,31.716,11.832,31.716,11.832z"/> \
      </svg>',

      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve"> \
            <path d="M23.184,8.164c-1.294,0-2.366,2.826-2.573,6.531h-9.22c-0.208-3.705-1.279-6.531-2.574-6.531H7.538C8.809,9.513,9.47,12.768,9.47,16c0,3.231-0.661,6.486-1.932,7.836h1.279c1.294,0,2.366-2.826,2.573-6.53h9.221c0.208,3.704,1.279,6.53,2.573,6.53c1.442,0,2.611-3.509,2.611-7.836C25.795,11.672,24.626,8.164,23.184,8.164zM28.407,9.47h-1.17c-0.413-0.824-0.909-1.306-1.442-1.306h-1.279c1.271,1.349,1.933,4.604,1.933,7.836c0,3.231-0.661,6.486-1.933,7.836h1.279c0.533,0,1.029-0.482,1.442-1.306h1.17c1.201,0,2.176-2.924,2.176-6.53S29.608,9.47,28.407,9.47zM3.593,9.47c-1.201,0-2.176,2.924-2.176,6.53s0.975,6.53,2.176,6.53c1.203,0,2.177-2.924,2.177-6.53S4.795,9.47,3.593,9.47zM3.593,17.306c-0.361,0-0.653-0.584-0.653-1.306c0-0.721,0.292-1.306,0.653-1.306S4.246,15.279,4.246,16C4.246,16.722,3.954,17.306,3.593,17.306zM6.205,8.164c-0.517,0-0.998,0.459-1.402,1.238c1.104,1.179,1.62,3.962,1.62,6.598c0,2.637-0.515,5.419-1.62,6.598c0.404,0.778,0.885,1.238,1.402,1.238c1.442,0,2.612-3.509,2.612-7.836C8.817,11.672,7.647,8.164,6.205,8.164z"/> \
            </svg>',

            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="100px" height="87.5px" viewBox="0 0 100 87.5" enable-background="new 0 0 100 87.5" xml:space="preserve"> \
                  <path d="M100,77.777c-1.736,0.695-3.473,1.39-5.556,1.39c-4.167,0-6.944-2.778-11.111-2.778c-4.166,0-6.944,2.778-11.11,2.778  c-4.167,0-6.945-2.778-11.111-2.778c-4.167,0-6.944,2.778-11.111,2.778c-4.167,0-6.944-2.778-11.111-2.778  c-4.167,0-6.944,2.778-11.111,2.778s-6.944-2.778-11.111-2.778c-4.167,0-6.944,2.778-11.111,2.778c-2.083,0-3.819-0.692-5.556-1.387  v8.334C1.736,86.809,3.472,87.5,5.556,87.5c4.167,0,6.944-2.777,11.111-2.777c4.167,0,6.945,2.777,11.111,2.777  s6.944-2.777,11.111-2.777c4.167,0,6.945,2.777,11.111,2.777c4.167,0,6.944-2.777,11.111-2.777c4.166,0,6.944,2.777,11.111,2.777  c4.166,0,6.944-2.777,11.11-2.777c4.167,0,6.944,2.777,11.111,2.777c2.083,0,3.819-0.694,5.556-1.389V77.777z"/> \
                  <path d="M100,61.111c-1.736,0.694-3.473,1.389-5.556,1.389c-4.167,0-6.944-2.777-11.111-2.777c-4.166,0-6.944,2.777-11.11,2.777  c-4.167,0-6.945-2.777-11.111-2.777c-4.167,0-6.944,2.777-11.111,2.777c-4.167,0-6.944-2.777-11.111-2.777  c-4.167,0-6.944,2.777-11.111,2.777s-6.944-2.777-11.111-2.777c-4.167,0-6.944,2.777-11.111,2.777c-2.083,0-3.819-0.691-5.556-1.386  v8.333c1.736,0.694,3.472,1.386,5.556,1.386c4.167,0,6.944-2.777,11.111-2.777c4.167,0,6.945,2.777,11.111,2.777  s6.944-2.777,11.111-2.777c4.167,0,6.945,2.777,11.111,2.777c4.167,0,6.944-2.777,11.111-2.777c4.166,0,6.944,2.777,11.111,2.777  c4.166,0,6.944-2.777,11.11-2.777c4.167,0,6.944,2.777,11.111,2.777c2.083,0,3.819-0.694,5.556-1.389V61.111z"/> \
                  <path d="M16.667,54.167v-2.778h27.778v4.167c1.736,0.694,3.472,1.389,5.556,1.389c0.994,0,1.904-0.164,2.777-0.404V27.778  c0-10.722,8.723-19.444,19.445-19.444c10.722,0,19.444,8.723,19.444,19.444c0,2.302,1.864,4.167,4.166,4.167S100,30.08,100,27.778  C100,12.46,87.538,0,72.223,0C57.374,0,45.245,11.719,44.515,26.389H16.737c0.717-10.073,9.121-18.055,19.374-18.055  c3.316,0,6.432,0.849,9.165,2.322c1.523-2.388,3.348-4.565,5.432-6.468C46.46,1.547,41.469,0,36.111,0  C20.795,0,8.333,12.46,8.333,27.778V56.54C11.123,55.771,13.494,54.167,16.667,54.167z M16.667,34.722h27.778v8.333H16.667V34.722z"/> \
                  </svg>'
                ];

            for (var j = 0, m = categories.length; j < m; j+=1) {
                for (var i = 0, l = svgList.length; i < l; i+=1) {
                    if ( categories[j].name === svgList[i] ) {
                        categories[j].hasSVG = {};
                        categories[j].svg = svgContent[i];
                    }
                }
                // once check done, put to uppercase
                tmp = categories[j].name.split('');
                tmp[0] = tmp[0].toUpperCase();
                categories[j]['up_name'] = tmp.join('');
                // finally create link, via data-attribute
                categories[j]['data_link'] = 'activities/type/' + categories[j]['id_heitz_type_activity'];
            }
        }



      // do an intersection on name between 2 activities sets
      // sets are typeof Activities
      function _intersectionActivities( set1, set2 ) {
          // the returned set will be the smallest one, killer is the set which intersec
          var ret, killer, isIntersec, finalRet = [];

          if ( set1.length() < set2.length() ) {
              ret = set1;
              killer = set2;
          }  else {
              ret = set2;
              killer = set1;
          }

          isIntersec = new Array( ret.length() );

          // intersec on smallest set, create the intersec map
          for (var i = 0, l = ret.length(); i < l; i+=1) {
              for (var j = 0, m = killer.length(); j < m; j+=1) {
                  if ( ret.get()[i].name === killer.get()[j].name ) {
                      // intersec
                      isIntersec[ i ] = true;
                      break;
                  }
              }
          }

          // retrieve the intersec set
          for (var i = 0, l = ret.length(); i < l; i+=1) {
              if ( isIntersec[ i ] === true ) {
                  finalRet.push( ret.get()[ i ] );
              }
          }

          // finally transform finalRet into Activities type
          finalRet = new Activities.initialize( finalRet, true );

          return finalRet;
      }

      // update activities list, on adding params or deleting them. based on search by terms or categories
      // 'type' indicate if search is by terms or categories. 'activities' is empty if it is a deletion,
      // otherwise each activitiesSet is independant from one to another
      // fn is a callback when activities loaded in view
      function _updateActivities( type, activitiesList, activitiesSet, fn ) {
          var finalSet;
          if ( activitiesSet ) {
              if ( type === 'category' ) {
                  _activitiesStack.push( { 'type': 'category', value: activitiesSet } );
              } else {
                  _activitiesStack.push( { 'type': 'terms', value: activitiesSet } );
              }
              // get intersection if needed
              if ( _activitiesStack.length === 2 ) { // both search on 'term' & 'category', order not relevant, but set length is
                  finalSet = _intersectionActivities( _activitiesStack[0].value, _activitiesStack[1].value );

              } else { // no intersec, search on 'term' OR 'category'
                  finalSet = activitiesSet;
              }

          } else { // deletetion

              // if stack full, go a step back. type is the type deleted
              if ( _activitiesStack.length === 2 ) {
                  for (var j = 0; j < 2; j+=1) {
                      if ( _activitiesStack[ j ].type !==  type ) {
                          finalSet = _activitiesStack[ j ].value;
                          _activitiesStack = [];
                          _activitiesStack.push( { 'type': type, value: finalSet } );
                          break;
                      }
                  }
              } else { // stack as one item, just reload all activities
                  finalSet = _allActivities;
                  _activitiesStack.pop();
              }

          }

          // finally update the view
          require([ _activitiesPartial ], function onTplLoaded( tpl ) {
              activitiesList.innerHTML = mustache.to_html(tpl, { items: finalSet.get() });
              if ( fn ) {
                  fn();
              }
          });
      }



      // initialize search activities list view (used in 2 differents places: clubscontroller & activitiescontroller )
      // allActivities: all exiting activities
      function initSearchActivitiesView( allActivities, partial ) {
          _allActivities = allActivities;
          _activitiesPartial = partial;
          _activitiesStack = [];

          return function attachEvents( currentLevel ) {
              var categoryButton = currentLevel.querySelector('.by-type-activity'),
                  searchButton = currentLevel.querySelector('.search'),
                  searchBar = currentLevel.querySelector('.search-field'),
                  deleteButton = currentLevel.querySelector('.delete'),
                  activitiesList = currentLevel.querySelector('#list-activities'),
                  categoriesList = currentLevel.querySelector('#list-type-activities'),
                  dialog = currentLevel.querySelector('#picked-type-activity'),
                  categories;

              // search: filter by term
              searchButton.addEventListener( 'click', function sortActivitiesByTerms() {
                  var activities = _allActivities.clone();
                  activities.sortByTerms( $(searchBar).val() );
                  _updateActivities( 'terms', activitiesList, activities );
              });

              // search: unfilter by term
              deleteButton.addEventListener( 'click', function resetActivitiesByTerms() {
                  if ( $(searchBar).val() ) {
                      $(searchBar).val('');
                      _updateActivities( 'terms', activitiesList );
                  }
              });

              // toggle lists visibilities
              categoryButton.addEventListener( 'click', function loadCategories() {
                  if ( categories ) {  // categories already loaded, just toggle
                      categoriesList.classList.toggle('hide');
                      activitiesList.classList.toggle('hide');
                  } else { // load, initate click event on categories,  then toggle visibilities
                      $.ajax($.extend(
                        jsonSettings,
                        {
                          url: urlFormat('type_activity'),
                          success: function( json ) {
                              // load categories & detect SVG
                              categories = json.response;
                              _formatCategories( categories );
                              require(['text!../tpl/categories_partial.tpl.html'], function onTplLoaded( tpl ) {
                                  categoriesList.innerHTML = mustache.to_html(tpl, {items: categories} );
                              });
                              // toggle
                              categoriesList.classList.toggle('hide');
                              activitiesList.classList.toggle('hide');
                          },
                          error: function( jqXHR, errorType ) {
                              console.log('failed!');
                          }
                        })
                      );
                  }
              });

              // on click on a category, update the activities list, display the dialog & hide category list
              categoriesList.addEventListener( 'click', function loadActivitiesByCat( e ) {
                  var elem = e.target, catName,
                    url, newActivities;
                  while ( elem && elem.nodeName !== 'A' ) {
                      elem = elem.parentNode;
                  }
                  if ( elem && elem.nodeName === 'A' ) {
                      url = elem.getAttribute('data-link');
                      catName = elem.querySelector('.name').innerHTML;

                      $.ajax($.extend(
                        jsonSettings,
                        {
                          'url': urlFormat( url ),
                          success: function( json ) {
                              function onActivitiesInView() {
                                  // display dialog
                                  dialog.querySelector('.name').innerHTML = catName;
                                  dialog.classList.toggle('hide');
                                  // toggle
                                  categoriesList.classList.toggle('hide');
                                  activitiesList.classList.toggle('hide');
                              }
                              // load activities
                              newActivities = new Activities.initialize( json.response );
                              _updateActivities( 'category', activitiesList, newActivities, onActivitiesInView );
                          },
                          error: function( jqXHR, errorType ) {
                              console.log('failed!');
                          }
                        })
                      );
                  }
              }); // click on a category
              
              // click on close category -> unfilter on category
              dialog.querySelector('.delete').addEventListener( 'click', function cleanCategoryFilter() {
                  _updateActivities( 'category', activitiesList );
                  dialog.classList.toggle('hide');
              });

          }; // attachEvents

      } // initSearchActivitiesView



    return {
        'onCurrentPosition': onCurrentPosition,
        'distance': distance,
        'json': jsonSettings,
        'url': urlFormat,
        'loadAppropriateImage': loadAppropriateImage,
        'initSearchActivitiesView': initSearchActivitiesView
    };

}));