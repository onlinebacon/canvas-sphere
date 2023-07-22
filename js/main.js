import SphereDrawer from './sphere-drawer.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const sd = new SphereDrawer(ctx);
const t0 = Date.now();

sd.x = 0.5*canvas.width;
sd.y = 0.5*canvas.height;
sd.radius = Math.min(canvas.width, canvas.height)*0.4;

const getT = () => (Date.now() - t0)*1e-3;

const fillSphere = () => {
	ctx.fillStyle = 'rgba(127, 127, 127, 0.75)';
	ctx.beginPath();
	ctx.arc(sd.x, sd.y, sd.radius, 0, Math.PI*2);
	ctx.fill();
};

const render = () => {
	ctx.lineWidth = 3;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	sd.t.reset().rotY(getT());

	ctx.strokeStyle = '#fff';
	ctx.fillStyle = '#f00';

	ctx.beginPath();
	sd.smallCircle(0, Math.PI*0.4, 0.5, false);
	ctx.stroke();

	sd.fill();
	ctx.fill();
	
	fillSphere();

	ctx.fillStyle = '#07f';
	ctx.beginPath();
	sd.smallCircle(0, Math.PI*0.4, 0.5, true);
	sd.fill();
	ctx.fill();

	ctx.beginPath();
	sd.smallCircle(0, Math.PI*0.4, 0.5, true);
	ctx.stroke();
};

const frameLoop = () => {
	requestAnimationFrame(frameLoop);
	render();
};

frameLoop();
