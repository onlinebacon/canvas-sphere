const aux = new Array(9);
const temp = new Array(9);

const X = 0;
const Y = 1;
const Z = 2;

const IX = 0;
const IZ = 2;
const JX = 3;
const JY = 4;
const JZ = 5;

const sinCosRotTransform = (t, sin, cos, a, b) => {
	for (let i=0; i<9; ++i) {
		const axis = i%3;
		if (axis === a) {
			aux[i] = t[i]*cos - t[i - a + b]*sin;
		} else if (axis === b) {
			aux[i] = t[i]*cos + t[i - b + a]*sin;
		} else {
			aux[i] = t[i];
		}
	}
	for (let i=0; i<9; ++i) {
		t[i] = aux[i];
	}
};

const getLatLonAzm = (t) => {
	const jx = t[JX];
	let jy = t[JY];
	let len = Math.sqrt(jx**2 + jy**2);
	const sinAzm = -jx/len;
	const cosAzm = jy/len;
	const acosAzm = Math.acos(cosAzm);
	const azm = sinAzm < 0 ? Math.PI*2 - acosAzm : acosAzm;
	sinCosRotTransform(t, sinAzm, cosAzm, Y, X);
	jy = t[JY];
	const jz = t[JZ];
	len = Math.sqrt(jy**2 + jz**2);
	const cosLat = jy/len;
	const sinLat = jz/len;
	const acosLat = Math.acos(cosLat);
	const lat = sinLat < 0 ? Math.PI*2 - acosLat : acosLat;
	sinCosRotTransform(t, sinLat, cosLat, Z, Y);
	const ix = t[IX];
	const iz = t[IZ];
	len = Math.sqrt(ix**2 + iz**2);
	const cosLon = ix/len;
	const sinLon = iz/len;
	const acosLon = Math.acos(cosLon);
	const lon = sinLon < 0 ? Math.PI*2 - acosLon : acosLon;
	return [ lat, lon, azm ];
};

export default class Transform extends Array {
	constructor() {
		super(9);
		this.reset();
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
	rot(angle, a, b) {
		sinCosRotTransform(this, Math.sin(angle), Math.cos(angle), a, b);
		return this;
	}
	rotX(angle) { return this.rot(angle, Z, Y); }
	rotY(angle) { return this.rot(angle, X, Z); }
	rotZ(angle) { return this.rot(angle, Y, X); }
	getLatLonAzm() {
		for (let i=0; i<9; ++i) {
			temp[i] = this[i];
		}
		return getLatLonAzm(temp);
	}
	setLatLonAzm([ lat, lon, azm ]) {
		return this.reset().rotY(lon).rotX(-lat).rotZ(-azm);
	}
}
