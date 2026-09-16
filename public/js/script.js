let form = document.getElementById('form1');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const address = document.getElementById('address').value.trim();

    if (!address) return;

    await weatherFun(address);
    form.reset();
});

const errorF = document.getElementById('error');
const latitudeF = document.getElementById('latitude');
const longitudeF = document.getElementById('longitude');
const countryF = document.getElementById('country');
const conditionF = document.getElementById('condition');
const temperatureF = document.getElementById('temperature');

async function weatherFun(address) {
    try {
        clearResults();
        errorF.innerText = 'Loading...';

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(address)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error('Geocoding request failed');
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            errorF.innerText = 'Location not found';
            return;
        }

        const location = geoData.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error('Weather request failed');
        }

        const weatherData = await weatherResponse.json();
        const temperature = weatherData.current.temperature_2m;
        const weatherCode = weatherData.current.weather_code;

        errorF.innerText = '';
        latitudeF.innerText = `Latitude: ${latitude}`;
        longitudeF.innerText = `Longitude: ${longitude}`;
        countryF.innerText = `Country: ${location.name}, ${location.country}`;
        conditionF.innerText = `Condition: ${getWeatherCondition(weatherCode)}`;
        temperatureF.innerText = `Temperature: ${temperature}°C`;
    } catch (error) {
        console.error(error);
        errorF.innerText = 'Something went wrong';
        clearResults();
    }
}

function getWeatherCondition(code) {
    if (code === 0) return 'Clear sky';
    if ([1, 2, 3].includes(code)) return 'Partly cloudy';
    if ([45, 48].includes(code)) return 'Fog';
    if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
    if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
    if ([71, 73, 75, 77].includes(code)) return 'Snow';
    if ([80, 81, 82].includes(code)) return 'Rain showers';
    if ([85, 86].includes(code)) return 'Snow showers';
    if ([95, 96, 99].includes(code)) return 'Thunderstorm';
    return 'Unknown';
}

function clearResults() {
    latitudeF.innerText = '';
    longitudeF.innerText = '';
    countryF.innerText = '';
    conditionF.innerText = '';
    temperatureF.innerText = '';
}