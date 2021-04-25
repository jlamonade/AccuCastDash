var mainLocationEl = $(".main-location");
var mainConditionEl = $(".main-condition");
var mainTempSpan = $("#main-temp");
var mainHighTempSpan = $("#main-high-temp");
var mainLowTempSpan = $("#main-low-temp");
var forecastDaySpan = $(".forecast-day");
var forecastConditionSpan = $(".forecast-condition");
var forecastTempDiv = $(".forecast-temp");
var searchButton = $(".btn");

var apiKey = "5522e24e3f2cbcf4ca631dd68ebac697";
var searchHistory = localStorage.getItem("weather-search-history") // gets localStorage item if it exists
  ? JSON.parse(localStorage.getItem("weather-search-history"))
  : [];

var cityName = // gets last searched city if searchHistory is not empty
  searchHistory.length > 0
    ? searchHistory[searchHistory.length - 1]
    : "new+york";

function populateCurrentWeatherData(weatherData) {
  mainLocationEl.text(weatherData.name);
  mainConditionEl.empty();
  mainConditionEl.append(
    chooseWeatherConditionIcon(weatherData.weather[0].icon, "main")
  );
  mainTempSpan.text(Math.round(weatherData.main.temp));
  mainHighTempSpan.text(Math.round(weatherData.main.temp_max));
  mainLowTempSpan.text(Math.round(weatherData.main.temp_min));
  console.log(weatherData.weather[0].main);
}

function populateForecastWeatherData(forecastArr) {
  for (var i = 0; i < forecastArr.length; i++) {
    var temp = Math.round(forecastArr[i].main.temp);
    $(".forecast-condition").eq(i).empty();
    var condition = chooseWeatherConditionIcon(
      forecastArr[i].weather[0].icon,
      "forecast"
    );
    var date = dateFns.parse(forecastArr[i].dt_txt, "yyyy-MM-dd HH:mm:ss");
    var day = dateFns.format(date, "dddd");
    $(".forecast-condition").eq(i).append(condition);
    $(".forecast-temp").eq(i).text(temp);
    $(".forecast-day").eq(i).text(day);
  }
}

function getCurrentWeatherData(city) {
  var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.cod === 200) {
        // do this only if the searched city returns valid data
        populateCurrentWeatherData(data);
        addSearchToHistory(); // so that it doesn't pollute localStorage with bad searches
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
      console.log(data);
      if (data.cod === "200") {
        var forecastArr = [];
        for (var i = 7; i < data.list.length; i += 8) {
          forecastArr.push(data.list[i]);
        }
        populateForecastWeatherData(forecastArr);
      }
    });
}

function handleSearch(event) {
  event.preventDefault();
  const city = $(event.target).prev().val().split(" ").join("+");
  getForecastWeatherData(city);
  getCurrentWeatherData(city);
  $(event.target).prev().val("");
  cityName = city;
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
  for (const item of searchHistory) {
    var newLiEl = $("<li class='dropdown-item'>")
      .text(item.split("+").join(" "))
      .click(function () {
        getCurrentWeatherData(item);
        getForecastWeatherData(item);
      });
    $(".dropdown-menu").append(newLiEl);
  }
}

function chooseWeatherConditionIcon(condition, area) {
  var imgEl = $(
    `<img class="${area}-condition-icon" src="./assets/images/${condition}.png">`
  );
  return imgEl;
}

function chooseBackgroundColor() {}

$(".btn").click(handleSearch);

populateHistoryDropdown();
getForecastWeatherData(cityName);
getCurrentWeatherData(cityName);
