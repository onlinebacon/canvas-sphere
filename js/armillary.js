import SphereDrawer from './sphere-drawer.js';

const { PI } = Math;
const D90 = PI/2;
const TAU = Math.PI*2;
const skyColor = 'rgba(64, 64, 96, 0.2)';
const skyGridColor = 'rgba(64, 127, 255, 0.3)';
const earthColor = '#456';
const earthGridColor = '#68a';
const n = 18;

export default class Armillary {
	constructor(ctx) {
		this.ctx = ctx;
		this.sd = new SphereDrawer(ctx);
		this.x = 0;
		this.y = 0;
		this.earthRad = 100;
		this.skyRad = 100;
	}
	get x() { return this.sd.x; }
	set x(val) { this.sd.x = val; }
	get y() { return this.sd.y; }
	set y(val) { this.sd.y = val; }
	get t() { return this.sd.t; }
	drawGrid(rad, positive, color) {
		const { ctx, sd } = this;
		ctx.strokeStyle = color;
		sd.radius = rad;
		for (let i=0; i<n; ++i) {
			ctx.beginPath();
			sd.smallCircle(D90, 0, (i + 1)/n*PI, positive);
			ctx.stroke();

			ctx.beginPath();
			sd.smallCircle(0, i/n*PI, D90, positive);
			ctx.stroke();
		}
	}
	fillCircle(rad, color) {
		const { ctx, x, y } = this;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, rad, 0, TAU);
		ctx.fill();
	}
	render() {
		const { skyRad, earthRad } = this;
		this.fillCircle(skyRad, skyColor);
		this.drawGrid(skyRad, false, skyGridColor);
		this.fillCircle(skyRad, skyColor);
		this.fillCircle(earthRad, earthColor);
		this.drawGrid(earthRad, true, earthGridColor);
		this.drawGrid(skyRad, true, skyGridColor);
		return this;
	}
}
