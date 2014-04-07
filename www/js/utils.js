;define('utils', (function(){

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

    function url( segment ) {
      return 'http://www-tmp.cmgsportsclub.com/api/get/' + segment;
    }

    // jsonp settings
    var jsonSettings = {
      dataType: 'jsonp',
      contentType: "application/json",
      jsonpCallback: 'jsonp'
    };


    return {
        'onCurrentPosition': onCurrentPosition,
        'distance': distance,
        'json': jsonSettings,
        'url': url
    };

}));