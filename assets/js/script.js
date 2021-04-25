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

function getCurrentWeatherData(city) {
  var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

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

function getForecastWeatherData(cityName) {
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
  const city = $(event.target).prev().val().split(" ").join("+");
  cityName = city;
  getForecastWeatherData(city);
  getCurrentWeatherData(city);
  $(event.target).prev().val("");
}

function addSearchToHistory() {
  if (!searchHistory.includes(cityName)) {
    searchHistory.push(cityName);
    cityName = null;
  }
  localStorage.setItem("weather-search-history", JSON.stringify(searchHistory));
  populateHistoryDropdown();
}

function populateHistoryDropdown() {
  $(".dropdown-menu").empty();
  // CREATE
  for (const item of searchHistory) {
    // BUILD
    var newLiEl = $("<li class='dropdown-item'>")
      .text(item.split("+").join(" "))
      .click(function () {
        getCurrentWeatherData(item)
        getForecastWeatherData(item)
      })
      console.log(newLiEl)
      $(".dropdown-menu").append(newLiEl);
  }
}

$(".btn").click(handleSearch);

populateHistoryDropdown();
// getForecastWeatherData();
// getCurrentWeatherData();
