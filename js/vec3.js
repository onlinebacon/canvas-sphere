const temp = new Array(3);
const X = 0;
const Y = 1;
const Z = 2;

export default class Vec3 extends Array {
	constructor([ x, y, z ] = [ 0, 0, 1 ]) {
		super(3);
		this[X] = x;
		this[Y] = y;
		this[Z] = z;
	}
	get x() { return this[X]; }
	get y() { return this[Y]; }
	get z() { return this[Z]; }
	set x(val) { this[X] = val; }
	set y(val) { this[Y] = val; }
	set z(val) { this[Z] = val; }
	rot(angle, a, b) {
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		for (let i=0; i<3; ++i) {
			if (i === a) {
				temp[a] = this[a]*cos - this[b]*sin;
			} else if (i === b) {
				temp[b] = this[b]*cos + this[a]*sin;
			} else {
				temp[i] = this[i];
			}
		}
		return this.set(temp);
	}
	rotX(angle) {
		return this.rot(angle, Z, Y);
	}
	rotY(angle) {
		return this.rot(angle, X, Z);
	}
	rotZ(angle) {
		return this.rot(angle, Y, X);
	}
	set(values) {
		for (let i=0; i<3; ++i) {
			this[i] = values[i];
		}
		return this;
	}
	applyTransform(t) {
		for (let i=0; i<3; ++i) {
			let sum = 0;
			for (let j=0; j<3; ++j) {
				sum += this[j]*t[j*3 + i];
			}
			temp[i] = sum;
		}
		return this.set(temp);
	}
	len() {
		const [ x, y, z ] = this;
		return Math.sqrt(x*x + y*y + z*z);
	}
	scale(val) {
		for (let i=0; i<3; ++i) {
			this[i] *= val;
		}
		return this;
	}
	normalize() {
		this.scale(1/this.len());
	}
}
