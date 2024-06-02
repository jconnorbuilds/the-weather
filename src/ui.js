import { TemperatureBar } from './TemperatureBar';
import { WEATHER_ICON_CLASSES } from './WEATHER_ICON_CLASSES';
import bgImgDay from './img/daydrawing.png';
import bgImgNight from './img/nightdrawing.png';

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
  const container = document.querySelector('.forecast');
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
