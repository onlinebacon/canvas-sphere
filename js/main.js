const aux = new Array(9);
const [ X, Y, Z ] = [ 0, 1, 2 ];
const [
	IX, IY, IZ,
	JX, JY, JZ,
	ZX, ZY, ZZ,
] = [
	0, 1, 2,
	3, 4, 5,
	6, 7, 8,
];
const calcUnsignedAngle = (adj, opp) => {
	const len = Math.sqrt(adj**2 + opp**2);
	if (len === 0) {
		return 0;
	}
	const angle = Math.acos(adj/len);
	if (opp >= 0) {
		return angle;
	}
	return Math.PI*2 - angle;
};
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
const getLatLonAzm = (mat) => {
	let jx = mat[JX];
	let jy = mat[JY];
};
class Transform extends Array {
	constructor() {
		super(9);
		this.reset();
	}
	reset() {
		this.set([ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]);
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
	}
}
class SphereDrawer {
	constructor(ctx) {
		this.ctx = ctx;
		this.x = 0;
		this.y = 0;
		this.radius = 100;
		this.t = new Transform();
	}
}
