var mainLocationEl = $(".main-location");
var mainConditionEl = $(".main-condition");
var mainTemperatureEl = $(".main-temperature");
var mainHighTempSpan = $("#main-high-temp");
var mainLowTempSpan = $("#main-low-temp");

function getCurrentWeatherData() {
  var apiKey = "5522e24e3f2cbcf4ca631dd68ebac697";
  var cityName = "new+york";
  var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var weatherData = data;
    });
}

getCurrentWeatherData();
