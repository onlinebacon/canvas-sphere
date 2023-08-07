const temp = [ 0, 0, 0 ];

const X = 0;
const Y = 1;
const Z = 2;

export default class Vec3 extends Array {
	constructor(values) {
		super(3);
		if (values != null) {
			this.set(values);
		} else {
			this.set([ 0, 0, 0 ]);
		}
	}
	get x() { return this[0]; }
	get y() { return this[1]; }
	get z() { return this[2]; }
	set x(val) { this[0] = val; }
	set y(val) { this[1] = val; }
	set z(val) { this[2] = val; }
	set(values) {
		for (let i=0; i<3; ++i) {
			this[i] = values[i];
		}
		return this;
	}
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
	rotX(angle) { return this.rot(angle, Z, Y); }
	rotY(angle) { return this.rot(angle, X, Z); }
	rotZ(angle) { return this.rot(angle, Y, X); }
	transform(t) {
		for (let i=0; i<3; ++i) {
			let sum = 0;
			for (let j=0; j<3; ++j) {
				sum += this[j] * t[j*3 + i];
			}
			temp[i] = sum;
		}
		return this.set(temp);
	}
	scale(value) {
		for (let i=0; i<3; ++i) {
			this[i] *= value;
		}
		return this;
	}
	add(values) {
		for (let i=0; i<3; ++i) {
			this[i] += values[i];
		}
		return this;
	}
	len() {
		const [ x, y, z ] = this;
		return Math.sqrt(x**2 + y**2 + z**2);
	}
}
