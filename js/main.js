import Armillary from './armillary.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const t0 = Date.now();
const armillary = new Armillary(ctx);

const getT = () => ((Date.now() - t0)*1e-3);

const render = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const rad = Math.min(canvas.width, canvas.height)*0.45;
	const t = getT();
	armillary.t.reset().rotY(t*2).rotX(t).rotZ(t*0.5);
	armillary.skyRad = rad;
	armillary.earthRad = rad*0.8;
	armillary.x = canvas.width/2;
	armillary.y = canvas.height/2;
	armillary.render();
};

const frameLoop = () => {
	requestAnimationFrame(frameLoop);
	render();
};
frameLoop();
