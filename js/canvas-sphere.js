import Vec3 from './vec3.js';
import Transform from './transform.js';

const { PI } = Math;
const TAU = PI*2;

const nullCtx = Math.random() < 1 ? (
	null
) : (
	new CanvasRenderingContext2D()
);

const tempVec = new Vec3();

const getIntersectionAngles = (last_circle) => {
	const { chordRad, scrAngDir, intersectionAngle, intersectsEdge } = last_circle;
	if (!intersectsEdge) {
		return [ scrAngDir, scrAngDir ];
	}
	const deltaLen = Math.sin(intersectionAngle)*chordRad;
	const deltaAng = Math.asin(deltaLen);
	const start = scrAngDir - deltaAng;
	const end = scrAngDir + deltaAng;
	return [ start, end ];
};

const signAngle = (angle) => {
	if (angle > PI) {
		return angle - TAU;
	}
	return angle;
};

const calcVec3Coord = ([ x, y, z ]) => {
	const lat = Math.asin(y);
	const len = Math.sqrt(x**2 + z**2);
	if (len === 0) {
		return [ lat, 0 ];
	}
	const absLon = Math.acos(z/len);
	const lon = x < 0 ? - absLon : absLon;
	return [ lat, lon ];
};

class LastCircle {
	constructor({
		chordRad,
		scrAngDir,
		intersectionAngle = 0,
		visible = true,
		coordinateIsInverted = false,
		centerIsVisible = true,
		intersectsEdge = false,
	}) {
		this.chordRad = chordRad;
		this.scrAngDir = scrAngDir;
		this.visible = visible;
		this.coordinateIsInverted = coordinateIsInverted;
		this.intersectionAngle = intersectionAngle;
		this.intersectsEdge = intersectsEdge;
		this.centerIsVisible = centerIsVisible;
	}
}

export default class CanvasSphere {
	constructor(ctx = nullCtx) {
		this.ctx = ctx;
		this.translate = new Vec3();
		this.radius = 100;
		this.transform = new Transform();
		this.last_circle = null;
	}
	get x() { return this.translate.x; }
	get y() { return this.translate.y; }
	set x(value) { this.translate.x = value; }
	set y(value) { this.translate.y = value; }
	sphere() {
		this.ctx.arc(this.x, this.y, this.radius, 0, TAU);
	}
	getUnitVec3(lat, lon) {
		const v = new Vec3([ 0, 0, 1 ]);
		v.rotX(lat);
		v.rotY(-lon);
		v.transform(this.transform);
		return v;
	}
	project(lat, lon) {
		const v = this.getUnitVec3(lat, lon);
		v.y *= -1;
		v.scale(this.radius);
		v.add(this.translate);
		return v;
	}
	circle(lat, lon, rad, positive = true) {
		const { ctx, radius } = this;
		this.last_circle = null;
		if (rad > Math.PI/2) {
			this.circle(-lat, (lon + TAU)%TAU - PI, PI - rad, positive);
			if (this.last_circle != null) {
				this.last_circle.coordinateIsInverted = true;
			}
			return this;
		}
		const u = this.getUnitVec3(lat, lon);
		const uz = u.z;
		const dz = Math.abs(uz);
		const df = Math.sqrt(1 - dz**2);
		const chordRad = Math.sin(rad);
		const cosRad = Math.cos(rad);
		const scrYRad = chordRad*radius;
		const scrXRad = scrYRad*dz;
		const vz = dz*cosRad;
		const t = vz/df;
		let dirX = 0, dirY = 0;
		let start = 0, end = TAU;
		const dirLen = Math.sqrt(u.x**2 + u.y**2);
		if (dirLen !== 0) {
			dirX = u.x/dirLen;
			dirY = u.y/dirLen;
		}
		const scrAngDir = dirY < 0 ? Math.acos(dirX) : - Math.acos(dirX);
		let intersectionAngle = 0;
		let intersectsEdge = false;
		if (!isNaN(t) && t < chordRad) {
			const ratio = t/chordRad;
			intersectionAngle = Math.acos(ratio);
		}
		const centerIsVisible = !positive == (uz < 0);
		if (centerIsVisible) {
			if (t < chordRad) {
				intersectsEdge = true;
				start += intersectionAngle;
				end -= intersectionAngle;
			}
		} else {
			if (t > chordRad) {
				this.last_circle = new LastCircle({ visible: false });
				return this;
			}
			start = -intersectionAngle;
			end = intersectionAngle;
			intersectsEdge = true;
		}
		const offsetLen = cosRad*radius*df;
		const x = this.x + dirX*offsetLen;
		const y = this.y - dirY*offsetLen;
		ctx.ellipse(x, y, scrXRad, scrYRad, scrAngDir, start, end);
		this.last_circle = new LastCircle({
			visible: true,
			coordinateIsInverted: false,
			chordRad,
			scrAngDir,
			intersectionAngle,
			intersectsEdge,
			centerIsVisible,
		});
		return this;
	}
	complete(inside = true) {
		const { ctx, radius, last_circle } = this;
		if (last_circle === null) {
			return this;
		}
		if (last_circle.coordinateIsInverted) {
			inside = !inside;
		}
		if (!last_circle.visible && !inside) {
			this.sphere();
			return this;
		}
		const angles = getIntersectionAngles(this.last_circle);
		if (angles === null) {
			return this;
		}
		let [ start, end ] = angles;
		const { centerIsVisible } = this.last_circle;
		let counterclockwise = false;
		let flipSection = false;
		let flipDir = !centerIsVisible;
		if (!inside) {
			flipDir = true;
			flipSection = true;
		}
		if (flipDir) {
			[ start, end ] = [ end, start ];
			counterclockwise = true;
		}
		if (flipSection) {
			if (end > start) {
				const dif = end - start;
				[ start, end ] = [ end, end + TAU - dif ];
			} else {
				const dif = start - end;
				[ start, end ] = [ end, end - TAU + dif ];
			}
		}
		if (start != end) {
			ctx.arc(this.x, this.y, radius, start, end, counterclockwise);
		}
		return this;
	}
	deg(deg) {
		return deg/180*PI;
	}
	getSphereLatLonAzm() {
		const [ rotY, rotX, rotZ ] = this.transform.getYXZRot();
		const lat = signAngle(TAU - rotX);
		const lon = signAngle(rotY);
		const azm = (TAU - rotZ)%TAU;
		return [ lat, lon, azm ];
	}
	coordAt(px, py) {
		const { x, y, radius } = this;
		const nx = (px - x)/radius;
		const ny = (y - py)/radius;
		if (Math.abs(nx) > 1 || Math.abs(ny) > 1) {
			return null;
		}
		const len = Math.sqrt(nx**2 + ny**2);
		if (len > 1) {
			return null;
		}
		const nz = Math.sqrt(1 - nx**2 - ny**2);
		tempVec.set([ nx, ny, nz ]);
		this.transform.applyReversedToVec(tempVec);
		return calcVec3Coord(tempVec);
	}
}
