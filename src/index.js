import './index.scss';

const API_KEY = '35c70887ef254533935103759241405';
const BASE_URL = 'http://api.weatherapi.com/v1';
const currentTempDegrees = document.querySelector('.current__temp .degrees');
const currentTempUnit = document.querySelector('.current__temp .unit');
const locationDisplay = document.querySelector('.location-display');
const locationSearch = document.querySelector('form#location-search');

// Get the total data from the API
async function getForecastData(query = 'Yonezawa') {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${query}&days=3`,
    {
      mode: 'cors',
    },
  );

  const allForecastData = await response.json();
  console.log(allForecastData);
  return allForecastData;
}

// Process the data to retrieve what needs to be displayed
async function processForecastData(data) {
  let processedData = { current: {}, forecast: [], location: {} };

  // Get the current conditions to be displayed
  const keysCurrent = ['condition', 'temp_c', 'temp_f'];
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

  return processedData;
}

async function updateDisplay(processedData) {
  const data = processedData;
  currentTempDegrees.textContent = data.current.temp_c;
  currentTempUnit.textContent = '°C';
  locationDisplay.textContent = `${data.location.name}, ${data.location.country}`;
}

const forecastData = await getForecastData();
const cleanData = await processForecastData(forecastData);
console.log(cleanData);
updateDisplay(cleanData);

locationSearch.addEventListener('submit', async (e) => {
  e.preventDefault();
  const locationField = e.target.elements.location;
  const forecastData = await getForecastData(locationField.value);
  updateDisplay(forecastData);
});

// Return low temp, hi temp, precip %, icon
