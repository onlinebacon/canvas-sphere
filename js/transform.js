const { PI } = Math;
const TAU = PI*2;

const X = 0;
const Y = 1;
const Z = 2;
const I = 0;
const J = 3;
const K = 6;

const sinCosToAngle = (sin, cos) => {
	if (sin >= 0) {
		return Math.acos(cos);
	}
	return TAU - Math.acos(cos);
};

const getZRotAlignmentOfJ = (t) => {
	const jx = t[J + X];
	const jy = t[J + Y];
	const len = Math.sqrt(jx**2 + jy**2);
	if (len === 0) {
		return [ 0, 1 ];
	}
	const sin = -jx/len;
	const cos = jy/len;
	return [ sin, cos ];
};

const getXRotAlignmentOfJ = (t) => {
	const jy = t[J + Y];
	const jz = t[J + Z];
	const len = Math.sqrt(jy**2 + jz**2);
	if (len === 0) {
		return [ 0, 1 ];
	}
	const sin = jz/len;
	const cos = jy/len;
	return [ sin, cos ];
};

const getYRotAlignmentOfK = (t) => {
	const kx = t[K + X];
	const kz = t[K + Z];
	const len = Math.sqrt(kx**2 + kz**2);
	if (len === 0) {
		return [ 0, 1 ];
	}
	const sin = kx/len;
	const cos = kz/len;
	return [ sin, cos ];
};

export default class Transform extends Array {
	constructor(values) {
		super(9);
		if (values != null) {
			this.set(values);
		} else {
			this.reset();
		}
	}
	reset() {
		return this.set([ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]);
	}
	set(values) {
		for (let i=0; i<9; ++i) {
			this[i] = values[i];
		}
		return this;
	}
	sinCosRotX(sin, cos) {
		const [ _ix, iy, iz, _jx, jy, jz, _kx, ky, kz ] = this;
		this[1] = iy*cos + iz*sin;
		this[2] = iz*cos - iy*sin;
		this[4] = jy*cos + jz*sin;
		this[5] = jz*cos - jy*sin;
		this[7] = ky*cos + kz*sin;
		this[8] = kz*cos - ky*sin;
		return this;
	}
	sinCosRotY(sin, cos) {
		const [ ix, _iy, iz, jx, _jy, jz, kx, _ky, kz ] = this;
		this[0] = ix*cos - iz*sin;
		this[2] = iz*cos + ix*sin;
		this[3] = jx*cos - jz*sin;
		this[5] = jz*cos + jx*sin;
		this[6] = kx*cos - kz*sin;
		this[8] = kz*cos + kx*sin;
		return this;
	}
	sinCosRotZ(sin, cos) {
		const [ ix, iy, _iz, jx, jy, _jz, kx, ky, _kz ] = this;
		this[0] = ix*cos + iy*sin;
		this[1] = iy*cos - ix*sin;
		this[3] = jx*cos + jy*sin;
		this[4] = jy*cos - jx*sin;
		this[6] = kx*cos + ky*sin;
		this[7] = ky*cos - kx*sin;
		return this;
	}
	rotX(angle) {
		return this.sinCosRotX(Math.sin(angle), Math.cos(angle));
	}
	rotY(angle) {
		return this.sinCosRotY(Math.sin(angle), Math.cos(angle));
	}
	rotZ(angle) {
		return this.sinCosRotZ(Math.sin(angle), Math.cos(angle));
	}
	getYXZRot() {
		temp.set(this);
		const [ sinZ, cosZ ] = getZRotAlignmentOfJ(temp);
		temp.sinCosRotZ(sinZ, cosZ);
		const [ sinX, cosX ] = getXRotAlignmentOfJ(temp);
		temp.sinCosRotX(sinX, cosX);
		const [ sinY, cosY ] = getYRotAlignmentOfK(temp);
		return [
			sinCosToAngle(-sinY, cosY),
			sinCosToAngle(-sinX, cosX),
			sinCosToAngle(-sinZ, cosZ),
		];
	}
}

const temp = new Transform();
