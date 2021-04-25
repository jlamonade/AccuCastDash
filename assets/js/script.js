var mainLocationEl = $(".main-location");
var mainConditionEl = $(".main-condition");
var mainTempSpan = $("#main-temp");
var mainHighTempSpan = $("#main-high-temp");
var mainLowTempSpan = $("#main-low-temp");
var mainHumidityTd = $("#main-humidity-td");
var mainWindTd = $("#main-wind-td");
var mainUvTd = $("#main-uv-td");
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

function getCoordinatesFromCityNameThenCallApi(city) {
  var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data[0]) {
        var cityLat = data[0].lat;
        var cityLon = data[0].lon;
        callFromOneCallApi(cityLat, cityLon, city);
      }
    });
}

function callFromOneCallApi(cityLat, cityLon, city) {
  var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=imperial`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data) {
        populateCurrentWeatherData(data, city);
        populateForecastWeatherData(data.daily);
        addSearchToHistory();
      }
    });
}

function populateCurrentWeatherData(weatherData, city) {
  mainLocationEl.text(city.split("+").join(" "));
  mainConditionEl.empty();
  mainConditionEl.append(
    chooseWeatherConditionIcon(weatherData.current.weather[0].icon, "main")
  );
  mainTempSpan.text(Math.round(weatherData.current.temp));
  mainHumidityTd.text(weatherData.current.humidity + "%");
  mainWindTd.text(Math.round(weatherData.current.wind_speed) + " mph");
  mainUvTd.text(weatherData.current.uvi).css("background", chooseUvIndexColor(weatherData.current.uvi));
}

function populateForecastWeatherData(forecastArr) {
  for (var i = 0; i < 5; i++) {
    var maxTemp = Math.round(forecastArr[i + 1].temp.max);
    var minTemp = Math.round(forecastArr[i + 1].temp.min);
    $(".forecast-condition").eq(i).empty();
    var condition = chooseWeatherConditionIcon(
      forecastArr[i + 1].weather[0].icon,
      "forecast"
    );
    var date = moment.unix(forecastArr[i + 1].dt).format("dddd");
    console.log(date);
    $(".forecast-condition").eq(i).append(condition);
    $(".forecast-temp").eq(i).text(maxTemp);
    $(".forecast-day").eq(i).text(date);
  }
}

function handleSearch(event) {
  event.preventDefault();
  const city = $(event.target).prev().val().split(" ").join("+");
  getCoordinatesFromCityNameThenCallApi(city);
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
        getCoordinatesFromCityNameThenCallApi(item);
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

function chooseUvIndexColor(uvi) {
  if (uvi < 3) {
    return "green";
  } else if (uvi >= 3) {
    return "yellow";
  } else if (uvi >= 6) {
    return "orange";
  } else if (uvi >= 8) {
    return "red";
  } else if (uvi >= 11) {
    return "purple";
  }
}

// function chooseBackgroundColor() {}

$(".btn").click(handleSearch);

// populateHistoryDropdown();
// getForecastWeatherData(cityName);
// getCurrentWeatherData(cityName);

getCoordinatesFromCityNameThenCallApi("new york");
// callFromOneCallApi("chicago");
