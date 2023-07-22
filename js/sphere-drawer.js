import Transform from './transform.js';
import { calcUnsignedAngle } from './utils.js';
import Vec3 from './vec3.js';

export default class SphereDrawer {
	constructor(ctx) {
		this.ctx = ctx;
		this.x = 0;
		this.y = 0;
		this.radius = 100;
		this.t = new Transform();
	}
	smallCircle(lat, lon, rad, negative = false) {
		const cosRad = Math.cos(rad);
		const v = new Vec3([ 0, 0, 1 ]);
		v.rotX(lat);
		v.rotY(-lon);
		v.applyTransform(this.t);
		const dir = calcUnsignedAngle(v.x, -v.y);
		const eRad = Math.sin(rad);
		const yRad = eRad*this.radius;
		const xRad = yRad*Math.abs(v.z);
		const len = cosRad*this.radius;
		const cx = this.x + v.x*len;
		const cy = this.y - v.y*len;
		const { ctx } = this;
		const mz = v.z*cosRad;
		const mx = cosRad*Math.sqrt(1 - v.z**2);
		const t = Math.abs(mz/mx);
		const ratio = t*cosRad/eRad;
		let a, b;
		if (ratio >= 1) {
			a = 0;
			b = Math.PI*2;
		} else {
			const shift = Math.acos(ratio);
			a = shift;
			b = Math.PI*2 - shift;
		}
		if (negative != (v.z < 0)) {
			[ a, b ] = [ b, b + Math.PI*2 - (b - a) ];
		}
		ctx.ellipse(cx, cy, xRad, yRad, dir, a, b);
	}
}
