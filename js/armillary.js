import SphereDrawer from './sphere-drawer.js';

const { PI } = Math;
const D90 = PI/2;
const TAU = Math.PI*2;
const skyColor = 'rgba(64, 64, 96, 0.2)';
const skyGridColor = 'rgba(64, 127, 255, 0.3)';
const earthColor = '#456';
const earthGridColor = '#68a';
const poleColor = 'rgba(255, 255, 255, 0.2)';

const raDecToCoord = (ra, dec) => {
	const lon = (ra > 12 ? ra - 24 : ra)/12*PI;
	const lat = dec/180*PI;
	return [ lat, lon ];
};

class Body {
	constructor({ name, radius, rgb, ra, dec }) {
		this.name = name;
		this.radius = radius;
		this.rgb = rgb;
		this.coord = raDecToCoord(ra, dec);
	}
}

export default class Armillary {
	constructor(ctx) {
		this.ctx = ctx;
		this.sd = new SphereDrawer(ctx);
		this.x = 0;
		this.y = 0;
		this.earthRad = 100;
		this.skyRad = 120;
		this.nEarthGrid = 12;
		this.nSkyGrid = 6;
		this.bodies = true ? [] : [ new Body({}) ];
	}
	get x() { return this.sd.x; }
	set x(val) { this.sd.x = val; }
	get y() { return this.sd.y; }
	set y(val) { this.sd.y = val; }
	get t() { return this.sd.t; }
	drawPoles(positive, r0, r1) {
		const { ctx, sd } = this;
		sd.radius = r1;
		ctx.strokeStyle = poleColor;
		ctx.fillStyle = poleColor;
		for (let body of this.bodies) {
			const [ lat, lon ] = body.coord;
			const [ bx, by, z ] = sd.locate(lat, lon);
			if ((z >= 0) != positive) {
				continue;
			}
			const ax = this.x + (bx - this.x)/r1*r0;
			const ay = this.y + (by - this.y)/r1*r0;
			ctx.beginPath();
			ctx.arc(ax, ay, 1, 0, TAU);
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(ax, ay);
			ctx.lineTo(bx, by);
			ctx.stroke();
		}
	}
	drawBodies(rad, positive) {
		const { ctx, sd } = this;
		sd.radius = rad;
		for (let body of this.bodies) {
			const [ lat, lon ] = body.coord;
			ctx.fillStyle = `rgba(${body.rgb}, 0.25)`;
			ctx.beginPath();
			sd.smallCircle(lat, lon, body.radius, positive);
			sd.completeSmallCircle();
			ctx.fill();

			ctx.fillStyle = `rgba(${body.rgb}, 1)`;
			ctx.beginPath();
			sd.smallCircle(lat, lon, body.radius*0.5, positive);
			sd.completeSmallCircle();
			ctx.fill();
		}
	}
	drawGrid(rad, n, positive, color) {
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
	strokeCircle(rad, color) {
		const { ctx, x, y } = this;
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, rad, 0, TAU);
		ctx.stroke();
	}
	fillCircle(rad, color) {
		const { ctx, x, y } = this;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, rad, 0, TAU);
		ctx.fill();
	}
	render() {
		const { skyRad, nSkyGrid, earthRad, nEarthGrid } = this;
		this.fillCircle(skyRad, skyColor);
		this.drawGrid(skyRad, nSkyGrid, false, skyGridColor);
		this.drawBodies(skyRad, false);

		this.drawPoles(false, this.earthRad, this.skyRad);
		this.fillCircle(earthRad, earthColor);
		this.drawGrid(earthRad, nEarthGrid, true, earthGridColor);
		this.strokeCircle(earthRad, earthGridColor);
		this.drawPoles(true, this.earthRad, this.skyRad);

		this.fillCircle(skyRad, skyColor);
		this.drawBodies(skyRad, true);
		this.drawGrid(skyRad, nSkyGrid, true, skyGridColor);
		this.strokeCircle(skyRad, skyGridColor);
		return this;
	}
	addBody({ name, radius, rgb, ra, dec }) {
		const body = new Body({ name, radius, rgb, ra, dec });
		this.bodies.push(body);
		return this;
	}
}
