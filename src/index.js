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
  console.log(formattedDate);
  return formattedDate;
}

function searchCity(event) {
  let cityName = document.querySelector("#search-city");
  event.preventDefault();
  showCity(cityName.value.trim());
  console.log(cityName.value.trim());
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
  console.log(response.data);
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
    `/images/${response.data.weather[0].icon}.png`
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
  let apiKey = `de04c4af2d4eee11197de9665865f645`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(showTemperature);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", searchCity);

currentLocation();
