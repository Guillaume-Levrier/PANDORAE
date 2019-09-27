//Blood Dragon PANDORAE Theme JS
//The mount Fuji SVG file is loaded separately
// 1 - D3 SUN
// The sun is a D3 SVG circle with SVG glow filters, masks and random CSS flickering.
const sun = () => {

    let svg = d3.select("body").append("svg")
                                .attr("id","sun")
                                .attr("class","purgeable")
                                .attr("width", window.innerWidth)
                                .attr("height", window.innerHeight)
                                .style("position","absolute")
                                .style("z-index","2")
                                .style("top","0px")
                                .style("animation","flicker var(--animation-time) ease alternate infinite");

//Make it glow randomly, cf https://css-tricks.com/random-numbers-css/
function setProperty(duration) {
    document.getElementById('sun').style.setProperty('--animation-time', duration +'s');
}

function changeAnimationTime() {
  const animationDuration = Math.random();
  if (document.getElementById('sun')!=null){
  setProperty(animationDuration);
    }
}

setInterval(changeAnimationTime, Math.random()*1000);


        const defs = svg.append("defs");
        const linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");

// Create the linear gradient, used to colour the circle
        linearGradient
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%");
      
        linearGradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "#FF5505");
        
        linearGradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "#33FAFF");
      
          let data = [Array(1).keys()];
      
// Create the Mask rectangles, i.e. the parts of the circle made invisible (glow included).

        var mask = svg
           .append("defs")
           .append("mask")
           .attr("id", "sunMask");
      
        mask.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", window.innerWidth)
          .attr("height", window.innerHeight/3)
          .style("fill", "white")
          .style("opacity", 0.9);
      
          mask.append("rect")
          .attr("x", 0)
          .attr("y", (window.innerHeight/3)+20)
          .attr("width", window.innerWidth)
          .attr("height", 40)
          .style("fill", "white")
          .style("opacity", 0.9);
      
          mask.append("rect")
          .attr("x", 0)
          .attr("y", (window.innerHeight/3)+75)
          .attr("width", window.innerWidth)
          .attr("height", 35)
          .style("fill", "white")
          .style("opacity", 0.9);
      
      
          mask.append("rect")
          .attr("x", 0)
          .attr("y", (window.innerHeight/3)+125)
          .attr("width", window.innerWidth)
          .attr("height", 30)
          .style("fill", "white")
          .style("opacity", 0.9);
      
          mask.append("rect")
          .attr("x", 0)
          .attr("y", (window.innerHeight/3)+160)
          .attr("width", window.innerWidth)
          .attr("height", 25)
          .style("fill", "white")
          .style("opacity", 0.9);
      

var g = svg.append("g"); // Create a SVG group to host the sun

//add ripple effect to the glow
//when the sun opacity goes down
//so does this dark transparent rectangle
//which makes the background canvas shine  

        g.append("rect")                                 
        .attr("x", 0)                                     
        .attr("y", 0)                                   
        .style("fill","rgba(0,0,0,0.3)")                
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

          g.selectAll("circle")  // The sun is  a D3 SVG circle
          .data(data).enter()
          .append("circle")
            .attr("cx", window.innerWidth/2)    // Center it horizontally
            .attr("cy", window.innerHeight/3)   // Place it top-center vertically
            .attr("r", window.innerWidth/5)     // Radius is a fifth of the window width
            .attr("mask", "url(#sunMask)")      // Add the masking (lines on which the circle disappears)
            .style("fill","url(#linear-gradient)") // Add the gradient
            .style("filter" , "url(#glow)");       // Add the glow
      
      
      
            //Bremer Glow - cf http://bl.ocks.org/nbremer/d3189be2788ad3ca825f665df36eed09
            var filter = defs.append("filter")
                  .attr("id","glow");
                  
              filter.append("feGaussianBlur")
                  .attr("stdDeviation","20")
                  .attr("result","coloredBlur");
      
              var feMerge = filter.append("feMerge");
              feMerge.append("feMergeNode")
                  .attr("in","coloredBlur");
              feMerge.append("feMergeNode")
                  .attr("in","SourceGraphic");
                  
}

// 2 - VORONOI
/** By ge1doot https://codepen.io/ge1doot/pen/PaMdZE
 * Ported from "Sketch of Voronoi"
 * http://alumican.net/#/c/cells
 * Dead Code Preservation: http://wa.zozuar.org/code.php?c=iNy0
 * Fortune's algorithm - Wikipedia, the free encyclopedia
 * @see http://en.wikipedia.org/wiki/Fortune's_algorithm
 * C++ reference https://www.cs.hmc.edu/~mbrubeck/voronoi.html
 */

 // Not much difference from the original version
 // Pointer effects have been disabled for performance enhancement
 // a tiny bit of glow has been added, and colors were changed

const voronoiBackground = () =>
{
    let canvas = document.createElement("CANVAS");
    canvas.id ="spaceVoronoi";
    canvas.className +="purgeable";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.insertBefore(canvas,document.getElementById("signal"));

    canvas = {
        
		init() {
            this.elem = document.getElementById("spaceVoronoi");
			this.resize();
			window.addEventListener("resize", () => this.resize(), false);
			return this.elem.getContext("2d", {lowLatency: true,alpha:true});
		},
		resize() {
			this.width = this.elem.width = this.elem.offsetWidth;
			this.height = this.elem.height = this.elem.offsetHeight;
			//pointer.mag = Math.min(this.width, this.height) * 0.05;
		}
	};
	const pointer = {
		x: 0.0,
		y: 0.0,
		ox: 0.0,
		oy: 0.0,
		mag: 0.0,
		ms2: 0.0,
		move(e, touch) {
			e.preventDefault();
			const pointer = touch ? e.targetTouches[0] : e;
			this.x = pointer.clientX;
			this.y = pointer.clientY;
		},
		save() {
			const mvx = this.x - this.ox;
			const mvy = this.y - this.oy;
			this.ms2 = Math.sqrt(mvx * mvx + mvy * mvy);
			this.ox = this.x;
			this.oy = this.y;
		},
		init(canvas) {
			//canvas.elem.addEventListener("mousemove", e => this.move(e, false), false);
			//canvas.elem.addEventListener("touchmove", e => this.move(e, true), false);
		}
	};
	const ctx = canvas.init();
	//pointer.init(canvas);
	////////////////////////////////////////////////////
	let seed = 1;
	const random = _ => {
		seed = (seed * 16807) % 2147483647;
		return (seed - 1) / 2147483646;
	};
	class Point {
		constructor() {
			this.x = 0.0;
			this.y = 0.0;
			this.vx = 0.0;
			this.vy = 0.0;
		}
		init() {
			const angle = random() * 2 * Math.PI;
			this.x = canvas.width * 0.5 + (random() - 0.5) * 10;
			this.y = canvas.height * 0.5 + (random() - 0.5) * 10;
			this.vx = 2.5 * Math.cos(angle);
			this.vy = 2.5 * Math.sin(angle);
		}
		move() {
			if (
				this.x < 0 ||
				this.x > canvas.width ||
				this.y < 0 ||
				this.y > canvas.height
			) {
				this.init();
				return;
			}
			const dx = this.x - pointer.x;
			const dy = this.y - pointer.y;
			const dist2 = dx * dx + dy * dy;
			const angle = Math.atan2(dy, dx);
			const power = pointer.mag / dist2 * pointer.ms2;
			this.vx += power * Math.cos(angle);
			this.vy += power * Math.sin(angle);
			this.x += this.vx;
			this.y += this.vy;
		}
	}
	class Arc {
		constructor(p, prev, next) {
			this.p     = p;
			this.next  = next;
			this.prev  = prev;
			this.v0    = null;
			this.v1    = null;
			this.left  = null;
			this.right = null;
			this.endP  = null;
			this.endX  = 0.0;
		}
	}
	////////////////////////////////////////////////////
	const N = 200;
	const points = [];
	// init
	for (let i = 0; i < N; ++i) {
		const p = new Point();
		p.init();
		points[i] = p;
	}
	const intersection = ( p0, p1, l, res) => {
		let p = p0, ll = l * l;
		if ( p0.x === p1.x ) res.y = ( p0.y + p1.y ) / 2;
		else if ( p1.x === l ) res.y = p1.y;
		else if ( p0.x === l ) {
			res.y = p0.y;
			p = p1;
		} else {
			const z0 = 0.5 / ( p0.x - l );
			const z1 = 0.5 / ( p1.x - l );
			const a = z0 - z1;
			const b = -2 * ( p0.y * z0 - p1.y * z1 );
			const c = ( p0.y * p0.y + p0.x * p0.x - ll ) * z0 - ( p1.y * p1.y + p1.x * p1.x - ll ) * z1;
			res.y = ( - b - Math.sqrt ( b * b - 4 * a * c ) ) / ( 2 * a );
		}
		res.x = ( p.x * p.x + ( p.y - res.y ) * ( p.y - res.y ) - ll ) / ( 2 * p.x - 2 * l );
		return res;
	}
	const fortune = () => {
		let o = new Point();
		let root = null;
		let a = null;
		let b = null;
		let c = null;
		let d = null;
		let next = null;
		let eventX = 0;
		let w = points[0].x;
		for (let i = 1; i < N; i++) {
			const p = points[i];
			const x = p.x;
			if (x < w) {
				let j = i;
				while (j > 0 && points[j - 1].x > x) {
					points[j] = points[j - 1];
					j--;
				}
				points[j] = p;
			} else w = x;
		}
		const x0 = points[0].x;
		let i = 0;
		let p = points[0];
		let x = p.x;
		for (;;) {
			if (a !== null) {
				let circle = false;
				if (a.prev !== null && a.next !== null) {
					const aa = a.prev.p;
					const bb = a.p;
					const cc = a.next.p;
					let A = bb.x - aa.x;
					let B = bb.y - aa.y;
					const C = cc.x - aa.x;
					const D = cc.y - aa.y;
					if (A * D - C * B <= 0) {
						const E = A * (aa.x + bb.x) + B * (aa.y + bb.y);
						const F = C * (aa.x + cc.x) + D * (aa.y + cc.y);
						const G = 2 * (A * (cc.y - bb.y) - B * (cc.x - bb.x));
						if (G !== 0) {
							o.x = (D * E - B * F) / G;
							o.y = (A * F - C * E) / G;
							A = aa.x - o.x;
							B = aa.y - o.y;
							eventX = o.x + Math.sqrt(A * A + B * B);
							if (eventX >= w) circle = true;
						}
					}
				}
				if (a.right !== null) a.right.left = a.left;
				if (a.left !== null) a.left.right = a.right;
				if (a === next) next = a.right;
				if (circle === true) {
					a.endX = eventX;
					if (a.endP !== null) {
						a.endP.x = o.x;
						a.endP.y = o.y;
					} else {
						a.endP = o;
						o = new Point();
					}
					d = next;
					if (d === null) {
						next = a;
					} else
						for (;;) {
							if (d.endX >= eventX) {
								a.left = d.left;
								if (d.left !== null) d.left.right = a;
								if (next === d) next = a;
								a.right = d;
								d.left = a;
								break;
							}
							if (d.right === null) {
								d.right = a;
								a.left = d;
								a.right = null;
								break;
							}
							d = d.right;
						}
				}
				if (b !== null) {
					a = b;
					b = null;
					continue;
				}
				if (c !== null) {
					a = c;
					c = null;
					continue;
				}
				a = null;
			}
			if (next !== null && next.endX <= x) {
				a = next;
				next = a.right;
				if (next !== null) next.left = null;
				a.right = null;
				if (a.prev !== null) {
					a.prev.next = a.next;
					a.prev.v1 = a.endP;
				}
				if (a.next !== null) {
					a.next.prev = a.prev;
					a.next.v0 = a.endP;
				}
				ctx.moveTo(a.v0.x, a.v0.y);
				ctx.lineTo(a.endP.x, a.endP.y);
				ctx.lineTo(a.v1.x, a.v1.y);
				d = a;
				w = a.endX;
				if (a.prev !== null) {
					b = a.prev;
					a = a.next;
				} else {
					a = a.next;
					b = null;
				}
			} else {
				if (p === null) break;
				if (root === null) {
					root = new Arc(p, null, null);
				} else {
					let z = new Point();
					a = root.next;
					if (a !== null) {
						while (a.next !== null) {
							a = a.next;
							if (a.p.y >= p.y) break;
						}
						intersection(a.prev.p, a.p, p.x, z);
						if (z.y <= p.y) {
							while (a.next !== null) {
								a = a.next;
								intersection(a.prev.p, a.p, p.x, z);
								if (z.y >= p.y) {
									a = a.prev;
									break;
								}
							}
						} else {
							a = a.prev;
							while (a.prev !== null) {
								a = a.prev;
								intersection(a.p, a.next.p, p.x, z);
								if (z.y <= p.y) {
									a = a.next;
									break;
								}
							}
						}
					} else a = root;
					if (a.next !== null) {
						b = new Arc(a.p, a, a.next);
						a.next.prev = b;
						a.next = b;
					} else {
						b = new Arc(a.p, a, null);
						a.next = b;
					}
					a.next.v1 = a.v1;
					z.y = p.y;
					z.x =
						(a.p.x * a.p.x + (a.p.y - p.y) * (a.p.y - p.y) - p.x * p.x) /
						(2 * a.p.x - 2 * p.x);
					b = new Arc(p, a, a.next);
					a.next.prev = b;
					a.next = b;
					a = a.next;
					a.prev.v1 = z;
					a.next.v0 = z;
					a.v0 = z;
					a.v1 = z;
					b = a.next;
					a = a.prev;
					c = null;
					w = p.x;
				}
				i++;
				if (i >= N) {
					p = null;
					x = 999999;
				} else {
					p = points[i];
					x = p.x;
				}
			}
		}
	};
	//////////////////////////////////////////////////////
	const run = () => {
		requestAnimationFrame(run);
		ctx.fillStyle = "rgb(37,37,70)";
		
		ctx.strokeStyle = "#f257ef";
		ctx.filter = 'drop-shadow(0px 0px 3px rgb(255,0,255))';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		for (const point of points) point.move();
		ctx.beginPath();
		fortune();
		ctx.stroke();
		
		pointer.save();
	};
	run();
}

// 3 - CityScape
// based on ge1doot's All Gone (No Escape III) https://codepen.io/ge1doot/details/xmWyrM
// Increased speed, number of plates generated (1->3), and different camera perspective
// base64 remains the same but is generated by the function instead
// Color has been changed to fit the theme.
// SetTimeout function lets the thread load the image to make it available for decoding.


    let imageURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAAAAADRE4smAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE82lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAxLTA1VDE4OjMxOjM1KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wMS0wNVQxODozMjoxMSswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wMS0wNVQxODozMjoxMSswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OGU2YzBmYjEtYTVjOS02MzQ0LTg0YzQtNzhiNTFlNTkyY2FmIiB4bXBNTTpEb2N1bWVudElE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a2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAxLTA1VDE4OjMxOjM1KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wMS0wNVQxODozMjoxMSswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wMS0wNVQxODozMjoxMSswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OGU2YzBmYjEtYTVjOS02MzQ0LTg0YzQtNzhiNTFlNTkyY2FmIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhlNmMwZmIxLWE1YzktNjM0NC04NGM0LTc4YjUxZTU5MmNhZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjhlNmMwZmIx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";
   
    const cityScape = () =>{
        ////////////////////////////////////////////////////////////////
    

    var baseImg = d3.select("body").append("img")
                                .attr("id","heightmap")
                                .attr("src",imageURI)
                                .style("display","none");
                                
        baseImg.className +="purgeable";

        let canvas = document.createElement("canvas");
        canvas.id ="allgone-noescape3";
        canvas.className +="purgeable";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = "absolute";
        canvas.style.top = "0px";
        canvas.style.left = "0px";
        canvas.style.zIndex = 3;


        let mask = document.createElement('img');
        mask.id = "mask";
        mask.className +="themeCustom";
        mask.className +=" purgeable";

       
setTimeout(()=> {  

    document.body.insertBefore(canvas,document.getElementById("signal"));
    document.body.insertBefore(mask,document.getElementById("allgone-noescape3"));
      
    canvas = {
        init() {
            this.elem = document.getElementById("allgone-noescape3");
            const gl = this.elem.getContext("webgl", { alpha: true });
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(vertexShader,	`
                uniform mat4 camProj, camView;
                attribute vec3 aPosition, aNormal;
                varying vec3 vColor;
                const vec3 lightDir = vec3(0, 1, 0);
                const vec3 lightColor = 1.0 * vec3(0.35, 0.33, 0.05);
                void main(void) {
                    vec3 normal = mat3(camView) * aNormal;
                    vec4 pos = camView * vec4(aPosition, 1.0);
                    vColor = (lightColor * dot(normal, lightDir) + 0.3 * aPosition.y - 0.8);
                    vColor = mix(vColor, vec3(-5.2 * pos.y, -3.5 * pos.y, -7.8 * pos.y), 0.01);
                    gl_Position = camProj * pos; 
                }
            `
            );
            gl.shaderSource(fragmentShader,	`
                precision highp float;
                varying vec3 vColor;
                void main(void) {
                    gl_FragColor = vec4(vColor, 1.0);
                }
            `
            );
            gl.compileShader(vertexShader);
            gl.compileShader(fragmentShader);
            this.program = gl.createProgram();
            gl.attachShader(this.program, vertexShader);
            gl.attachShader(this.program, fragmentShader);
            gl.linkProgram(this.program);
            gl.useProgram(this.program);
            return gl;
        },
        resize() {
            this.width = this.elem.width = this.elem.offsetWidth;
            this.height = this.elem.height = this.elem.offsetHeight;
            camera.proj.perspective(60, this.width / this.height).load();
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }
    };
    ////////////////////////////////////////////////////////////////
    const Mat4 = class {
        constructor(program, uName) {
            this.u = gl.getUniformLocation(program, uName);
            this.data = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        }
        identity() {
            const d = this.data;
            d[0] = 1;
            d[1] = 0;
            d[2] = 0;
            d[3] = 0;
            d[4] = 0;
            d[5] = 1;
            d[6] = 0;
            d[7] = 0;
            d[8] = 0;
            d[9] = 0;
            d[10] = 1;
            d[11] = 0;
            d[12] = 0;
            d[13] = 0;
            d[14] = 0;
            d[15] = 1;
            return this;
        }
        translate(x, y, z) {
            const d = this.data;
            d[12] = d[0] * x + d[4] * y + d[8] * z + d[12];
            d[13] = d[1] * x + d[5] * y + d[9] * z + d[13];
            d[14] = d[2] * x + d[6] * y + d[10] * z + d[14];
            d[15] = d[3] * x + d[7] * y + d[11] * z + d[15];
            return this;
        }
        rotateX(angle) {
            const d = this.data;
            const s = Math.sin(angle);
            const c = Math.cos(angle);
            const a10 = d[4];
            const a11 = d[5];
            const a12 = d[6];
            const a13 = d[7];
            const a20 = d[8];
            const a21 = d[9];
            const a22 = d[10];
            const a23 = d[11];
            d[4] = a10 * c + a20 * s;
            d[5] = a11 * c + a21 * s;
            d[6] = a12 * c + a22 * s;
            d[7] = a13 * c + a23 * s;
            d[8] = a10 * -s + a20 * c;
            d[9] = a11 * -s + a21 * c;
            d[10] = a12 * -s + a22 * c;
            d[11] = a13 * -s + a23 * c;
            return this;
        }
        rotateY(angle) {
            const d = this.data;
            const s = Math.sin(angle);
            const c = Math.cos(angle);
            const a00 = d[0];
            const a01 = d[1];
            const a02 = d[2];
            const a03 = d[3];
            const a20 = d[8];
            const a21 = d[9];
            const a22 = d[10];
            const a23 = d[11];
            d[0] = a00 * c + a20 * -s;
            d[1] = a01 * c + a21 * -s;
            d[2] = a02 * c + a22 * -s;
            d[3] = a03 * c + a23 * -s;
            d[8] = a00 * s + a20 * c;
            d[9] = a01 * s + a21 * c;
            d[10] = a02 * s + a22 * c;
            d[11] = a03 * s + a23 * c;
            return this;
        }
        perspective(fov, aspect) {
            const d = this.data;
            const near = 0.02;
            const far = 100;
            const top = near * Math.tan(fov * Math.PI / 360);
            const right = top * aspect;
            const left = -right;
            const bottom = -top;
            d[0] = 2 * near / (right - left);
            d[1] = 0;
            d[2] = 0;
            d[3] = 0;
            d[4] = 0;
            d[5] = 2 * near / (top - bottom);
            d[6] = 0;
            d[7] = 0;
            d[8] = (right + left) / (right - left);
            d[9] = (top + bottom) / (top - bottom);
            d[10] = -(far + near) / (far - near);
            d[11] = -1;
            d[12] = 0;
            d[13] = 0;
            d[14] = -(2 * far * near) / (far - near);
            d[15] = 0;
            return this;
        }
        load() {
            gl.uniformMatrix4fv(this.u, gl.FALSE, this.data);
            return this;
        }
    };
    ////////////////////////////////////////////////////////////////
    const gl = canvas.init();
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    const camera = {
        proj: new Mat4(canvas.program, "camProj").load(),
        view: new Mat4(canvas.program, "camView").load()
    };
    canvas.resize();
    window.addEventListener("resize", () => canvas.resize(), false);
    ////////////////////////////////////////////////////////////////
    const decodeHeightMap = () => {
        const width = 512;
        const height = 512;
        const img = document.getElementById("heightmap");
        const cmap = document.createElement("canvas");
        cmap.width = width;
        cmap.height = height;
        const cty = cmap.getContext("2d");
        cty.drawImage(img, 0, 0);
        const hmap = cty.getImageData(0, 0, width, height).data;
        const readPixel = (x, y) => hmap[(y * width + x) * 4];
        const freePixel = (x, y) => hmap[(y * width + x) * 4 + 3] !== 0;
        const Rect = class {
            constructor(x, y, w, h) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
                this.c = readPixel(x, y);
            }
            draw() {
                for (let x = this.x; x < this.x + this.w; x++) {
                    for (let y = this.y; y < this.y + this.h; y++) {
                        hmap[(y * width + x) * 4 + 3] = 0;
                    }
                }
                if (this.c > 32) iV = concat(vertices, cube(
                    (this.x - width * 0.5) * 0.1, 
                    (this.y - height * 0.5) * 0.1, 
                    this.w * 0.1, 
                    this.c * 0.025, 
                    this.h * 0.1
                ), iV);
            }
            grow() {
                let w = this.w;
                let h = this.h;
                let s = true;
                do {
                    w++;
                    h++;
                    s = this.sameColorV(this.x, this.y, w, h) && this.sameColorH(this.x, this.y, w, h);
                } while (s);
                w--;
                h--;
                const c1 = readPixel(this.x, this.y + h);
                if (this.c === c1 && freePixel(this.x, this.y + h) === true) {
                    do {
                        h++;
                        s = this.sameColorV(this.x, this.y, w, h);
                    } while (s);
                    h--;
                } else {
                    const c1 = readPixel(this.x + w, this.y);
                    if (this.c === c1 && freePixel(this.x + w, this.y) === true) {
                        do {
                            w++;
                            s = this.sameColorH(this.x, this.y, w, h);
                        } while (s);
                        w--;
                    }
                }
                this.w = w;
                this.h = h;
            }
            sameColorV(x0, y0, w, h) {
                const c0 = readPixel(x0, y0);
                for (let x = x0; x < x0 + w; x++) {
                    const c = readPixel(x, y0 + h - 1);
                    if (c !== c0 || freePixel(x, y0 + h - 1) === false) return false;
                }
                return true;
            }
            sameColorH(x0, y0, w, h) {
                const c0 = readPixel(x0, y0);
                for (let y = y0; y < y0 + h; y++) {
                    const c = readPixel(x0 + w - 1, y);
                    if (c !== c0 || freePixel(x0 + w - 1, y) === false) return false;
                }	
                return true;
            }
        };
        const vertices = new Float32Array(2000000);
        let iV = 0;
        const cube = (x, z, l, h, w) => [
            x,h,z,0,1,0,x,h,z+w,0,1,0,x+l,h,z+w,0,1,0,x,h,z,0,1,0,x+l,h,z+w,0,1,0,x+l,h,z,0,1,0,
            x,0,z,-1,0,0,x,0,z+w,-1,0,0,x,h,z+w,-1,0,0,x,0,z,-1,0,0,x,h,z+w,-1,0,0,x,h,z,-1,0,0,
            x+l,0,z,1,0,0,x+l,h,z,1,0,0,x+l,h,z+w,1,0,0,x+l,0,z,1,0,0,x+l,h,z+w,1,0,0,x+l,0,z+w,1,0,0,
            x,0,z,0,0,-1,x,h,z,0,0,-1,x+l,h,z,0,0,-1,x,0,z,0,0,-1,x+l,h,z,0,0,-1,x+l,0,z,0,0,-1,
            x,0,z+w,0,0,1,x+l,0,z+w,0,0,1,x+l,h,z+w,0,0,1,x,0,z+w,0,0,1,x+l,h,z+w,0,0,1,x,h,z+w,0,0,1
        ];
        const attribute = (program, name, data, size, stride, offset) => {
            if (data !== null) {
                const buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            }
            const index = gl.getAttribLocation(program, name);
            gl.enableVertexAttribArray(index);
            gl.vertexAttribPointer(index, size, gl.FLOAT, false, stride, offset);
        };
        const concat = (a1, a2, index) => {
            for (let i = 0, l = a2.length; i < l; i++) {
                a1[index++] = a2[i];
            }
            return index;
        };
        let nr = 0;
        const heap = [[0,0]];
        do {
            const c = heap.shift();
            if (freePixel(c[0], c[1]) === true) {
                const r = new Rect(c[0], c[1], 1, 1);
                r.grow();
                r.draw();
                if (r.y + r.h < height && freePixel(r.x, r.y + r.h) === true) heap.push([r.x, r.y + r.h]);
                if (r.x + r.w < width && freePixel(r.x + r.w, r.y) === true) heap.push([r.x + r.w, r.y]);
            }
        } while (heap.length);
        attribute(canvas.program, "aPosition", vertices, 3, 24, 0);
        attribute(canvas.program, "aNormal", null, 3, 24, 12);
        return iV / 6;
    }
    let numElements = decodeHeightMap();
    ////////////////////////////////////////////////////////////////
    let ry = 51.2, time = 0, dt = 0.0200;
    let rx = 0.5 * Math.PI * Math.floor(Math.random() * 4);
    const run = (newTime) => {
        requestAnimationFrame(run);
        let d = 0.3 * (newTime - time);
        if (d > 0.6) d = 0.6;
        dt += (d - dt) * 0.2;
        time = newTime;
        ry += dt;
        let cameraHorizon = 0.05;
        camera.view
            .identity()
            .rotateX(cameraHorizon)
            .translate(0.15, -13, ry % 51.2)
            .rotateY(rx)
            .load();
        gl.drawArrays(gl.TRIANGLES, 0, numElements);
        camera.view
            .identity()
            .rotateX(cameraHorizon)
            .translate(0.15, -13, -51.2 + ry % 51.2)
            .rotateY(rx)
            .load();
        gl.drawArrays(gl.TRIANGLES, 0, numElements);
        camera.view
            .identity()
            .rotateX(cameraHorizon)
            .translate(0.15, -13, -102.4 + ry % 51.2)
            .rotateY(rx)
            .load();
        gl.drawArrays(gl.TRIANGLES, 0, numElements);
        camera.view
            .identity()
            .rotateX(cameraHorizon)
            .translate(0.15, -13, -153.6 + ry % 51.2)
            .rotateY(rx)
            .load();
        gl.drawArrays(gl.TRIANGLES, 0, numElements);
    };
    requestAnimationFrame(run);
},10);

}

/* const consoleRoll = () => {

    const readInterface = readline.createInterface({
      input: fs.createReadStream(appPath + "/js/types.js"),
      output: process.stdout,
      console: false
  });
  
  let rollCall = []
  
  readInterface.on('line', line => {
    rollCall.push(line)
  });
  
  let i = 0;
  var rollInt = setInterval(() => {
    addToLog(rollCall[i]+'\n')
    i++
    if (i===500) {clearInterval(rollInt)}
  }, 50);
  
  } */

//module.exports = () => {sun();cityScape();voronoiBackground();consoleRoll();};