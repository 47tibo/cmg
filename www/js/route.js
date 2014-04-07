;define('route', ['utils/viewport'], (function(viewport){

    var routes = {
                // application_controller
                '/home': ['application_controller', 'home'],
                '/subscriptions': ['application_controller', 'subscriptions'],
                // clubs_controller
                '/clubs': ['clubs_controller', 'index'],
                // news_controller
                '/news': ['news_controller', 'index'],
                '/news/:id/info': ['news_controller', 'show']
        },
        _routes = [],
        _direction = null,
        _currentLevel = 0;


    function init(){

        //window.addEventListener('popstate', loadAndAnimate );
     //window.addEventListener('pushstate', onPushState);
       // window.addEventListener('popstate', onPopState);




        // event delegation: prevent default on all <a> click in the app & push a new state
        document.querySelector('article').addEventListener( 'click', function detectHistoryChanges( e ) {
                var elem = e.target,
                  url;
                while ( elem && elem.nodeName !== 'A' ) {
                    elem = elem.parentNode;
                }
                if ( elem.nodeName === 'A' ) {
                    e.preventDefault();
                    url = elem.getAttribute('href');


                    if ( !/menu|login/.test( url ) ) {
                      // if prev, ie <a> has a class 'back'
                      if ( elem.classList.contains('back') ) {
                        _currentLevel -= 1;
                        _direction = 'backward';
                        _routes.pop();
                        route();
                      } else {
                        // forward
                        _direction = 'forward';
                        //window.history.pushState({},'', url);

                        // if click in tab in nav OR homepage, create the following history: 0: home / 1:current tab
                        if ( elem.classList.contains('reset') ) {
                          resetToTab( url );
                        } else {
                          // classic forward navigation
                          _currentLevel += 1;
                          _routes.push(url);
                          route();
                        }
                      }
                    }
                    // else user click in menu link OR login link or a id=123 link
                }
                // else user click in hell
        });

    }

    function dispose(){
        _routes = [];
        _direction = null;
        _currentLevel = 0;

    }


/*
    function loadAndAnimate( e ) {

      console.log( 'loadAndAnimate' );



        _currentRoute = window.location.pathname;
        // handle reegex on URL for params
        var controller = routes[ _currentRoute ][ 0 ],
          action = routes[ _currentRoute ][ 1 ],
          params = null;

          console.log( 'load ctl: ' + controller + '& action: ' + action  )

        require(['controllers/' + controller], function(ctrl){
            ctrl.load( action, params, onViewLoaded );
        });


    }

*/

    function animate () {

      document.querySelector('#app-body-wrapper').className = 'level-' + _currentLevel;

      /*
      var elemts, move;

      if ( _direction === 'forward' ) {

        move = 'left';
     //   elemts = ['#level-' + (_currentLevel - 1), '#level-' + _currentLevel];
       //         move = {direction: 'right', start: '-' + viewport.width + 'px', end: '0px'};

      } else {

        move = 'right'

     //   elemts = ['#level-' + ( _currentLevel + 1 ), '#level-' + _currentLevel];
       //         move = {direction: 'right', start: '0px', end: '-' + viewport.width + 'px'};

      }
*/
      /*

      alicejs.slide({
        elems: "app-body-wrapper",
        move: {direction: move, start: 30, end: 20},
        overshoot: '0',
        duration: "3000ms",
        timing: "ease",
        delay: "0ms",
        direction: "alternate",
        playstate: "running"
    });
    
    */


/*

       alice.plugins.cheshire({elems: elemts,
            delay: {value: '0ms', randomness: '0%'},
            duration: {value: '800ms', randomness: '0%'},
            timing: 'ease',
            iteration: '1',
            direction: 'false',
            playstate: 'running',
            move: move,
            rotate: '0%',
            flip: '',
            turns: '1',
            fade: '',
            scale: {from: '100%',to: '100%'},
            shadow: 'false',
            perspective: '1000',
            perspectiveOrigin: 'center',
            overshoot: '2%',
            backfaceVisibility: 'visible'});



*/

    }

/*

    function onPushState(event){

      _direction = 'forward';

      console.log(event)

       if(event.detail.url){
            _routes.push(event.detail.url);
            _currentLevel = _routes.length - 1;
            route();

       }

       console.log('pushstate fired!');
       event.preventDefault();

    }

    function onPopState(event){

        _direction = 'backward';

       if(event && event.detail.url ){

           _routes.pop();
           _currentLevel = _routes.length - 1;
           route();
       }else{

           _currentRoute = null;

           var evt = document.createEvent("Event");
           evt.initEvent("resetView", true, true);
           this.dispatchEvent(evt);
       }

       console.log('popstate fired!');
       event.preventDefault();

    }

*/


    
    function resetToTab( url ) {
        // TODO define another method to properly display view change effect (eg a fade)
        // reset to tab, we are on the current tab, level 1. on level 0 its the home necessarily, except in case
        // when we click on the home
        if ( !/home/.test( url ) ) {
          _routes[ 1 ] = url;
          _direction = 'forward';
          _currentLevel = 1;

          var controller = routes[ url ][ 0 ],
            action = routes[ url ][ 1 ],
            params = null;

            console.log( 'load ctl: ' + controller + '& action: ' + action  )

          require(['controllers/' + controller], function(ctrl){
              ctrl.load( action, params, onViewLoaded );
          });
        } else {


          // we click on home tab, home is already @ the root of the history, just update current level
          _direction = 'forward';
          _currentLevel = 0;
          animate();
        }

    }

    function onViewLoaded( view ) {
      document.querySelector('#level-' + _currentLevel ).innerHTML = view;

      // dont animate if home

      if ( _direction === 'forward' ) {
        console.log('animate forward NOT home');
        animate();
      }
    }




    // get a state in param
    function route(){



    if ( _direction !==  'backward' ) {
        var currentUrl = _routes[ _routes.length - 1 ],
          currentRoute,
          params = {};


          // "/home"
        var chunk1 = /^\/([^\/\d]+)$/.exec( currentUrl ),
          // "/club/123/info"
          chunk2 = /^\/([^\/\d]+)\/([^\/\D]+)\/([^\/\d]+)$/.exec( currentUrl ),
          // "/activities/type/238"
          chunk3 = /^\/([^\/\d]+)\/([^\/\d]+)\/([^\/\D]+)$/.exec( currentUrl ),
          // "/activity/3455/planning/2"
          chunk4 = /^\/([^\/\d]+)\/([^\/\D]+)\/([^\/\d]+)\/([^\/\D]+)$/.exec( currentUrl );


        if ( chunk1 ) {
          currentRoute = '/' + chunk1[ 1 ];
        } else if ( chunk2 ) {
          params.id = chunk2[ 2 ];
          chunk2[ 2 ] = ':id';
          currentRoute = '/' + chunk2.slice( 1 ).join('/');
        } else if ( chunk3 ) {
          params.id = chunk3[ 3 ];
          chunk3[ 3 ] = ':id';
          currentRoute = '/' + chunk3.slice( 1 ).join('/');
        } else {
          params.id = chunk4[ 2 ];
          chunk4[ 2 ] = ':id';
          params.page = chunk4[ 4 ];
          chunk4[ 4 ] = ':page';
          currentRoute = '/' + chunk4.slice( 1 ).join('/');
        }


        var controller = routes[ currentRoute ][ 0 ],
          action = routes[ currentRoute ][ 1 ];

          console.log( 'load ctl: ' + controller + '& action: ' + action + 'params' + params )

        require(['controllers/' + controller], function(ctrl){
            ctrl.load( action, params, onViewLoaded );
        });
      } else {
        animate();
      }

    }

  

    return {

        dispose: dispose,
        init: init,
        route: route,
        _routes: _routes

    }

}));