import './css/index.css';
import updateDisplay, { cacheData, getUseMetric } from './updateDisplay.js';

const API_KEY = '35c70887ef254533935103759241405';
const BASE_URL = 'https://api.weatherapi.com/v1';
const locationSearch = document.querySelector('form#location-search');
const loadingSpinner = document.querySelector('#loader');

// Get the total data from the API
async function getForecastData(query) {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${query}&days=8`,
    {
      mode: 'cors',
    },
  );

  const allForecastData = await response.json();
  if (!allForecastData.error) return allForecastData;

  if ([1002, 1003, 1005, 1006, 9001].includes(allForecastData.error.code)) {
    throw new Error(allForecastData.error.message);
  } else if ([2006, 2007, 2008].includes(allForecastData.error.code)) {
    throw new Error(
      'API Key error. Either the API key is invalid, disabled, or has exceeded the call quota.',
    );
  } else {
    throw new Error("An error occured, the weather data couldn't be retrieved.");
  }
}

const keysCurrent = [
  'condition',
  'is_day',
  'temp_c',
  'temp_f',
  'windchill_c',
  'windchill_f',
  'humidity',
  'precip_in',
  'precip_mm',
  'pressure_in',
  'pressure_mb',
  'uv',
  'vis_km',
  'vis_miles',
  'wind_degree',
  'wind_dir',
  'wind_kph',
  'wind_mph',
  'gust_kph',
  'gust_mph',
];

const keysForecast = [
  'mintemp_c',
  'mintemp_f',
  'maxtemp_c',
  'maxtemp_f',
  'daily_chance_of_rain',
  'condition',
];

const keysLocation = ['country', 'localtime', 'name'];

// Process the data to retrieve what needs to be displayed
async function processForecastData(data) {
  let processedData = { current: {}, hourly: '', forecast: [], location: {} };

  // Get the current conditions to be displayed
  keysCurrent.forEach((key) => (processedData.current[key] = data.current[key]));
  keysLocation.forEach((key) => (processedData.location[key] = data.location[key]));

  // Get the parameters to be used in the forecast display
  const forecastDays = data.forecast.forecastday;
  data.forecast.forecastday.shift(); // don't need the first day ('today') in the data
  forecastDays.forEach((day) => {
    let forecastData = {};
    forecastData.date = day.date;
    keysForecast.forEach((key) => (forecastData[key] = day.day[key]));
    processedData.forecast.push(forecastData);
  });

  processedData.hourly = forecastDays[0].hour;

  return processedData;
}

async function getAndDisplayWeather(query) {
  getUseMetric();
  try {
    loadingSpinner.classList.remove('hidden');
    const forecastData = await getForecastData(query);
    const cleanData = await processForecastData(forecastData);

    updateDisplay(cleanData);
    cacheData(cleanData);
  } catch (error) {
    console.error('Error getting the data...!', error);
    const errMessage = document.querySelector('.top .error-message');
    errMessage.textContent = error.message;
  } finally {
    loadingSpinner.classList.add('hidden');
  }
}

function init() {
  loadingSpinner.classList.remove('hidden');
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getAndDisplayWeather(`${latitude},${longitude}`);
    },
    () => getAndDisplayWeather(`Tokyo, Japan`),
  );
}

async function search(e) {
  e.preventDefault();
  const locationField = e.target.elements.location;
  getAndDisplayWeather(locationField.value);

  // reset and remove focus from the search field
  e.target.reset();
  locationField.blur();
}

locationSearch.addEventListener('submit', search);

init();
