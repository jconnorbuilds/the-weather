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
  1000: { day: 'wi wi-day-sunny', night: 'wi wi-night-clear' }, // Sunny / Clear
  1003: { day: 'wi wi-day-cloudy-high', night: 'wi wi-night-alt-partly-cloudy' }, // Partly cloudy
  1006: { day: 'wi wi-cloudy', night: 'wi wi-night-alt-cloudy' }, // Cloudy
  1009: { day: 'wi wi-day-sunny-overcast', night: 'wi wi-night-alt-cloudy' }, // Overcast
  1030: { day: 'wi wi-day-fog', night: 'wi wi-night-fog' }, // Mist
  1063: { day: 'wi wi-day-showers', night: 'wi wi-night-alt-showers' }, // Patchy rain possible
  1066: { day: 'wi wi-day-snow', night: 'wi wi-night-alt-snow' }, // Patchy snow possible
  1069: { day: 'wi wi-day-rain-mix', night: 'wi wi-night-alt-rain-mix' }, // Patchy sleet possible
  1072: { day: 'wi wi-day-sleet', night: 'wi wi-night-alt-sleet' }, // Patchy freezing drizzle possible
  1087: { day: 'wi wi-day-lightning', night: 'wi wi-night-alt-lightning' }, // Thundery outbreaks possible
  1114: { day: 'wi wi-snow-wind', night: 'wi wi-night-alt-snow-wind' }, // Blowing snow
  1117: { day: 'wi wi-snow-wind', night: 'wi wi-night-alt-snow-wind' }, // Blizzard
  1135: { day: 'wi wi-fog', night: 'wi wi-fog' }, // Fog
  1147: { day: 'wi wi-fog', night: 'wi wi-fog' }, // Freezing fog
  1150: { day: 'wi wi-day-showers', night: 'wi wi-night-alt-showers' }, // Patchy light drizzle
  1153: { day: 'wi wi-day-showers', night: 'wi wi-night-alt-showers' }, // Light drizzle
  1168: { day: 'wi wi-day-rain-mix', night: 'wi wi-night-alt-rain-mix' }, // Freezing drizzle
  1171: { day: 'wi wi-rain-mix', night: 'wi wi-rain-mix' }, // Heavy freezing drizzle
  1180: { day: 'wi wi-day-showers', night: 'wi wi-night-alt-showers' }, // Patchy light rain
  1183: { day: 'wi wi-showers', night: 'wi wi-showers' }, // Light rain
  1186: { day: 'wi wi-showers', night: 'wi wi-showers' }, // Moderate rain at times
  1189: { day: 'wi wi-showers', night: 'wi wi-showers' }, // Moderate rain
  1192: { day: 'wi wi-rain', night: 'wi wi-rain' }, // Heavy rain at times
  1195: { day: 'wi wi-rain', night: 'wi wi-rain' }, // Heavy rain
  1198: { day: 'wi wi-day-rain-mix', night: 'wi wi-night-alt-rain-mix' }, // Light freezing rain
  1201: { day: 'wi wi-rain-mix', night: 'wi wi-rain-mix' }, // Moderate or heavy freezing rain
  1204: { day: 'wi wi-day-rain-mix', night: 'wi wi-night-rain-mix' }, // Light sleet
  1207: { day: 'wi wi-rain-mix', night: 'wi wi-rain-mix' }, // Moderate or heavy sleet
  1210: { day: 'wi wi-day-snow', night: 'wi wi-night-alt-snow' }, // Patchy light snow
  1213: { day: 'wi wi-snow', night: 'wi wi-snow' }, // Light snow
  1216: { day: 'wi wi-snow', night: 'wi wi-snow' }, // Patchy moderate snow
  1219: { day: 'wi wi-snow', night: 'wi wi-snow' }, // Moderate snow
  1222: { day: 'wi wi-snow', night: 'wi wi-snow' }, // Patchy heavy snow
  1225: { day: 'wi wi-snow', night: 'wi wi-snow' }, // Heavy snow
  1237: { day: 'wi wi-hail', night: 'wi wi-hail' }, // Ice pellets
  1240: { day: 'wi wi-day-showers', night: 'wi wi-night-alt-showers' }, // Light rain shower
  1243: { day: 'wi wi-showers', night: 'wi wi-showers' }, // Moderate or heavy rain shower
  1246: { day: 'wi wi-rain', night: 'wi wi-rain' }, // Torrential rain shower
  1249: { day: 'wi wi-day-rain-mix', night: 'wi wi-night-alt-rain-mix' }, // Light sleet showers
  1252: { day: 'wi wi-rain-mix', night: 'wi wi-rain-mix' }, // Moderate or heavy sleet showers
  1255: { day: 'wi wi-day-snow', night: 'wi wi-night-alt-snow' }, // Light snow showers
  1258: { day: 'wi wi-snow', night: 'wi wi-snow' }, // Moderate or heavy snow showers
  1282: { day: 'wi wi-day-hail', night: 'wi wi-night-alt-hail' }, // Light showers of ice pellets
  1261: { day: 'wi wi-hail', night: 'wi wi-hail' }, // Moderate or heavy showers of ice pellets
  1264: { day: 'wi wi-day-storm-showers', night: 'wi wi-night-alt-storm-showers' }, // Patchy light rain with thunder
  1273: { day: 'wi wi-thunderstorm', night: 'wi wi-thunderstorm' }, // Moderate or heavy rain with thunder
  1276: {
    day: 'wi wi-day-snow-thunderstorm',
    night: 'wi wi-night-alt-snow-thunderstorm',
  }, // Patchy light snow with thunder
  1279: {
    day: 'wi wi-day-snow-thunderstorm',
    night: 'wi wi-night-alt-snow-thunderstorm',
  }, // Moderate or heavy snow with thunder
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
  static abs_max_temp_c = 40;
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

    this.max_temp_c = Math.max(...temperatureData);
    this.min_temp_c = Math.min(...temperatureData);
  }

  /**
   * Draws a temperature bar with a gradient that spans the max range of temperatures.
   * Uses a clip path.
   */
  draw() {
    this.main.style.backgroundImage = this.getGradient();
    this.main.style.clipPath = this.getClipPath();
    return this.wrapper.outerHTML;
  }

  /**
   * Draws a temperature bar with a gradient that represents the
   * min and max temperatures for the visible forecast.
   * Uses a mask instead of a clip path.
   */
  drawType2() {
    this.main.style.backgroundImage = this.getGradientType2();
    this.mask.style.backgroundImage = this.getMask();
    this.wrapper.append(this.mask);
    return this.wrapper.outerHTML;
  }

  getGradient() {
    const hotHueValue = 28;
    const middleHueValue = 144;
    const coldHueValue = 206;
    const gradient = `linear-gradient(
      90deg in oklch,
      oklch(60% 0.44 ${coldHueValue}) 0%, oklch(97% 0.27 ${middleHueValue}) 54% 54%, oklch(80% 0.34 ${hotHueValue}) 100%
    )`;
    return gradient;
  }

  getClipPath() {
    const scaleLength = TemperatureBar.abs_max_temp_c - TemperatureBar.abs_min_temp_c;
    const startPercent =
      ((this.loTemp - TemperatureBar.abs_min_temp_c) / scaleLength) * 100;
    const endPercent =
      ((this.hiTemp - TemperatureBar.abs_min_temp_c) / scaleLength) * 100;
    const clipPath = `rect(0 ${endPercent}% 10px ${startPercent}% round 2.5px)`;

    console.log('🚀 ~ TemperatureBar ~ getClipPath ~ clipPath:', clipPath);
    return clipPath;
  }

  getGradientType2() {
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
