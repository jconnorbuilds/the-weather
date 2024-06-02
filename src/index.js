import './css/index.scss';
import {
  updateDisplayCurrent,
  updateDisplayHourly,
  updateDisplayForecast,
} from './ui.js';

const API_KEY = '35c70887ef254533935103759241405';
const BASE_URL = 'http://api.weatherapi.com/v1';
const locationSearch = document.querySelector('form#location-search');

// Get the total data from the API
async function getForecastData(query = 'Yonezawa') {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${query}&days=5`,
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
  const keysCurrent = ['condition', 'is_day', 'temp_c', 'temp_f'];
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
  forecastDays.forEach((day) => {
    let forecastData = {};
    forecastData.date = day.date;
    keysForecast.forEach((key) => (forecastData[key] = day.day[key]));
    processedData.forecast.push(forecastData);
  });

  processedData.hourly = forecastDays[0].hour;

  return processedData;
}

const forecastData = await getForecastData();
const cleanData = await processForecastData(forecastData);
updateDisplayCurrent(cleanData);
updateDisplayHourly(cleanData);
updateDisplayForecast(cleanData);

locationSearch.addEventListener('submit', async (e) => {
  e.preventDefault();
  const locationField = e.target.elements.location;
  const forecastData = await getForecastData(locationField.value);
  const cleanData = await processForecastData(forecastData);

  updateDisplayCurrent(cleanData);
  updateDisplayHourly(cleanData);
  updateDisplayForecast(cleanData);
});
