var app = angular.module('App', ['ngRoute']);

if(window.location.origin == "http://localhost:8000") {
  URL = 'http://localhost:8000';
} else {
  URL = "https://globanthw.herokuapp.com";
}

/***** CONTROLLERS *****/

app.controller('homeController', ['$http', '$location', function($http, $location) {

  var location = null;

  this.weather = null;

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setLocation, showError);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function setLocation(position) {
    location = position;
  }

  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred."
        break;
    }
  }

  this.getWeather = function() {
    console.log('Get Weather');
    $http({
      method: 'GET',
      url: URL + "/weather?lat=" + location.coords.latitude + "&lon=" + location.coords.longitude
      // url: darkskyURL + location.coords.latitude + "," + location.coords.longitude
    }).then(function(response) {
      if (response.status == 200) {
        console.log(response.data);
        this.weather = response.data;
      } else {
        console.log("Failed");
      }
    }.bind(this));
  }

  getLocation();
}]);

app.controller('mainController', ['$http', '$location', '$rootScope', function($http, $location, $rootScope) {

  $rootScope.$on("$routeChangeSuccess", function(args){
    var $navs = $('#nav-links').find($('li'));
    for (var i=0; i < $navs.length; i++) {
      var $li = $($navs[i]);
      var $a = $($li.find('a')[0]);
      $li.show();
      if ($location.path() == '/') {
        $li.hide();
      } else if ($a.attr('href') == $location.path()) {
        $li.addClass('active');
      } else {
        $li.removeClass('active');
      }
    }
  });

}]);

/***** ROUTES *****/

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) { //.config just runs once on load
  $locationProvider.html5Mode({ enabled: true }); // tell angular to use push state
  $routeProvider
  .when("/", {
    templateUrl : "partials/home.htm"
  })
  .when("/home", {
    templateUrl : "partials/home.htm"
  })
  .otherwise({
    redirectTo : "/"
  }) ;
}]);
