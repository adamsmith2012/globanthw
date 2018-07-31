var app = angular.module('App', ['ngRoute']);

if(window.location.origin == "http://localhost:8000") {
  URL = 'http://localhost:8000';
} else {
  URL = "https://globanthw.herokuapp.com";
}

/***** CONTROLLERS *****/

app.controller('homeController', ['$http', function($http) {

  this.weather = null;

  var controller = this;
  var location = null;
  var date = new Date();
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  /*** Methods ***/

  // Makes a call to server that retrieves weather data
  // returns weather data in object this.Weather
  // api found on darksky.net
  this.getWeather = function() {
    $http({
      method: 'GET',
      url: URL + "/weather?lat=" + location.coords.latitude + "&lon=" + location.coords.longitude
    }).then(function(response) {
      if (response.status == 200) {
        this.weather = response.data;
      } else {
        console.log("Failed");
      }
    }.bind(this));
  }

  // Returns day of the week specified by index i;
  // params: i - number of days away from current day. eg. i=1 is tomorrow
  this.getDayOfWeek = function(i) {
    if(i == 0) return "Today";
    var dayOfWeek = weekday[(date.getDay() + i) % 7];
    return dayOfWeek;
  }

  this.setSkycon = function() {
    var skycons = new Skycons();
    skycons.add(document.getElementById("skycon"), this.weather.currently.icon);
    skycons.play();
  }

  /*** Helper Functions ***/

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setLocation, showError);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function setLocation(position) {
    location = position;
    controller.getWeather();
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

  // Will set a start a series of call to getLocation() -> setLocation() -> this.getWeather()
  getLocation();
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
