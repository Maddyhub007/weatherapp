const apiKey = "39aae4103eee177ec2b01cf651a67cfe";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";


const weatherIcon = document.querySelector(".weather-icon");
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");


async function checkWeather(query) {
    let url;

    if (typeof query === "string") {
       
        url = `${apiUrl}&q=${query}&appid=${apiKey}`;
    } else if (typeof query === "object") {
      
        const { latitude, longitude } = query;
        url = `${apiUrl}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    }

    const response = await fetch(url);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "Km/h";

        // Update weather icon based on conditions
        const weatherCondition = data.weather[0].main;
        if (weatherCondition === "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (weatherCondition === "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (weatherCondition === "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (weatherCondition === "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (weatherCondition === "Mist") {
            weatherIcon.src = "images/mist.png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}


searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Fetch weather based on user's live location
function getLiveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                checkWeather({ latitude, longitude });
            },
            error => {
                console.error("Error getting location:", error);
                document.querySelector(".error").innerText = "Unable to retrieve location.";
                document.querySelector(".error").style.display = "block";
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Automatically get live location weather on app load
window.addEventListener("load", getLiveLocation);
