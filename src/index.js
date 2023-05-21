function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);

  let options = {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timezon: "",
  };

  let formattedDate = date.toLocaleString("en-US", options);

  return formattedDate;
}

let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", searchCity);

function searchCity(event) {
  let cityName = document.querySelector("#search-city");
  event.preventDefault();
  showCity(cityName.value);
  console.log(cityName.value);
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
  let apiKey = `3td6e14f0d9a0b3a55fb9a3b44ao245f`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${cityName}&key=${apiKey}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

function showTemperature(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#temperature");
  let windSpeedElement = document.querySelector("#windspeed");
  let humidityElement = document.querySelector("#humidity");
  let descriptionElement = document.querySelector("#description");
  let todayDateElement = document.querySelector("#date");
  let cityElement = document.querySelector("#city-name");
  let iconElement = document.querySelector("#icon");
  celsiusTemperature = Math.round(response.data.temperature.current);
  temperatureElement.innerHTML = Math.round(response.data.temperature.current);
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed * 0.514);
  humidityElement.innerHTML = Math.round(response.data.temperature.humidity);
  descriptionElement.innerHTML = response.data.condition.description;
  todayDateElement.innerHTML = formatDate(response.data.time);
  cityElement.innerHTML = `${response.data.city}`;
  iconElement.setAttribute("src", response.data.condition.icon_url);
  iconElement.setAttribute("alt", response.data.condition.icon);
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

function currentLocation() {
  navigator.geolocation.getCurrentPosition(handleLocation);
}

function handleLocation(location) {
  console.log(location);
  let lat = location.coords.latitude;
  let lon = location.coords.longitude;
  userLocation(lat, lon);
}

function userLocation(lat, lon) {
  let apiKey = `3td6e14f0d9a0b3a55fb9a3b44ao245f`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(showTemperature);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

currentLocation();
