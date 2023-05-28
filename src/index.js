function formatDate(timestamp, timezone) {
  const date = new Date(timestamp * 1000);
  const timezoneOffset = timezone / 60;
  date.setMinutes(date.getMinutes() + timezoneOffset);

  const options = {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
  };

  const formattedDate = date.toLocaleString("en-GB", options);
  return formattedDate;
}

function searchCity(event) {
  let cityName = document.querySelector("#search-city");
  event.preventDefault();
  showCity(cityName.value.trim());
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheiTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheiTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function showCity(cityName) {
  let apiKey = `de04c4af2d4eee11197de9665865f645`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

function showTemperature(response) {
  forecastweather(response.data.coord.lat, response.data.coord.lon);
  let temperatureElement = document.querySelector("#temperature");
  let windSpeedElement = document.querySelector("#windspeed");
  let humidityElement = document.querySelector("#humidity");
  let descriptionElement = document.querySelector("#description");
  let todayDateElement = document.querySelector("#date");
  let cityElement = document.querySelector("#city-name");
  let iconElement = document.querySelector("#icon");
  celsiusTemperature = Math.round(response.data.main.temp);
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed * 0.514);
  humidityElement.innerHTML = Math.round(response.data.main.humidity);
  descriptionElement.innerHTML = response.data.weather[0].description;
  todayDateElement.innerHTML = formatDate(
    response.data.dt,
    response.data.timezone
  );
  cityElement.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  iconElement.setAttribute(
    "src",
    `/images/${response.data.weather[0].icon}.svg`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

async function loadCountryCodes() {
  let countryCodeUrl = `https://gist.githubusercontent.com/ssskip/5a94bfcd2835bf1dea52/raw/3b2e5355eb49336f0c6bc0060c05d927c2d1e004/ISO3166-1.alpha2.json`;
  try {
    const response = await fetch(countryCodeUrl);
    return await response.json();
  } catch (error) {
    console.log("Error loading country codes:", error);
    throw error;
  }
}

function displayforecast(response) {
  let displayforecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  let forecast = response.data.daily;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let currentDate = new Date();
      currentDate.setDate(
        currentDate.getDate() + forecast.indexOf(forecastDay) + 1
      );
      let nextDate = days[currentDate.getDay()];
      const iconMappings = {
        "clear-sky-day": "01d",
        "few-clouds-day": "02d",
        "scattered-clouds-day": "03d",
        "broken-clouds-day": "04d",
        "shower-rain-day": "09d",
        "rain-day": "10d",
        "thunderstorm-day": "11d",
        "snow-day": "13d",
        "mist-day": "50d",
      };

      let icon = forecastDay.condition.icon;
      if (iconMappings.hasOwnProperty(icon)) {
        icon = iconMappings[icon];
      }

      forecastHTML =
        forecastHTML +
        `<div class="col">
        <div class="weather-daily-forecast-date">${nextDate}</div>
            <img src="${`/images/${icon}.svg`}" alt=" " width="45" />
                <div class="weather-daily-forecast-temperature">
                  <span class="temp-max"><img
                    class="small-icon"
                    src="/images/thermometer-warmer.svg"
                    width="36"
                />${Math.round(forecastDay.temperature.maximum)}°</span> 
                  <span class="temp-min"><img
                    class="small-icon"
                    src="/images/thermometer-colder.svg"
                    width="36"
                />${Math.round(forecastDay.temperature.minimum)}°</span>
                </div>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  displayforecastElement.innerHTML = forecastHTML;
}

function currentLocation() {
  navigator.geolocation.getCurrentPosition(handleLocation);
}

function handleLocation(location) {
  let lat = location.coords.latitude;
  let lon = location.coords.longitude;
  userLocation(lat, lon);
  forecastweather(lat, lon);
}

function userLocation(lat, lon) {
  let apiKey = `de04c4af2d4eee11197de9665865f645`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(showTemperature);
}

function forecastweather(lat, lon) {
  let sheCodeAPIKey = `3td6e14f0d9a0b3a55fb9a3b44ao245f`;
  let sheCodeAPIUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${sheCodeAPIKey}&units=metric`;
  axios.get(`${sheCodeAPIUrl}`).then(displayforecast);
}

const currentHour = new Date().getHours();

const isNight = currentHour >= 20 || currentHour < 6;
const weatherApp = document.querySelector("#weather-app");
const inputElement = document.querySelector(".cu-sf");
const buttonElement = document.querySelector("#search-button");
if (isNight) {
  weatherApp.classList.add("night");
  weatherApp.classList.remove("day");
  inputElement.classList.add("txt-night");
  buttonElement.classList.remove("dark");
} else {
  weatherApp.classList.add("day");
  weatherApp.classList.remove("night");
  inputElement.classList.remove("txt-night");
  buttonElement.classList.add("dark");
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", searchCity);

currentLocation();
