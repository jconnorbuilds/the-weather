export class TemperatureBar {
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
