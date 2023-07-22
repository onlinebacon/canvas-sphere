import SphereDrawer from './sphere-drawer.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const drawer = new SphereDrawer(ctx);

drawer.x = 0.5*canvas.width;
drawer.y = 0.5*canvas.height;
drawer.radius = Math.min(canvas.width, canvas.height)*0.4;

const n = 5;
const t0 = Date.now();

const render = () => {
	const t1 = Date.now();
	const dt = t1 - t0;

	ctx.lineWidth = 3;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.beginPath();
	ctx.arc(drawer.x, drawer.y, drawer.radius, 0, Math.PI*2);
	ctx.fillStyle = '#446';
	ctx.fill();

	ctx.strokeStyle = 'rgba(0, 127, 255, 0.5)';

	drawer.t.reset()
		.rotY(dt*5e-4 - Math.PI/2)
		.rotX(Math.sin(Date.now()*1e-3)*0.2);

	const latStride = Math.PI/(n + 1);
	const lonStride = Math.PI/n;
	for (let i=0; i<n; ++i) {
		ctx.beginPath();
		drawer.smallCircle(Math.PI/2, 0, (i + 1)*latStride);
		ctx.stroke();
		
		ctx.beginPath();
		drawer.smallCircle(0, i*lonStride, Math.PI/2);
		ctx.stroke();
	}

	ctx.strokeStyle = 'rgba(255, 127, 0, 0.5)';
	ctx.beginPath();
	drawer.smallCircle(0, 0, 0.5, true);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
	ctx.beginPath();
	drawer.smallCircle(0, 0, 0.5, false);
	ctx.stroke();
};

const frameLoop = () => {
	requestAnimationFrame(frameLoop);
	render();
};

frameLoop();
