const API_KEY = "6fdfa0abcd920b78667524d5a185678b";
const recentSearchesKey = "recentSearches";

async function fetchWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city name.");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    if (data.cod !== 200) throw new Error(data.message);

    displayWeather(data);
    fetchForecast(city);
    saveToRecentSearches(city);
  } catch (error) {
    alert("Error fetching weather data: " + error.message);
  }
}

function displayWeather(data) {
  document.getElementById("cityName").innerText = `${data.name} (${
    new Date().toISOString().split("T")[0]
  })`;
  document.getElementById(
    "temperature"
  ).innerText = `Temperature: ${data.main.temp}°C`;
  document.getElementById("wind").innerText = `Wind: ${data.wind.speed} M/S`;
  document.getElementById(
    "humidity"
  ).innerText = `Humidity: ${data.main.humidity}%`;
  document.getElementById("condition").innerText = data.weather[0].description;
  document.getElementById("weatherInfo").classList.remove("hidden");
}

async function fetchForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    if (data.cod !== "200") throw new Error(data.message);

    displayForecast(data);
  } catch (error) {
    alert("Error fetching forecast data: " + error.message);
  }
}

function displayForecast(data) {
  const forecastContainer = document.getElementById("forecast");
  const forecastTitle = document.getElementById("forecastTitle");
  forecastContainer.innerHTML = "";

  const dailyData = {};

  data.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!dailyData[date]) {
      dailyData[date] = entry;
    }
  });

  Object.values(dailyData)
    .slice(0, 5)
    .forEach((day) => {
      const forecastCard = document.createElement("div");
      forecastCard.className = "bg-white p-4 rounded-lg shadow-md text-center";
      forecastCard.innerHTML = `
                     <p class="font-bold">${day.dt_txt.split(" ")[0]}</p>
                     <p>Temp: ${day.main.temp}°C</p>
                     <p>Wind: ${day.wind.speed} M/S</p>
                     <p>Humidity: ${day.main.humidity}%</p>
               `;
      forecastContainer.appendChild(forecastCard);
    });

  forecastTitle.classList.remove("hidden");
  forecastContainer.classList.remove("hidden");
}

async function fetchCurrentLocationWeather() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        if (data.cod !== 200) throw new Error(data.message);

        displayWeather(data);
        fetchForecast(data.name);
        saveToRecentSearches(data.name);
      } catch (error) {
        alert("Error fetching location weather: " + error.message);
      }
    },
    () => {
      alert("Unable to retrieve your location");
    }
  );
}

function saveToRecentSearches(city) {
  const recentSearches =
    JSON.parse(localStorage.getItem(recentSearchesKey)) || [];
  if (!recentSearches.includes(city)) {
    recentSearches.push(city);
    localStorage.setItem(recentSearchesKey, JSON.stringify(recentSearches));
  }
  updateRecentSearchesDropdown();
}

function updateRecentSearchesDropdown() {
  const recentSearches =
    JSON.parse(localStorage.getItem(recentSearchesKey)) || [];
  const dropdown = document.getElementById("recentSearches");
  const label = document.getElementById("recentSearchesLabel");

  dropdown.innerHTML = '<option value="">Select a city</option>';
  recentSearches.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    dropdown.appendChild(option);
  });

  if (recentSearches.length > 0) {
    dropdown.classList.remove("hidden");
    label.classList.remove("hidden");
  } else {
    dropdown.classList.add("hidden");
    label.classList.add("hidden");
  }
}

function handleRecentCitySelection() {
  const selectedCity = document.getElementById("recentSearches").value;
  if (selectedCity) {
    document.getElementById("cityInput").value = selectedCity;
    fetchWeather();
  }
}

updateRecentSearchesDropdown();
