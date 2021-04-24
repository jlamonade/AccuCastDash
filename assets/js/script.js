var mainLocationEl = $(".main-location");
var mainConditionEl = $(".main-condition");
var mainTempSpan = $("#main-temp");
var mainHighTempSpan = $("#main-high-temp");
var mainLowTempSpan = $("#main-low-temp");

var cityName = "new+york"
var apiKey = "5522e24e3f2cbcf4ca631dd68ebac697"

function populateCurrentWeatherData(weatherData) {
  mainLocationEl.text(weatherData.name);
  mainConditionEl.text(weatherData.weather[0].description);
  mainTempSpan.text(Math.round(weatherData.main.temp));
  mainHighTempSpan.text(Math.round(weatherData.main.temp_max));
  mainLowTempSpan.text(Math.round(weatherData.main.temp_min));
}

function getCurrentWeatherData() {
  var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      populateCurrentWeatherData(data);
    });
}

function getForecastWeatherData() {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`
    
    fetch(requestUrl)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        // console.log(data)
        for (var i = 3; i < data.list.length; i += 7) {
            console.log(data.list[i])
        }
    })
}
getForecastWeatherData();
// getCurrentWeatherData();
