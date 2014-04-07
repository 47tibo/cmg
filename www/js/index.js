/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
define('index', [
        'alice',
        'mustache',
        'route',
        'snapsvg',
        'svgicons',
        'svgiconsconfig'], (function( a, mustache, route){

    var init = function() {

        // TODO clean this
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {

            document.addEventListener("deviceready", onDeviceReady, false);

        } else {

            onDeviceReady(); // Running is the browser

        }

    };

    var onDeviceReady = function() {

        console.log('Received Event: onDeviceReady');



        route.init();

        // off canvas events
        var menuButton = document.querySelector('#menu'),
            appNav = document.querySelector('#app-nav'),
            appContent = document.querySelector('#app-content');
        menuButton.addEventListener( 'click', function clickMenuButton() {
            appNav.classList.toggle( 'off' );
            appContent.classList.toggle( 'off' );
        });

        // Build the main app view
      //  loadTemplates();
/*

        // load home page
        var event;

        try{

            event = new CustomEvent('pushstate', 
            {
                detail: {url: '/home'},
                bubbles: true,
                cancelable: true
            });

        }catch (error){

           // console.log('Custom events not supported', error);

            event = document.createEvent("Event");
            event.initEvent("pushstate", true, true);

            event.url = '/home';

        }

   // console.log('push state event dispatched: home : '  );
  //  console.log( event );


        this.dispatchEvent(event);

*/

   route._routes.push('/home');
    route.route();
        

     //   window.history.pushState({},'', '/home');

    };

        var buildNav = function(tpl){

        // Inject the template in the view
        var html = mustache.to_html(tpl);
        document.querySelector('#app-nav').innerHTML = html;

    };

            var buildTmp = function(tpl){

        // Inject the template in the view
        var html = mustache.to_html(tpl);
        document.querySelector('#level-0').innerHTML = html;

    };

    var loadTemplates = function () {

        require([
            //'text!../tpl/news.tpl.html'
            //'text!../tpl/news_list.tpl.html'
            //'text!../tpl/subscriptions.tpl.html'
            // 'text!../tpl/search_all.tpl.html'
            //'text!../tpl/search_club_schedule.tpl.html'
            //'text!../tpl/search_club_activity.tpl.html'
            //'text!../tpl/search_activity_schedule.tpl.html'
            //'text!../tpl/search_activity.tpl.html'
            //'text!../tpl/activity.tpl.html'
           //'text!../tpl/club.tpl.html'
        //'text!../tpl/search_club.tpl.html'
        //'text!../tpl/home.tpl.html'
        ], buildTmp);


    };


    return {

        init: init

    };
}));
