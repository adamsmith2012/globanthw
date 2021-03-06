var app = angular.module('App', ['ngRoute']);

if(window.location.origin == "http://localhost:8000") {
  URL = 'http://localhost:8000';
} else {
  URL = "https://globanthw.herokuapp.com";
}

/***** CONTROLLERS *****/

app.controller('homeController', ['$http', function($http) {

  this.weather = null;
  this.city = "";
  this.region = "";

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
      url: URL + "/weather?loc=" + location
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

  // https://github.com/darkskyapp/skycons
  this.setSkycon = function() {
    var skycons = new Skycons();
    skycons.add(document.getElementById("skycon"), this.weather.currently.icon);
    skycons.play();
  }

  /*** Helper Functions ***/

  function getLocation() {
    $http({
      method: 'GET',
      url: "https://ipinfo.io"
    }).then(function(response) {
      if (response.status == 200) {
        setLocation(response.data);
      } else {
        console.log("Failed");
      }
    }.bind(this));
  }

  function setLocation(data) {
    location = data.loc;
    controller.city = data.city;
    controller.region = data.region;
    controller.getWeather();
  }

  // Will set a start a series of call to getLocation() -> setLocation() -> this.getWeather()
  getLocation();
}]);

/***** ROUTES *****/

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true });
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
