const currentTempDegrees = document.querySelector('.current__weather .degrees');
const tempUnitDisplay = document.querySelectorAll('.deg-unit');
const locationDisplay = document.querySelector('.location-display');
const todayLoTemp = document.querySelector('.current__lo-temp .degrees');
const todayHiTemp = document.querySelector('.current__hi-temp .degrees');

/**
 * Icons from https://erikflowers.github.io/weather-icons/
 */
const WEATHER_ICON_CLASSES = {
  1000: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1003: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1006: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1009: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1030: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1063: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1066: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1069: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1072: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1087: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1114: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1117: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1135: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1147: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1150: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1153: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1168: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1171: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1180: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1183: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1186: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1189: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1192: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1195: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1198: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1201: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1204: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1207: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1210: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1213: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1216: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1219: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1222: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1225: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1258: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1282: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1261: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1264: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1273: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1276: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
  1279: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' },
};

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

export function updateDisplayForecast(data) {
  console.log('ive been called');
  const container = document.querySelector('.forecast');
  data.forecast.forEach((day) => {
    console.log('day');
    const card = document.createElement('div');
    card.innerHTML = `
    <div class="weather-card">
            <div class="date">May 18</div>
            <span class="condition-icon">
              <i class="wi wi-day-sunny"></i>
            </span>
            <div class="temp">
              <div class="lo-temp">
                <span class="degrees">9</span><span class="deg-unit">°C</span>
              </div>
              <div class="hi-temp">
                <span class="degrees">25</span><span class="deg-unit">°C</span>
              </div>
            </div>
          </div>
    `;
    container.append(card);
  });
}
