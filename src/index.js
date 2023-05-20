function formatDate(timestamp, timezone) {
  let date = new Date(timestamp * 1000);
  let timezoneOffsetMinutes = timezone / 60;

  date.setMinutes(date.getMinutes() + timezoneOffsetMinutes);

  let options = {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC",
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

let cel = document.querySelector("#celsius");
cel.addEventListener("click", changeToCelsius);

function changeToCelsius(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temperature");
  let temperatureInFahrenheit = parseInt(tempElement.innerHTML);
  let temperatureInCelsius = ((temperatureInFahrenheit - 32) * 5) / 9;
  tempElement.innerHTML = `${Math.round(temperatureInCelsius)}`;
}

let fahr = document.querySelector("#fahrenheit");
fahr.addEventListener("click", changeToFahrenheit);

function changeToFahrenheit(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temperature");
  let temperatureInCelsius = parseInt(tempElement.innerHTML);
  let temperatureInFahrenheit = (temperatureInCelsius * 9) / 5 + 32;
  tempElement.innerHTML = `${Math.round(temperatureInFahrenheit)}`;
}

function showCity(cityName) {
  let apiKey = `de04c4af2d4eee11197de9665865f645`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric`;
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

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed / 3.6);
  humidityElement.innerHTML = Math.round(response.data.main.humidity);
  descriptionElement.innerHTML = response.data.weather[0].description;
  todayDateElement.innerHTML = formatDate(
    response.data.dt,
    response.data.timezone
  );

  loadCountryCodes()
    .then((countryCodes) => {
      const countryName = countryCodes[response.data.sys.country] || "Unknown";
      cityElement.innerHTML = `${response.data.name}, ${countryName}`;
    })
    .catch((error) => {
      console.log("Error loading country codes:", error);
      cityElement.innerHTML = `${response.data.name}, Unknown`;
    });
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
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(showTemperature);
}

currentLocation();
