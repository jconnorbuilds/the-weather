import { TemperatureBar } from './TemperatureBar';
import { WEATHER_ICON_CLASSES } from './WEATHER_ICON_CLASSES';
import bgImgDay from './img/daydrawing.png';
import bgImgNight from './img/nightdrawing.png';
import './css/index.css';

const currentTempDegrees = document.querySelector('.current-weather .degrees');
const locationDisplay = document.querySelector('.location-display .location');
const todayLoTemp = document.querySelector('.current-temp-range .lo-temp .degrees');
const todayHiTemp = document.querySelector('.current-temp-range .hi-temp .degrees');
const currentUnit = 'c';

function getConditionIcon(code, isDay = 1) {
  let icon = document.createElement('i');
  const timeOfDay = isDay === 1 ? 'day' : 'night';
  icon.classList = WEATHER_ICON_CLASSES[code][timeOfDay];
  return icon;
}

export function updateDisplayCurrent(data) {
  const bgImgWrapper = document.querySelector('.top-wrapper');
  console.log('🚀 ~ updateDisplayCurrent ~ data:', data);
  currentTempDegrees.textContent = `${data.current.temp_c}°`;
  todayLoTemp.textContent = `L: ${data.forecast[0].mintemp_c}°`;
  todayHiTemp.textContent = `H: ${data.forecast[0].maxtemp_c}°`;
  locationDisplay.textContent = `${data.location.name}, ${data.location.country}`;

  const iconContainer = document.querySelector('.weather-card .condition-icon');
  iconContainer.querySelector('i')?.remove();
  iconContainer.append(
    getConditionIcon(data.current.condition.code, data.current.is_day),
  );

  displayPrecipHumidityPressureData(data.current, true);
  displayUVVisibilityData(data.current, true);
  displayWindData(data.current, true);

  bgImgWrapper.style.backgroundImage =
    data.current.is_day === 1 ? `url(${bgImgDay})` : `url(${bgImgNight})`;
}

function drawHourlyCard(hourData) {
  const card = document.createElement('div');
  card.classList.add('hr', 'card');
  card.innerHTML = `
    <div class="time">${new Date(hourData.time).toLocaleTimeString('en-US', {
      hour: 'numeric',
    })}</div>
    <div class="hr-condition">
      ${getConditionIcon(hourData.condition.code, hourData.is_day).outerHTML}
    </div>
    <div class="hr-temp">
      <span class="temp">${hourData.temp_c}°</span>
    </div>
    <div class="precip-chance">
      <i class="wi wi-raindrop"></i>
      <span>${Math.max(hourData.chance_of_rain, hourData.chance_of_snow)}%</span>
    </div>
    
    `;
  return card;
}

export function displayPrecipHumidityPressureData(data, useMetric = true) {
  const docFragment = document.createDocumentFragment();
  const container = document.querySelector('.precip-humidity-pressure');
  const precipitationAmount = useMetric ? data.precip_mm : data.precip_in;
  const precipitationUnit = useMetric ? 'mm' : 'in.';
  const humidity = data.humidity;
  const airPressure = useMetric ? data.pressure_mb : data.pressure_in;
  const airPressureUnit = useMetric ? 'hPa' : 'inHg';

  container.textContent = '';

  const precipitationDisplay = document.createElement('div');
  precipitationDisplay.innerHTML += `
    <div class="precip">
      <h4><i class="wi wi-raindrop"></i> Precipitiation</h4>
      
      ${precipitationAmount} ${precipitationUnit}
    </div>
  `;

  const humidityDisplay = document.createElement('div');
  humidityDisplay.innerHTML = `
    <div class="humidity">
      <h4>Humidity</h4>
      ${humidity}%
    </div>
  `;

  const airPressureDisplay = document.createElement('div');
  airPressureDisplay.innerHTML = `
    <div class="pressure">
      <h4>Air pressure</h4>
      ${airPressure}${airPressureUnit}
    </div>
  `;

  docFragment.append(precipitationDisplay, humidityDisplay, airPressureDisplay);
  container.appendChild(docFragment);
}

function getUVExposureCategory(uvIndex) {
  let category;

  if (uvIndex < 0) throw Error("Got a negative UV index...that's not right!");
  if ([0, 1, 2].includes(uvIndex)) {
    category = ['Minimal', '#3297a8'];
  } else if ([3, 4].includes(uvIndex)) {
    category = ['Low', '#32a87b'];
  } else if ([5, 6].includes(uvIndex)) {
    category = ['Moderate', '#e3d94f'];
  } else if ([7, 8, 9].includes(uvIndex)) {
    category = ['High', '#e3864f'];
  } else {
    category = ['Very High', '#ed3232'];
  }

  return category;
}

function displayUVVisibilityData(data, useMetric = true) {
  const docFragment = document.createDocumentFragment();
  const container = document.querySelector('.uv-visibility');
  const uvIndex = data.uv;
  const visibility = useMetric ? data.vis_km : data.vis_miles;
  const visibilityUnit = useMetric ? 'km' : 'mi.';
  const uvExposureCategory = getUVExposureCategory(uvIndex);

  container.textContent = '';

  const uvDisplay = document.createElement('div');
  uvDisplay.innerHTML += `
    <div class="uv">
      <h4>UV Index</h4>
      <div class="uv-index-backdrop">
        <div class="uv-index">${uvIndex} - <span class="uv-category">${uvExposureCategory[0]}</span></div>
        
      </div>
    </div>
  `;

  const visibilityDisplay = document.createElement('div');
  visibilityDisplay.innerHTML += `
    <div class="visibility">
      <h4><i class="fa-regular fa-eye"></i> Visibility</h4>
      ${visibility} ${visibilityUnit}
    </div>
  `;

  docFragment.append(uvDisplay, visibilityDisplay);

  uvDisplay.querySelector('.uv-index-backdrop').style.backgroundColor =
    uvExposureCategory[1];
  container.append(docFragment);
}

export function displayWindData(data, useMetric = true) {
  const container = document.querySelector('.wind');
  const windSpeed = useMetric ? data.wind_kph : data.wind_mph;
  const gustSpeed = useMetric ? data.gust_kph : data.gust_mph;
  const windUnit = useMetric ? 'kph' : 'mph';
  const windDirection = data.wind_dir;
  const windDegrees = data.wind_degree;
}

export function updateDisplayHourly(data) {
  const hourlyData = data.hourly;
  console.log('🚀 ~ updateDisplayHourly ~ data:', data);
  const container = document.querySelector('.fc-hourly');
  container.textContent = '';

  let currentHour = data.location.localtime.split(' ')[1].split(':')[0];
  const sortedData = [
    ...hourlyData.slice(currentHour, 24),
    ...hourlyData.slice(0, currentHour),
  ];

  sortedData.forEach((hour) => {
    const card = drawHourlyCard(hour);
    container.append(card);
  });
}

export function updateDisplayForecast(data) {
  console.log('🚀 ~ updateDisplayForecast ~ data:', data);
  const container = document.querySelector('.fc-seven-day');
  const temperatureData = data.forecast
    .map((day) => [day.mintemp_c, day.maxtemp_c])
    .flat();

  container.innerHTML = '';
  data.forecast.forEach((day) => {
    const date = new Date(day.date);

    container.innerHTML += `
    <div class="day">
      <div class="date">
        <div class="weekday">${date.toLocaleDateString('en-US', {
          weekday: 'short',
        })}</div>
        <div class="cal-date">${date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}</div>
      </div>
      <span class="condition-icon">
        ${getConditionIcon(day.condition.code).outerHTML}
      </span>
      <div class="temperature lo-temp">
        L: ${day.mintemp_c}°
      </div>
      ${new TemperatureBar(temperatureData, day.mintemp_c, day.maxtemp_c).draw()}
      <div class="temperature hi-temp">
        H: ${day.maxtemp_c}°
      </div>
      </div>
    </div>
    `;
  });
}
