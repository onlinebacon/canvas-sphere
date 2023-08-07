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

const sinCosRotX = (t, sin, cos) => {
	const [ _ix, iy, iz, _jx, jy, jz, _kx, ky, kz ] = t;
	t[1] = iy*cos + iz*sin;
	t[2] = iz*cos - iy*sin;
	t[4] = jy*cos + jz*sin;
	t[5] = jz*cos - jy*sin;
	t[7] = ky*cos + kz*sin;
	t[8] = kz*cos - ky*sin;
	return t;
};

const sinCosRotY = (t, sin, cos) => {
	const [ ix, _iy, iz, jx, _jy, jz, kx, _ky, kz ] = t;
	t[0] = ix*cos - iz*sin;
	t[2] = iz*cos + ix*sin;
	t[3] = jx*cos - jz*sin;
	t[5] = jz*cos + jx*sin;
	t[6] = kx*cos - kz*sin;
	t[8] = kz*cos + kx*sin;
	return t;
};

const sinCosRotZ = (t, sin, cos) => {
	const [ ix, iy, _iz, jx, jy, _jz, kx, ky, _kz ] = t;
	t[0] = ix*cos + iy*sin;
	t[1] = iy*cos - ix*sin;
	t[3] = jx*cos + jy*sin;
	t[4] = jy*cos - jx*sin;
	t[6] = kx*cos + ky*sin;
	t[7] = ky*cos - kx*sin;
	return t;
};

const rotX = (t, angle) => {
	sinCosRotX(t, Math.sin(angle), Math.cos(angle));
};

const rotY = (t, angle) => {
	sinCosRotY(t, Math.sin(angle), Math.cos(angle));
};

const rotZ = (t, angle) => {
	sinCosRotZ(t, Math.sin(angle), Math.cos(angle));
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

const sinCosRotXVec3 = (vec3, sin, cos) => {
	const [ _x, y, z ] = vec3;
	vec3[Y] = y*cos + z*sin;
	vec3[Z] = z*cos - y*sin;
};

const sinCosRotYVec3 = (vec3, sin, cos) => {
	const [ x, _y, z ] = vec3;
	vec3[X] = x*cos - z*sin;
	vec3[Z] = z*cos + x*sin;
};

const sinCosRotZVec3 = (vec3, sin, cos) => {
	const [ x, y, _z ] = vec3;
	vec3[X] = x*cos + y*sin;
	vec3[Y] = y*cos - x*sin;
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
	rotX(angle) {
		rotX(this, angle);
		return this;
	}
	rotY(angle) {
		rotY(this, angle);
		return this;
	}
	rotZ(angle) {
		rotZ(this, angle);
		return this;
	}
	getYXZRot() {
		temp.set(this);
		const [ sinZ, cosZ ] = getZRotAlignmentOfJ(temp);
		sinCosRotZ(temp, sinZ, cosZ);
		const [ sinX, cosX ] = getXRotAlignmentOfJ(temp);
		sinCosRotX(temp, sinX, cosX);
		const [ sinY, cosY ] = getYRotAlignmentOfK(temp);
		return [
			sinCosToAngle(-sinY, cosY),
			sinCosToAngle(-sinX, cosX),
			sinCosToAngle(-sinZ, cosZ),
		];
	}
	applyReversedToVec(vec3) {
		temp.set(this);
		
		const [ sinZ, cosZ ] = getZRotAlignmentOfJ(temp);
		sinCosRotZ(temp, sinZ, cosZ);
		sinCosRotZVec3(vec3, sinZ, cosZ);
		
		const [ sinX, cosX ] = getXRotAlignmentOfJ(temp);
		sinCosRotX(temp, sinX, cosX);
		sinCosRotXVec3(vec3, sinX, cosX);
		
		const [ sinY, cosY ] = getYRotAlignmentOfK(temp);
		sinCosRotYVec3(vec3, sinY, cosY);

		return vec3;
	}
}

const temp = new Transform();
