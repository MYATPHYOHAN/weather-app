function currentDate(curretTime) {
  let dates = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = dates[curretTime.getDay()];
  let hour = curretTime.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = curretTime.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  return `${date} ${hour}:${minute}`;
}

let todayDate = document.querySelector("h3");
let curretTime = new Date();
todayDate.innerHTML = currentDate(curretTime);

let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", searchCity);

function searchCity(event) {
  let cityName = document.querySelector("#search-city");
  let changeCityName = document.querySelector("#city-name");
  event.preventDefault();
  let inputCityName = cityName.value;
  let fixCityName = inputCityName;
  changeCityName.innerHTML = `${fixCityName}`;
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
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${temperature}`;
  let windSpeed = Math.round(response.data.wind.speed);
  let windSpeedElement = document.querySelector("#windspeed");
  windSpeedElement.innerHTML = `${windSpeed}`;
  let humidity = Math.round(response.data.main.humidity);
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${humidity}`;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = `${response.data.weather[0].description}`;
}

let currentPosition = document.querySelector("#current-button");
currentPosition.addEventListener("click", currentLocation);

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
