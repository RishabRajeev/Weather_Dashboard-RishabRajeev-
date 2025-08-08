const apiKey = "839031baaece82846b498f8633ee767e";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const spinner = document.getElementById("spinner");

window.onload = () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        getWeather(lastCity);
    }
};

async function getWeather(city) {
    try {
        city = formatCityName(city);
        showSpinner();

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`❌ Couldn't find city: "${city}". Check spelling or add country code.`);
            }
            throw new Error("Something went wrong. Please try again.");
        }

        const data = await response.json();
        displayWeather(data);
        localStorage.setItem("lastCity", city);

    } catch (error) {
        weatherInfo.innerHTML = `<p style="color:red;">${error.message}</p>`;
    } finally {
        hideSpinner();
    }
}

function displayWeather(data) {
    const { name } = data;
    const { icon, description, main } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    // Change background based on weather type
    document.body.className = main.toLowerCase();

    weatherInfo.innerHTML = `
        <h2>${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
        <p><strong>${temp}°C</strong> - ${description}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${speed} m/s</p>
    `;
}

function formatCityName(city) {
    return city
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function showSpinner() {
    spinner.style.display = "block";
    weatherInfo.innerHTML = ""; // clear old data
}

function hideSpinner() {
    spinner.style.display = "none";
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) getWeather(city);
    }
});
