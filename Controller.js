export default class Controller {

  constructor(ws281x) {
    // Current pixel position
    this.offset = 0;
    // Set my Neopixel configuration
    this.config = { 
      leds: 200,
      gpio: 10,
      dma: 11,
      ledChannel: 1,
      type: 'grb'
    };

    this.phaseR = 0;
    this.phaseB = 0;
    this.phaseG = 0;
    this.phaseD = 0;

    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.brightness = 255;

    this.pixels = new Uint32Array(this.config.leds);
    
    // Configure ws281x
    this.ws281x = ws281x;
    this.ws281x.configure(this.config);
  }

  state(state) {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null;
    }

    // Loop every 100 ms
    if (state.state === 'OFF') {
      this.interval = setInterval(this.off.bind(this), 5);
    } else if (state.state === 'ON') {

      if (!state.effect || state.effect === 'Solid') {
        this.interval = setInterval(this.rgb.bind(this), 5);
      } else if (state.effect === 'Shimmer') {
        this.interval = setInterval(this.shimmer.bind(this), 5);
      } else if (state.effect === 'White Shimmer') {
        this.interval = setInterval(this.whiteShimmer.bind(this), 5);
      } else if (state.effect === 'Meteor Rain') {
        this.interval = setInterval(this.meteorRain.bind(this), 5);
      }
    } 

    this.r = state.color.r;
    this.g = state.color.g;
    this.b = state.color.b;

    this.brightness = state.brightness;
    
  }

  run(arg) {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null;
    }

    // Loop every 100 ms
    if (arg === 'off') {
      this.interval = setInterval(this.off.bind(this), 5);
    } else if (arg === 'on') {
      this.interval = setInterval(this.rgb.bind(this), 5);
    } else if (arg === 'shimmer') {
      this.interval = setInterval(this.shimmer.bind(this), 5);
    }

    this.meteor = {
      r: 255,
      g: 255,
      b: 255,
      size: 10,
      decay: 64,
      randomDecay: true,
      delay: 30,
    };

  }

  // White Shimmer
  whiteShimmer() {
    this.phaseR += 0.15 * 1;      
    this.phaseB -= 0.1 * 1;
    this.phaseG += 0.05 * 1;
    this.phaseD -= 0.13 * 1;

    // let r = Math.floor(Math.random() * 255);
    // let g = Math.floor(Math.random() * 255);

    for (let i=0; i < this.config.leds; i++) {
      let amplitudeR = Math.sin(Math.PI/160 * (i + this.phaseR));
      amplitudeR = amplitudeR > 0 ? Math.floor(amplitudeR * 255) : 0;

      let amplitudeB = Math.sin(Math.PI/160 * (i + this.phaseB));
      amplitudeB = amplitudeB > 0 ? Math.floor(amplitudeB * 255) : 0;

      let amplitudeG = Math.sin(Math.PI/160 * (i + this.phaseG));
      amplitudeG = amplitudeG > 0 ? Math.floor(amplitudeG * 255) : 0;

      let amplitudeD = Math.sin(Math.PI/160 * (i + this.phaseD));
      amplitudeD = amplitudeD > 0 ? Math.floor(amplitudeD * 255) : 0;

      let sumB = Math.floor((amplitudeG + amplitudeR + amplitudeB + amplitudeD) / 4);

      this.pixels[i] = (sumB << 16) | (sumB << 8) | sumB;
      // this.pixels[i] = 0;
    }
    this.ws281x.render(this.pixels);
  }

  // RGB Shimmer
  shimmer() {
    let rate = 0.4;
    this.phaseR += 0.15 * rate;     
    this.phaseB -= 0.1 * rate;
    this.phaseG += 0.05 * rate;
    this.phaseD -= 0.1 * rate;

    // let r = Math.floor(Math.random() * 255);
    // let g = Math.floor(Math.random() * 255);

    for (let i=0; i < this.config.leds; i++) {
      let amplitudeR = Math.sin(Math.PI/12 * (i + this.phaseR));
      amplitudeR = amplitudeR > 0 ? Math.floor(amplitudeR * 255) : 0;

      let amplitudeB = Math.sin(Math.PI/8 * (i + this.phaseB));
      amplitudeB = amplitudeB > 0 ? Math.floor(amplitudeB * 255) : 0;

      let amplitudeG = Math.sin(Math.PI/10 * (i + this.phaseG));
      amplitudeG = amplitudeG > 0 ? Math.floor(amplitudeG * 255) : 0;

      let amplitudeD = Math.sin(Math.PI/5 * (i + this.phaseD));
      amplitudeD = amplitudeD > 0 ? Math.floor(amplitudeD * 255) : 0;

      let sumB = amplitudeG + amplitudeR + amplitudeB + amplitudeD;
      let sumR = 0;
      let sumG = 0;
      if (sumB > 255) {
        sumR = sumB - 255;
        sumB = 255;
      }
      if (sumR > 255) {
        sumG = sumR - 255;
        sumR = 255;
      }
      if (sumG > 255) {
        sumB = 0;
        sumG = 255;
      }
      
      if (sumB == 255) {
        sumB = sumB - sumR;
      }
      if (sumR == 255) {
        sumR = sumR - sumG;
      }

      this.pixels[i] = (sumG << 16) | (sumB << 8) | sumR;
      // this.pixels[i] = (sumR << 16) | (sumG << 8) | sumB;
      // this.pixels[i] = 0;
    }
    this.ws281x.render(this.pixels);
  }

  rgb() {
    for (let j = 0; j < this.config.leds; j++) {
      let r = Math.floor(this.r * (this.brightness / 255));
      let g = Math.floor(this.g * (this.brightness / 255));
      let b = Math.floor(this.b * (this.brightness / 255));
      this.pixels[j] = (g << 16) | (r << 8) | b;
    }
    this.ws281x.render(this.pixels);
  }

  white() {
    for (let j = 0; j < this.config.leds; j++) {
      this.pixels[j] = 0xFFFFFF;
    }
    this.ws281x.render(this.pixels);
  }

  meteorRain() {
    // Red, green, blue, meteorSize, meteorTrailDecay, meteorRandomDecay, SpeedDelay 
    if (!this.meteorSettings) {
      this.meteorSettings = {
        current: 0.0,
        fadeRed: [],
        fadeBlue: [],
        fadeGreen: [],
        colorFloat: [],
        red: 255,
        blue: 255,
        green: 255, 
        phase: 0,
      };
    }

    // Draw meteor
    for (let j = 0; j < this.config.leds; j++) {
      if (!this.meteorSettings.colorFloat[j]) {
        this.meteorSettings.colorFloat[j] = {
          r: 0,
          g: 0,
          b: 0,
        };
      }

      if (!this.meteorSettings.fadeRed[j]) {
        this.meteorSettings.fadeRed[j] = Math.floor(Math.random() * 360);
      }
      if (!this.meteorSettings.fadeBlue[j]) {
        this.meteorSettings.fadeBlue[j] = Math.floor(Math.random() * 360);
      }
      if (!this.meteorSettings.fadeGreen[j]) {
        this.meteorSettings.fadeGreen[j] = Math.floor(Math.random() * 360);
      }

      let r = this.meteorSettings.colorFloat[j].r;
      let g = this.meteorSettings.colorFloat[j].g;
      let b = this.meteorSettings.colorFloat[j].b;

      r = (r <= 10) ? 0 : r - Math.abs(Math.sin(Math.PI/360 * (this.meteorSettings.fadeRed[j] + this.meteorSettings.phase))) * 8;
      g = (g <= 10) ? 0 : g - Math.abs(Math.sin(Math.PI/360 * (this.meteorSettings.fadeGreen[j] + this.meteorSettings.phase))) * 8;
      b = (b <= 10) ? 0 : b - Math.abs(Math.sin(Math.PI/360 * (this.meteorSettings.fadeBlue[j] + this.meteorSettings.phase))) * 8;

      if (r == 0) {
        this.meteorSettings.fadeRed[j] = 0;
      }
      if (b == 0) {
        this.meteorSettings.fadeBlue[j] = 0;
      }
      if (g == 0) {
        this.meteorSettings.fadeGreen[j] = 0;
      }
      this.meteorSettings.colorFloat[j].r = r;
      this.meteorSettings.colorFloat[j].g = g;
      this.meteorSettings.colorFloat[j].b = b;

     
      this.pixels[j] = (Math.floor(r) << 16) | (Math.floor(g) << 8) | Math.floor(b);
      // this.pixels[j] = (this.metor.r << 16) | (this.metory.g << 8) | this.metory.b;
      // this.pixels[j] = (this.pixels[j] <= 10) ? 0 : this.pixels[j] - 10;
    }
    this.meteorSettings.phase += 15;
    this.meteorSettings.current += 0.4;

    let currentPixel = Math.floor(this.meteorSettings.current % this.config.leds);
    this.meteorSettings.colorFloat[currentPixel].r = this.meteorSettings.red;
    this.meteorSettings.colorFloat[currentPixel].g = this.meteorSettings.green;
    this.meteorSettings.colorFloat[currentPixel].b = this.meteorSettings.blue;

    let r = Math.floor(this.meteorSettings.colorFloat[currentPixel].r);
    let g = Math.floor(this.meteorSettings.colorFloat[currentPixel].g);
    let b = Math.floor(this.meteorSettings.colorFloat[currentPixel].b);

    this.pixels[currentPixel] = (r << 16) | (g << 8) | b;
    // console.log('current led', this.meteorSettings.current, this.meteorSettings.current % this.config.leds)

    this.ws281x.render(this.pixels);
  }

  off() {
    for (let j = 0; j < this.config.leds; j++) {
      this.pixels[j] = 0;
    }
    this.ws281x.render(this.pixels);
  }
};