var mainLocationEl = $(".main-location");
var mainConditionEl = $(".main-condition");
var mainTempSpan = $("#main-temp");
var mainHighTempSpan = $("#main-high-temp");
var mainLowTempSpan = $("#main-low-temp");
var forecastDaySpan = $("#forecast-day");
var forecastConditionSpan = $("#forecast-condition");
var forecastTempDiv = $(".forecast-temp");
var searchButton = $(".btn");

var cityName = "new+york";
var apiKey = "5522e24e3f2cbcf4ca631dd68ebac697";
var searchHistory = localStorage.getItem("weather-search-history")
  ? JSON.parse(localStorage.getItem("weather-search-history"))
  : [];

function populateCurrentWeatherData(weatherData) {
  mainLocationEl.text(weatherData.name);
  mainConditionEl.text(weatherData.weather[0].description);
  mainTempSpan.text(Math.round(weatherData.main.temp));
  mainHighTempSpan.text(Math.round(weatherData.main.temp_max));
  mainLowTempSpan.text(Math.round(weatherData.main.temp_min));
}

function populateForecastWeatherData(forecastArr) {
  for (var i = 0; i < forecastArr.length; i++) {
    var temp = Math.round(forecastArr[i].main.temp);
    var condition = forecastArr[i].weather[0].description;
    var date = dateFns.parse(forecastArr[i].dt_txt, "yyyy-MM-dd HH:mm:ss");
    var day = dateFns.format(date, "dddd");
    $(".day").eq(i).children("#forecast-condition").text(condition);
    $(".day").eq(i).children(".forecast-temp").text(temp);
    $(".day").eq(i).children("#forecast-day").text(day);
  }
}

function getCurrentWeatherData() {
  var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        if (data) {
            populateCurrentWeatherData(data);
            addSearchToHistory();
        }
      
    });
}

function getForecastWeatherData() {
  var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var forecastArr = [];
      for (var i = 3; i < data.list.length; i += 7) {
        forecastArr.push(data.list[i]);
      }
      populateForecastWeatherData(forecastArr);
    });
}

function handleSearch(event) {
  event.preventDefault();
  cityName = $(event.target).prev().val().split(" ").join("+");
  getForecastWeatherData();
  getCurrentWeatherData();
  $(event.target).prev().val("")
}

function addSearchToHistory() {
  if (!searchHistory.includes(cityName)) {
    searchHistory.push(cityName);
    cityName = null;
  }
  localStorage.setItem("weather-search-history", JSON.stringify(searchHistory));
}

$(".btn").click(handleSearch);

// getForecastWeatherData();
// getCurrentWeatherData();
