const currentTempDegrees = document.querySelector('.current__weather .degrees');
const tempUnitDisplay = document.querySelectorAll('.deg-unit');
const locationDisplay = document.querySelector('.location-display');
const todayLoTemp = document.querySelector('.current__lo-temp .degrees');
const todayHiTemp = document.querySelector('.current__hi-temp .degrees');
const currentUnit = '°C';

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
  console.log('🚀 ~ updateDisplayForecast ~ data:', data);
  const container = document.querySelector('.forecast');
  const temperatureData = data.forecast
    .map((day) => [day.mintemp_c, day.maxtemp_c])
    .flat();

  container.innerHTML = '';
  data.forecast.forEach((day) => {
    container.innerHTML += `
    <div class="day">
            <div class="date">${new Date(day.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}</div>
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

class TemperatureBar {
  static abs_max_temp_c = 45;
  static abs_min_temp_c = -5;
  static unit = 'c';
  constructor(temperatureData, loTemp, hiTemp) {
    this.wrapper = document.createElement('div');
    this.mask = document.createElement('span');
    this.main = document.createElement('span');
    this.loTemp = loTemp;
    this.hiTemp = hiTemp;
    this.wrapper.classList.add('temperature-bar-wrapper');
    this.main.classList.add('temperature-bar');
    this.mask.classList.add('temperature-bar-mask');

    this.wrapper.append(this.main);
    this.wrapper.append(this.mask);

    this.max_temp_c = Math.max(...temperatureData);
    this.min_temp_c = Math.min(...temperatureData);
  }

  draw() {
    this.main.style.backgroundImage = this.getGradient();
    this.mask.style.backgroundImage = this.getMask();
    return this.wrapper.outerHTML;
  }

  getGradient() {
    const maxHueValue = 220; // OKLCH red
    const minHueValue = 30; // OKLCH light blue
    const scaleLength = TemperatureBar.abs_max_temp_c - TemperatureBar.abs_min_temp_c; // 50

    const valueRange = maxHueValue - minHueValue; // 165
    const getPercentOfScale = (temperature) => {
      return (temperature - TemperatureBar.abs_min_temp_c) / scaleLength;
    };

    const hotHueValue =
      getPercentOfScale(this.max_temp_c) * valueRange * -1 + maxHueValue;
    const coldHueValue =
      getPercentOfScale(this.min_temp_c) * valueRange * -1 + maxHueValue;

    const gradient = `linear-gradient(to right in oklab,oklch(90% 0.50 ${coldHueValue}) 0%, oklch(90% 0.5 ${hotHueValue}) 100%)`;
    return gradient;
  }

  getMask() {
    const maskOn = 'rgb(100 100 100 / .9)';
    const maskOff = `rgb(100 100 100 / 0)`;

    const scaleLength = this.max_temp_c - this.min_temp_c;
    const startPercent = ((this.loTemp - this.min_temp_c) / scaleLength) * 100;
    const endPercent = ((this.hiTemp - this.min_temp_c) / scaleLength) * 100;

    const mask = `linear-gradient(to right, ${maskOn} 0 ${startPercent}%, ${maskOff} ${startPercent}% ${endPercent}%, ${maskOn} ${endPercent}% 100%)`;

    return mask;
  }
}
