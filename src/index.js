import './css/index.css';
import updateDisplay, { cacheData, getOrSetUseMetric } from './updateDisplay.js';

const API_KEY = '35c70887ef254533935103759241405';
const BASE_URL = 'http://api.weatherapi.com/v1';
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
  console.log('🚀 ~ getForecastData ~ allForecastData:', allForecastData);
  return allForecastData;
}

// Process the data to retrieve what needs to be displayed
async function processForecastData(data) {
  let processedData = { current: {}, hourly: '', forecast: [], location: {} };

  // Get the current conditions to be displayed
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
  keysCurrent.forEach((key) => (processedData.current[key] = data.current[key]));

  const keysLocation = ['country', 'localtime', 'name'];
  keysLocation.forEach((key) => (processedData.location[key] = data.location[key]));

  const keysForecast = [
    'mintemp_c',
    'mintemp_f',
    'maxtemp_c',
    'maxtemp_f',
    'daily_chance_of_rain',
    'condition',
  ];

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
  try {
    loadingSpinner.classList.remove('hidden');
    const forecastData = await getForecastData(query);
    const cleanData = await processForecastData(forecastData);

    const useMetric = getOrSetUseMetric();
    console.log(useMetric);
    updateDisplay(cleanData, useMetric);
    cacheData(cleanData, useMetric);

    loadingSpinner.classList.add('hidden');
  } catch (error) {
    console.error('Error getting the data...!', error);
  }
}

locationSearch.addEventListener('submit', async (e) => {
  e.preventDefault();
  const locationField = e.target.elements.location;
  getAndDisplayWeather(locationField.value);
});

getAndDisplayWeather('Yonezawa');
