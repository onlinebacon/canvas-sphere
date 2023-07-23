import Transform from './transform.js';
import { calcSignedAngle, calcUnsignedAngle } from './utils.js';
import Vec3 from './vec3.js';

export default class SphereDrawer {
	constructor(ctx) {
		this.ctx = ctx;
		this.x = 0;
		this.y = 0;
		this.radius = 100;
		this.t = new Transform();
		this.last = null;
	}
	smallCircle(lat, lon, rad, positive = true) {
		if (rad > Math.PI/2) {
			rad = Math.PI - rad;
			lat = -lat;
			lon = lon > 0 ? lon - Math.PI : lon + Math.PI;
		}
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
		if (!positive != (v.z < 0)) {
			[ a, b ] = [ b, b + Math.PI*2 - (b - a) ];
		}
		ctx.ellipse(cx, cy, xRad, yRad, dir, a, b);
		this.last = { a, b, dir, eRad, z: v.z, positive };
		return this;
	}
	completeSmallCircle() {
		const { last } = this;
		if (last === null) {
			return;
		}
		const { a, b, dir, eRad, z, positive } = last;
		const dif = Math.PI*2 - (b - a);
		const delta = Math.sin(dif/2)*eRad;
		const halfAngle = Math.asin(delta);
		const start = dir - halfAngle;
		const end = dir + halfAngle;
		if ((z < 0) != !positive) {
			this.ctx.arc(this.x, this.y, this.radius, end, start, true);
		} else {
			this.ctx.arc(this.x, this.y, this.radius, start, end);
		}
		return this;
	}
	locate(lat, lon) {
		const v = new Vec3([ 0, 0, 1 ]);
		v.rotX(lat);
		v.rotY(-lon);
		v.applyTransform(this.t);
		v.scale(this.radius);
		return [ this.x + v.x, this.y - v.y, v.z ];
	}
	coordAt(x, y) {
		const dx = x - this.x;
		const dy = this.y - y;
		const nx = dx/this.radius;
		const ny = dy/this.radius;
		const nz = Math.sqrt(1 - nx**2 - ny**2);
		const v = new Vec3([ nx, ny, nz ]);
		const t = new Transform().invert(this.t.getLatLonAzm());
		v.applyTransform(t);
		v.normalize();
		const lat = Math.asin(v.y);
		const lon = calcSignedAngle(v.z, v.x);
		return [ lat, lon ];
	}
}
