var currentDateDiv = $(".current-date");
var mainLocationEl = $(".main-location");
var mainConditionEl = $(".main-condition");
var mainTempSpan = $("#main-temp");
var mainHumidityTd = $("#main-humidity-td");
var mainWindTd = $("#main-wind-td");
var mainUvSpan = $("#main-uv-span");
var forecastDaySpan = $(".forecast-day");
var forecastConditionSpan = $(".forecast-condition");
var forecastTempDiv = $(".forecast-temp");
var searchButton = $(".btn");

var apiKey = "5522e24e3f2cbcf4ca631dd68ebac697";
var searchHistory = localStorage.getItem("weather-search-history") // gets localStorage item if it exists
  ? JSON.parse(localStorage.getItem("weather-search-history"))
  : [];

var cityName = // gets last searched city if searchHistory is not empty, used to reload last search
  searchHistory.length > 0
    ? searchHistory[searchHistory.length - 1]
    : "new+york";

function getCoordinatesFromCityNameThenCallApi(city) {
  /* 
	since people don't know the coordinates for cities off the top of their head
	and the api only takes coordinates as location input, we have to convert 
	a city name to a lat and lon value using another provided api

	the data validation helps filter out erroneous input, anything that isn't the name of a city
	*/
  var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data[0]) {
        // data validation
        var cityLat = data[0].lat;
        var cityLon = data[0].lon;
        callFromOneCallApi(cityLat, cityLon, city);
      }
    });
}

function callFromOneCallApi(cityLat, cityLon, city) {
  /* 
	takes coordinates given by the location conversion API to get current and
	forecasted weather data

	passes the search term as the city to populate .mainLocationEl

	if the data validates then the search is added to history
	*/
  var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=imperial`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data) {
        populateCurrentWeatherData(data, city);
        populateForecastWeatherData(data.daily);
        addSearchToHistory(city);
      }
    });
}

function populateCurrentWeatherData(weatherData, city) {
  currentDateDiv.text(moment().format("LL"));
  mainLocationEl.text(city.split("+").join(" "));
  mainConditionEl.empty();
  mainConditionEl.append(
    chooseWeatherConditionIcon(weatherData.current.weather[0].icon, "main")
  );
  mainTempSpan.text(Math.round(weatherData.current.temp));
  mainHumidityTd.text(weatherData.current.humidity + "%");
  mainWindTd.text(Math.round(weatherData.current.wind_speed) + " mph");
  mainUvSpan
    .text(weatherData.current.uvi)
    .css("background", chooseUvIndexColor(weatherData.current.uvi));
}

function populateForecastWeatherData(forecastArr) {
  /* 
	using i + 1 as the index because the array returned contains 
	the forecast for the current day
	*/
  for (var i = 0; i < 5; i++) {
    var maxTemp = Math.round(forecastArr[i + 1].temp.max);
    var minTemp = Math.round(forecastArr[i + 1].temp.min);
    var humidity = forecastArr[i + 1].humidity;
    var wind = forecastArr[i + 1].wind_speed;
    $(".forecast-condition").eq(i).empty();
    var condition = chooseWeatherConditionIcon(
      forecastArr[i + 1].weather[0].icon,
      "forecast"
    );
    var date = moment.unix(forecastArr[i + 1].dt).format("dddd, MMMM Do");
    $(".forecast-condition").eq(i).append(condition);
    $(".forecast-high-temp").eq(i).text(maxTemp);
    $(".forecast-low-temp").eq(i).text(minTemp);
    $(".forecast-humidity-span").eq(i).text(humidity);
    $(".forecast-wind-span").eq(i).text(wind);
    $(".forecast-day").eq(i).text(date);
  }
}

function handleSearch(event) {
  /* 
	takes the search term from input field and passes it into the API call function
	after formatting it so that it can be passed into a url, clears the search field
	after to signify that the search was submitted
	*/
  event.preventDefault();
  const city = $(event.target).prev().val().split(" ").join("+");
  getCoordinatesFromCityNameThenCallApi(city);
  $(event.target).prev().val("");
}

function addSearchToHistory(city) {
  /* 
	only pushes the city into searchHistory if it doesn't exist, so we can filter out
	duplicate searches being pushed into the history
	*/
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
  }
  localStorage.setItem("weather-search-history", JSON.stringify(searchHistory));
  populateHistoryDropdown();
}

function populateHistoryDropdown() {
  /* 
	creates a new element that invokes the api call function when clicked and 
	passes in the corresponding city of the history list element.

	populates history dropdown menu li with a human-friendly string for city name
	*/
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
  /* 
	passes the condition icon code into the src which corresponds with the correct 
	icon in the assets folder

	returns the img element that can be appended to the conditionEl
	*/
  var imgEl = $(
    `<img class="${area}-condition-icon" src="./assets/images/${condition}.png" alt="weather condition graphic">`
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

// initialize 
$(".btn").click(handleSearch);

// initialize the page with the default or last searched city so that there are 
// no empty fields
getCoordinatesFromCityNameThenCallApi(cityName);
