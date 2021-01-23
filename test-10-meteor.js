// //Reserved DMA 0, 1, 3, 6, 7, 15
// // Avoid channels 0, 1, 2, 3, 6, 7. 
// // The GPU uses 1, 3, 6, 7. The frame buffer uses 0 and the SD card uses 2.
// // 5 corrupts fs

// var ws281x = require('rpi-ws281x');
 
// class Example {
 
// 	constructor() {
// 		// Current pixel position
// 		this.offset = 0;
 
// 		// Set my Neopixel configuration
// 		this.config = { 
// 			leds: 200,
//       gpio: 10,
//       dma: 11,
//       ledChannel: 1
// 		};

		
// 		// Configure ws281x
// 		ws281x.configure(this.config);
// 	}
 
// 	loop() {
// 		var pixels = new Uint32Array(this.config.leds);
 
// 		// Set a specific pixel
// 		pixels[this.offset] = 0xFF0000;
 
// 		// Move on to next
// 		this.offset = (this.offset + 1) % this.config.leds;
 
// 		// Render to strip
// 		ws281x.render(pixels);
// 	}
 
// 	run() {
// 		// Loop every 100 ms
// 		setInterval(this.loop.bind(this), 10);
// 	}
// };
 
// var example = new Example();
// example.run();


// --

var ws281x = require('rpi-ws281x');
 
class Example {
 
    // constructor() {
    //     this.config = {};
 
    //     // Number of leds in my strip
    //     this.config.leds = 169;
 
    //     // Use DMA 10 (default 10)
    //     this.config.dma = 10;
 
    //     // Set full brightness, a value from 0 to 255 (default 255)
    //     this.config.brightness = 255;
 
    //     // Set the GPIO number to communicate with the Neopixel strip (default 18)
    //     this.config.gpio = 18;
 
    //     // The RGB sequence may vary on some strips. Valid values
    //     // are "rgb", "rbg", "grb", "gbr", "bgr", "brg".
    //     // Default is "rgb".
    //     // RGBW strips are not currently supported.
    //     this.config.type = 'grb';
 
    //     // Configure ws281x
    //     ws281x.configure(this.config);
    // }

		constructor() {
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

			this.pixels = new Uint32Array(this.config.leds);

			
			// Configure ws281x
			ws281x.configure(this.config);
		}

		// loop() {
			
		// 	let ledOffset = Math.floor(Math.random() * this.config.leds - 1);
		// 	// let r = Math.floor(Math.random() * 255);
		// 	// let g = Math.floor(Math.random() * 255);
		// 	let r = 0;
		// 	let g = 0;
		// 	let b = Math.floor(Math.random() * 255);
		// 	this.pixels[ledOffset] = (r << 16) | (g << 8)| b;
		// 	ws281x.render(this.pixels);
		// }

		// loop() {
		// // 3 interacting phases
			
		// 	this.phaseR += 0.15 * 1;			
		// 	this.phaseB -= 0.1 * 1;
		// 	this.phaseG += 0.05 * 1;

		// 	// let r = Math.floor(Math.random() * 255);
		// 	// let g = Math.floor(Math.random() * 255);
		// 	let r = 25;
		// 	let g = 0;
			
		//   for (let i=0; i < this.config.leds; i++) {
		//   	let amplitudeR = Math.sin(Math.PI/40 * (i + this.phaseR));
		//   	amplitudeR = amplitudeR > 0 ? Math.floor(amplitudeR * 255) : 0;

		//   	let amplitudeB = Math.sin(Math.PI/25 * (i + this.phaseB));
		//   	amplitudeB = amplitudeB > 0 ? Math.floor(amplitudeB * 255) : 0;

		//   	let amplitudeG = Math.sin(Math.PI/35 * (i + this.phaseG));
		//   	amplitudeG = amplitudeG > 0 ? Math.floor(amplitudeG * 255) : 0;


		// 		this.pixels[i] = (amplitudeR << 16) | (amplitudeG << 8) | amplitudeB;
		// 	}
		// 	ws281x.render(this.pixels);
		// }

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
			ws281x.render(this.pixels);
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
			ws281x.render(this.pixels);
		}


		// loop() {
		//   this.twinkleRandom({ count:20, OnlyOne: 0 });
		// }

		// twinkleRandom({ count, OnlyOne }) {
		  
		//   for (let i=0; i < this.config.leds; i++) {
		// 	  this.pixels[i] = 0;
		// 	}
		 
		//   for (let i=0; i < count; i++) {
		//     let ledOffset = Math.floor(Math.random() * this.config.leds);
		// 		let r = Math.floor(Math.random() * 255);
		// 		let g = Math.floor(Math.random() * 255);
		// 		let b = Math.floor(Math.random() * 255);			
		//     this.pixels[ledOffset] = (r << 16) | (g << 8) | b;
		//   }
		//   ws281x.render(this.pixels);
		 
		// }
	 
    run() {
      // Loop every 100 ms
      // setInterval(this.off.bind(this), 5);
      // setInterval(this.loop.bind(this), 5);
      setInterval(this.shimmer.bind(this), 5);
      // setIpnterval(this.whiteShimmer.bind(this), 5);
      // setInterval(this.meteorRain.bind(this), 15);
      // setInterval(this.white.bind(this), 5);
      

      // meteorRain(0xff, 0xff, 0xff, 10, 64, true, 30);
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

    white() {
      for (let j = 0; j < this.config.leds; j++) {
        this.pixels[j] = 0xFFFFFF;
      }
      ws281x.render(this.pixels);
    }

    meteorRain() {

      // red, green, blue, meteorSize, meteorTrailDecay, meteorRandomDecay, SpeedDelay 
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

      // draw meteor
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
      this.meteorSettings.colorFloat.r[currentPixel] = this.meteorSettings.red;
      this.meteorSettings.colorFloat.g[currentPixel] = this.meteorSettings.green;
      this.meteorSettings.colorFloat.b[currentPixel] = this.meteorSettings.blue;

      let r = Math.floor(this.meteorSettings.colorFloat.r[currentPixel]);
      let g = Math.floor(this.meteorSettings.colorFloat.g[currentPixel]);
      let b = Math.floor(this.meteorSettings.colorFloat.b[currentPixel]);

      this.pixels[currentPixel] = (r << 16) | (g << 8) | b;
      // console.log('current led', this.meteorSettings.current, this.meteorSettings.current % this.config.leds)

      ws281x.render(this.pixels);

    }

    off() {
      for (let j = 0; j < this.config.leds; j++) {
        this.pixels[j] = 0;
      }
      ws281x.render(this.pixels);
    }

    // v1
    // meteorRain() {

    //   // red, green, blue, meteorSize, meteorTrailDecay, meteorRandomDecay, SpeedDelay 
    //   if (!this.meteorSettings) {
    //     this.meteorSettings = {
    //       current: 0.0,
    //       fadeRed: [],
    //       fadeBlue: [],
    //       fadeGreen: [],
    //       red: 255,
    //       blue: 255,
    //       green: 255, 
    //     };
    //   }

    //   // draw meteor
    //   for (let j = 0; j < this.config.leds; j++) {

    //     if (!this.meteorSettings.fadeRed[j]) {
    //       this.meteorSettings.fadeRed[j] = Math.floor(Math.random() * 4) + 2;
    //     }
    //     if (!this.meteorSettings.fadeBlue[j]) {
    //       this.meteorSettings.fadeBlue[j] = Math.floor(Math.random() * 4) + 2;
    //     }
    //     if (!this.meteorSettings.fadeGreen[j]) {
    //       this.meteorSettings.fadeGreen[j] = Math.floor(Math.random() * 4) + 2;
    //     }

    //     let fadeValue;
    //     let oldColor = this.pixels[j];
    //     let r = (oldColor & 0xff0000) >> 16;
    //     let g = (oldColor & 0x00ff00) >> 8;
    //     let b = (oldColor & 0x0000ff);

    //     r = (r <= 10) ? 0 : r - this.meteorSettings.fadeRed[j];
    //     b = (b <= 10) ? 0 : b - this.meteorSettings.fadeBlue[j];
    //     g = (g <= 10) ? 0 : g - this.meteorSettings.fadeGreen[j];

    //     if (r == 0) {
    //       this.meteorSettings.fadeRed[j] = 0;
    //     }
    //     if (b == 0) {
    //       this.meteorSettings.fadeBlue[j] = 0;
    //     }
    //     if (g == 0) {
    //       this.meteorSettings.fadeGreen[j] = 0;
    //     }
       
    //     this.pixels[j] = (r << 16) | (g << 8) | b;
    //     // this.pixels[j] = (this.metor.r << 16) | (this.metory.g << 8) | this.metory.b;
    //     // this.pixels[j] = (this.pixels[j] <= 10) ? 0 : this.pixels[j] - 10;
    //   }

    //   this.meteorSettings.current += 0.4;
    //   this.pixels[Math.floor(this.meteorSettings.current % this.config.leds)] = (this.meteorSettings.red << 16) | (this.meteorSettings.blue << 8) | this.meteorSettings.green;
    //   // console.log('current led', this.meteorSettings.current, this.meteorSettings.current % this.config.leds)

    //   ws281x.render(this.pixels);

    // }

    // loop() {
    // 	for (let j = 0; j < this.config.leds; j++) {
    // 		this.pixels[j] = 0;
    // 	}
    // 	ws281x.render(this.pixels);
    // }
 
 			// // fade brightness all LEDs one step
	   //  for (let j = 0; j < this.config.leds; j++) {
	   //  	let rand = Math.floor(Math.random() * 10); 
	   //    if ((!) || (rand > 5)) {
	   //      this.fadeToBlack(j, this.meteor.decay);
	   //    }
	   //  }
      
	   //  // draw meteor
	   //  for (let j = 0; j < this.meteor.size; j++) {
	   //    if ((i - j < this.config.leds) && (i - j >= 0)) {
	   //      this.pixels[offset] = (this.metory.r << 16) | (this.metory.g << 8)| this.metory.b;
	   //    }
	   //  }
   
//     showStrip();
//     delay(SpeedDelay);
//   }
// }

    // }

    // fadeToBlack(offset) {
    // 	oldColor = this.pixels[offset];
    // 	r = (oldColor & 0xff0000) >> 16;
    // 	g = (oldColor & 0x00ff00) >> 8;
    // 	b = (oldColor & 0x0000ff);

	   //  r = (r <= 10) ? 0 : r - (r * fadeValue / 256);
	   //  g = (g <= 10) ? 0 : g - (g * fadeValue / 256);
	   //  b = (b <= 10) ? 0 : b - (b * fadeValue / 256);
	   
	   //  this.pixels[offset] = (r << 16) | (g << 8)| b;
    // }
 
    
};
 
var example = new Example();
example.run();

// void loop() {
//   meteorRain(0xff, 0xff, 0xff, 10, 64, true, 30);
// }




// byte red, byte green, byte blue, byte meteorSize, byte meteorTrailDecay, boolean meteorRandomDecay, int SpeedDelay) {  
//   setAll(0,0,0);
 
//   for(int i = 0; i < NUM_LEDS+NUM_LEDS; i++) {
   
   
//     // fade brightness all LEDs one step
//     for(int j=0; j<NUM_LEDS; j++) {
//       if( (!	) || (random(10)>5) ) {
//         fadeToBlack(j, meteorTrailDecay );        
//       }
//     }
   
//     // draw meteor
//     for(int j = 0; j < meteorSize; j++) {
//       if( ( i-j <NUM_LEDS) && (i-j>=0) ) {
//         setPixel(i-j, red, green, blue);
//       }
//     }
   
//     showStrip();
//     delay(SpeedDelay);
//   }
// }

// void fadeToBlack(int ledNo, byte fadeValue) {
//  #ifdef ADAFRUIT_NEOPIXEL_H
//     // NeoPixel
//     uint32_t oldColor;
//     uint8_t r, g, b;
//     int value;
   
//     oldColor = strip.getPixelColor(ledNo);
//     r = (oldColor & 0x00ff0000UL) >> 16;
//     g = (oldColor & 0x0000ff00UL) >> 8;
//     b = (oldColor & 0x000000ffUL);

//     r=(r<=10)? 0 : (int) r-(r*fadeValue/256);
//     g=(g<=10)? 0 : (int) g-(g*fadeValue/256);
//     b=(b<=10)? 0 : (int) b-(b*fadeValue/256);
   
//     strip.setPixelColor(ledNo, r,g,b);
//  #endif 
// }