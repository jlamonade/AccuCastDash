var mainLocationEl = $(".main-location");
var mainConditionEl = $(".main-condition");
var mainTempSpan = $("#main-temp");
var mainHighTempSpan = $("#main-high-temp");
var mainLowTempSpan = $("#main-low-temp");
var forecastDaySpan = $("#forecast-day")
var forecastConditionSpan = $("#forecast-condition")
var forecastHighTempSpan = $("forecast-high")
var forecastLowTempSpan = $("forecast.low")
var forecastDiv = $(".forecast")

var cityName = "new+york"
var apiKey = "5522e24e3f2cbcf4ca631dd68ebac697"

function populateCurrentWeatherData(weatherData) {
  mainLocationEl.text(weatherData.name);
  mainConditionEl.text(weatherData.weather[0].description);
  mainTempSpan.text(Math.round(weatherData.main.temp));
  mainHighTempSpan.text(Math.round(weatherData.main.temp_max));
  mainLowTempSpan.text(Math.round(weatherData.main.temp_min));
  
}

function populateForecastWeatherData(forecastArr) {
    for (var i = 0; i < forecastArr.length; i++) {
        var highTemp = Math.round(forecastArr[i].main.temp_max)
        var lowTemp = Math.round(forecastArr[i].main.temp_min)
        var condition = forecastArr[i].weather[0].description
        var date = dateFns.parse(forecastArr[i].dt_txt, "yyyy-MM-dd HH:mm:ss")
        var day = dateFns.format(date, "dddd")
        $(".day").eq(i).children("#forecast-condition").text(condition)
        $(".day").eq(i).children(".forecast-high-low").children("#forecast-high").text(highTemp)
        $(".day").eq(i).children(".forecast-high-low").children("#forecast-low").text(lowTemp)
        $(".day").eq(i).children("#forecast-day").text(day)        
    }
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
        var forecastArr = []
        for (var i = 3; i < data.list.length; i += 7) {
            forecastArr.push(data.list[i])
        }
        populateForecastWeatherData(forecastArr);
    })
}
getForecastWeatherData();
getCurrentWeatherData();
