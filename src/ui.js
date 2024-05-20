import { TemperatureBar } from './TemperatureBar';
import { WEATHER_ICON_CLASSES } from './WEATHER_ICON_CLASSES';

const currentTempDegrees = document.querySelector('.current__weather .degrees');
const tempUnitDisplay = document.querySelectorAll('.deg-unit');
const locationDisplay = document.querySelector('.location-display');
const todayLoTemp = document.querySelector('.current__temp-range .lo-temp .degrees');
const todayHiTemp = document.querySelector('.current__temp-range .hi-temp .degrees');
const currentUnit = '°C';

function getConditionIcon(code, isDay = 1) {
  let icon = document.createElement('i');
  const timeOfDay = isDay === 1 ? 'day' : 'night';
  icon.classList = WEATHER_ICON_CLASSES[code][timeOfDay];
  return icon;
}

export function updateDisplayCurrent(data) {
  console.log('🚀 ~ updateDisplayCurrent ~ data:', data);
  currentTempDegrees.textContent = data.current.temp_c;
  todayLoTemp.textContent = data.forecast[0].mintemp_c;
  todayHiTemp.textContent = data.forecast[0].maxtemp_c;
  locationDisplay.textContent = `${data.location.name}, ${data.location.country}`;
  tempUnitDisplay.forEach((el) => (el.textContent = '°C'));

  const iconContainer = document.querySelector('.weather-card .condition-icon');
  iconContainer.querySelector('i')?.remove();
  iconContainer.append(
    getConditionIcon(data.current.condition.code, data.current.is_day),
  );
}

export function updateDisplayHourly(data) {}

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
        <div class="date__weekday">${date.toLocaleDateString('en-US', {
          weekday: 'short',
        })}</div>
        <div class="date__cal-date">${date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}</div>
      </div>
      <span class="condition-icon">
        ${getConditionIcon(day.condition.code).outerHTML}
      </span>
      <div class="temperature lo-temp">
        <span class="degrees">L: ${
          day.mintemp_c
        }</span><span class="deg-unit">${currentUnit}</span>
      </div>
      ${new TemperatureBar(temperatureData, day.mintemp_c, day.maxtemp_c).draw()}
      <div class="temperature hi-temp">
        <span class="degrees">H: ${
          day.maxtemp_c
        }</span><span class="deg-unit">${currentUnit}</span>
      </div>
      </div>
    </div>
    `;
  });
}
