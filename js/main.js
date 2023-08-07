import CanvasSphere from './canvas-sphere.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const cs = new CanvasSphere(ctx);
const nSegments = 11;
const color = {
	equator: '#fa7',
	grid: '#777',
	sphere: 'rgba(68, 68, 68, 0.9)',
	shadow: 'rgba(0, 0, 0, 0.2)',
};
const lightDir = {
	lat: cs.deg(30),
	lon: cs.deg(30),
};
const textMargin = 10;
const textStride = 15;
const textSize = 14;
let mouse = null;

const resizeCanvas = () => {
	canvas.width = window.innerWidth;
	canvas.height = Math.min(canvas.width, window.innerHeight);
};

const drawLatitudes = (positive) => {
	const latStride = 180/(nSegments + 1);
	const latStart = latStride;
	for (let i=0; i<nSegments; ++i) {
		const rad = cs.deg(latStart + i*latStride);
		ctx.beginPath();
		cs.circle(cs.deg(90), 0, rad, positive);
		ctx.strokeStyle = rad === cs.deg(90) ? color.equator : color.grid;
		ctx.stroke();
	}
};

const drawLongitudes = (positive) => {
	const lonStride = 180/nSegments;
	const lonStart = 90;
	for (let i=0; i<nSegments; ++i) {
		ctx.beginPath();
		cs.circle(0, cs.deg(lonStart + i*lonStride), cs.deg(90), positive);
		ctx.stroke();
	}
};

const drawGrid = (positive) => {
	drawLongitudes(positive);
	drawLatitudes(positive);
};

const drawShadow = () => {
	const temp = [ ...cs.transform ];
	cs.transform.reset();
	
	ctx.fillStyle = color.shadow;
	ctx.beginPath();
	cs.circle(lightDir.lat, lightDir.lon, cs.deg(100));
	cs.complete(false);
	ctx.fill();
	
	cs.transform.set(temp);
};

const drawEarthOrientation = () => {
	const [ lat, lon, azm ] = cs.getSphereLatLonAzm().map(radians => {
		const deg = radians/Math.PI*180;
		return deg.toFixed(2);
	});
	const lines = [
		`lat: ${lat}`,
		`lon: ${lon}`,
		`azm: ${azm}`,
	];
	ctx.font = textSize + 'px monospace';
	ctx.fillStyle = '#fff';
	ctx.beginPath();
	ctx.textBaseline = 'bottom';
	ctx.textAlign = 'left';
	const n = lines.length;
	for (let i=0; i<n; ++i) {
		const line = lines[i];
		const x = textMargin;
		const y = canvas.height - (n - 1 - i)*textStride - textMargin;
		ctx.fillText(line, x, y);
	}
};

const drawMouseCoord = () => {
	if (mouse == null) {
		return;
	}
	ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.font = textSize + 'px monospace';
	const coord = cs.coordAt(mouse.x, mouse.y);
	if (coord == null) {
		return;
	}
	const text = coord
		.map(val => (val/Math.PI*180).toFixed(2))
		.join(', ');
	ctx.fillText(text, mouse.x, mouse.y);
};

const render = () => {
	const { width, height } = canvas;

	cs.x = width*0.5;
	cs.y = height*0.5;
	cs.radius = Math.min(width, height)*0.4;

	ctx.fillStyle = '#222';
	ctx.fillRect(0, 0, width, height);

	drawGrid(false);

	ctx.fillStyle = color.sphere;
	ctx.beginPath();
	cs.sphere();
	ctx.fill();

	drawGrid(true);

	ctx.strokeStyle = color.grid;
	ctx.beginPath();
	cs.sphere();
	ctx.stroke();

	drawShadow();
	drawEarthOrientation();
	drawMouseCoord();
};

const frameLoop = () => {
	render();
	requestAnimationFrame(frameLoop);
};

window.addEventListener('resize', () => {
	resizeCanvas();
	render();
});

canvas.addEventListener('mousemove', e => {
	mouse = {
		x: e.offsetX,
		y: e.offsetY,
	};
});

canvas.addEventListener('mouseout', e => {
	mouse = null;
});

resizeCanvas();
frameLoop();
const tScale = 0.001;
const t0 = Date.now();
const getTime = () => (Date.now() - t0)*tScale;

setInterval(() => {
	const rotX = Math.sin(getTime()*1.1)*cs.deg(10);
	const rotY = getTime()*0.5;
	const rotZ = Math.sin(getTime()*1.4)*cs.deg(10);
	cs.transform.reset().rotY(rotY).rotX(rotX).rotZ(rotZ);
});
