import { TemperatureBar } from './TemperatureBar';
import { WEATHER_ICON_CLASSES } from './WEATHER_ICON_CLASSES';
import bgImgDay from './img/daydrawing.jpg';
import bgImgNight from './img/nightdrawing.jpg';
import './css/index.css';

let useMetric;
let cachedData;

const unitSwitcher = document.querySelector('#unit-switch');
unitSwitcher.addEventListener('change', toggleUnits);

export function cacheData(data) {
  cachedData = data;
}

export function getUseMetric() {
  useMetric = JSON.parse(localStorage.getItem('useMetric'));
  if (useMetric === null) useMetric = true;
  return useMetric;
}

function toggleUnits(e) {
  useMetric = e.target.checked;
  localStorage.setItem('useMetric', useMetric);
  updateDisplay(cachedData, useMetric);
}

function getConditionIcon(code, isDay = 1) {
  let icon = document.createElement('i');
  const timeOfDay = isDay === 1 ? 'day' : 'night';
  icon.classList = WEATHER_ICON_CLASSES[code][timeOfDay];
  return icon;
}

function updateDisplayCurrent(data) {
  const bgImgWrapper = document.querySelector('.top-wrapper');

  displayCurrentWeatherBasicData(data);
  displayAddlWeatherData(data.current);
  displayWindData(data.current);

  bgImgWrapper.style.backgroundImage =
    data.current.is_day === 1 ? `url(${bgImgDay})` : `url(${bgImgNight})`;
}

function drawHourlyCard(hourData) {
  const card = document.createElement('div');
  const temperature = useMetric ? hourData.temp_c : hourData.temp_f;

  card.classList.add('hr', 'card');
  card.innerHTML = `
    <div class="time">${new Date(hourData.time).toLocaleTimeString('en-US', {
      hour: 'numeric',
    })}</div>
    <div class="hr-condition">
      ${getConditionIcon(hourData.condition.code, hourData.is_day).outerHTML}
    </div>
    <div class="hr-temp">
      <span class="temp">${temperature}°</span>
    </div>
    <div class="precip-chance">
      <i class="wi wi-raindrop"></i>
      <span>${Math.max(hourData.chance_of_rain, hourData.chance_of_snow)}%</span>
    </div>
    `;

  return card;
}

function displayCurrentWeatherBasicData(data) {
  const currentTempDegrees = document.querySelector('.current-weather .degrees');
  const locationDisplay = document.querySelector('.location-display .location');
  const loTempDisplay = document.querySelector('.current-temp-range .lo-temp .degrees');
  const todayHiTempDisplay = document.querySelector(
    '.current-temp-range .hi-temp .degrees',
  );

  const currentTemp = useMetric ? data.current.temp_c : data.current.temp_f;
  const loTemp = useMetric ? data.forecast[0].mintemp_c : data.forecast[0].mintemp_f;
  const hiTemp = useMetric ? data.forecast[0].maxtemp_c : data.forecast[0].maxtemp_f;

  currentTempDegrees.textContent = `${currentTemp}°`;
  loTempDisplay.textContent = `L: ${loTemp}°`;
  todayHiTempDisplay.textContent = `H: ${hiTemp}°`;
  locationDisplay.textContent = `${data.location.name}, ${data.location.country}`;

  const iconContainer = document.querySelector('.weather-card .condition-icon');
  iconContainer.querySelector('i')?.remove();
  iconContainer.append(
    getConditionIcon(data.current.condition.code, data.current.is_day),
  );
}

function displayAddlWeatherData(data) {
  const fragment = document.createDocumentFragment();
  const container = document.querySelector('.addl-data');
  const precipitationAmount = useMetric ? data.precip_mm : data.precip_in;
  const precipitationUnit = useMetric ? 'mm' : 'in.';
  const humidity = data.humidity;
  const airPressure = useMetric ? data.pressure_mb : data.pressure_in;
  const airPressureUnit = useMetric ? 'hPa' : 'inHg';
  const uvIndex = data.uv;
  const visibility = useMetric ? data.vis_km : data.vis_miles;
  const visibilityUnit = useMetric ? 'km' : 'mi.';
  const uvExposureCategory = getUVExposureCategory(uvIndex);

  container.textContent = '';

  const precipitationDisplay = document.createElement('div');
  precipitationDisplay.classList.add('precip', 'info-card');
  precipitationDisplay.innerHTML += `
      <h4>Precipitiation</h4>
      <span>${precipitationAmount}${precipitationUnit}</span>

  `;

  const humidityDisplay = document.createElement('div');
  humidityDisplay.classList.add('humidity', 'info-card');
  humidityDisplay.innerHTML = `
    <h4>Humidity</h4>
    <span>${humidity}%</span>
  `;

  const airPressureDisplay = document.createElement('div');
  airPressureDisplay.classList.add('pressure', 'info-card');
  airPressureDisplay.innerHTML = `
    <h4>Air pressure</h4>
    <span>${airPressure}${airPressureUnit}</span>
  `;

  const uvDisplay = document.createElement('div');
  uvDisplay.classList.add('uv', 'info-card');
  uvDisplay.innerHTML += `
    <h4>UV Index</h4>
    <div class="uv-index-backdrop info-value">
      <div class="uv-index">${uvIndex} - <span class="uv-category">${uvExposureCategory.category}</span></div>
    </div>
  `;

  const visibilityDisplay = document.createElement('div');
  visibilityDisplay.classList.add('visibility', 'info-card');
  visibilityDisplay.innerHTML += `
    <h4> Visibility</h4>
    <span>${visibility}${visibilityUnit}</span>

  `;

  uvDisplay.querySelector('.uv-index-backdrop').style.backgroundColor =
    uvExposureCategory.color;

  fragment.append(
    precipitationDisplay,
    humidityDisplay,
    airPressureDisplay,
    uvDisplay,
    visibilityDisplay,
  );
  container.appendChild(fragment);
}

function getUVExposureCategory(uvIndex) {
  let category;

  if (uvIndex < 0) throw Error("Got a negative UV index...that's not right!");
  if ([0, 1, 2].includes(uvIndex)) {
    category = { category: 'Minimal', color: '#3297a8' };
  } else if ([3, 4].includes(uvIndex)) {
    category = { category: 'Low', color: '#32a87b' };
  } else if ([5, 6].includes(uvIndex)) {
    category = { category: 'Moderate', color: '#e3d94f' };
  } else if ([7, 8, 9].includes(uvIndex)) {
    category = { category: 'High', color: '#e3864f' };
  } else {
    category = { category: 'Very High', color: '#ed3232' };
  }

  return category;
}

function displayWindData(data) {
  const fragment = document.createDocumentFragment();
  const container = document.querySelector('.wind');
  const windSpeed = useMetric ? data.wind_kph : data.wind_mph;
  const gustSpeed = useMetric ? data.gust_kph : data.gust_mph;
  const windUnit = useMetric ? 'kph' : 'mph';
  const windDirection = data.wind_dir;
  const windDegrees = data.wind_degree;

  container.textContent = '';

  const windSpeedDisplay = document.createElement('div');
  windSpeedDisplay.classList.add('wind-speed', 'info-card');
  windSpeedDisplay.innerHTML = `
    <h4>Wind speed</h4>
    <span>${windSpeed}${windUnit}</span>
  `;

  const gustSpeedDisplay = document.createElement('div');
  gustSpeedDisplay.classList.add('gust-speed', 'info-card');
  gustSpeedDisplay.innerHTML = `
    <h4>Gust speed</h4>
    <span>${gustSpeed}${windUnit}</span>
  `;

  const windDirectionDisplay = document.createElement('div');
  windDirectionDisplay.classList.add('wind-dir', 'info-card');
  windDirectionDisplay.innerHTML = `
    <h4>Wind direction</h4>
    <div class="direction">
      ${windDirection}
      <span class="arrow"><i class="wi wi-wind towards-${windDegrees}-deg"></i></span>
    </div>
  `;

  fragment.append(windSpeedDisplay, gustSpeedDisplay, windDirectionDisplay);
  container.appendChild(fragment);
}

function updateDisplayHourly(data) {
  const hourlyData = data.hourly;
  const fragment = document.createDocumentFragment();
  const container = document.querySelector('.fc-hourly');
  container.textContent = '';

  let currentHour = data.location.localtime.split(' ')[1].split(':')[0];
  const sortedData = [
    ...hourlyData.slice(currentHour, 24),
    ...hourlyData.slice(0, currentHour),
  ];

  sortedData.forEach((hour) => {
    fragment.appendChild(drawHourlyCard(hour));
  });

  container.append(fragment);
}

function getForecastDayDisplay(day, tempBarData) {
  const dayContainer = document.createElement('div');
  const loTemp = useMetric ? day.mintemp_c : day.mintemp_f;
  const hiTemp = useMetric ? day.maxtemp_c : day.maxtemp_f;

  dayContainer.classList.add('day');
  const date = new Date(day.date);

  dayContainer.innerHTML = `
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
        L: ${loTemp}°
      </div>
      ${new TemperatureBar(tempBarData, day.mintemp_c, day.maxtemp_c).draw()}
      <div class="temperature hi-temp">
        H: ${hiTemp}°
      </div>
    `;

  return dayContainer;
}

function updateDisplayForecast(data) {
  const container = document.querySelector('.fc-seven-day');
  const fragment = document.createDocumentFragment();
  const temperatureBarData = data.forecast
    .map((day) => [day.mintemp_c, day.maxtemp_c])
    .flat();

  container.innerHTML = '';
  data.forecast.forEach((day) => {
    fragment.appendChild(getForecastDayDisplay(day, temperatureBarData));
  });

  container.appendChild(fragment);
}

export default function updateDisplay(cleanData) {
  unitSwitcher.checked = useMetric;
  updateDisplayCurrent(cleanData);
  updateDisplayHourly(cleanData);
  updateDisplayForecast(cleanData);
}
