import Armillary from './armillary.js';
import stars from './stars.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const t0 = Date.now();
const armillary = new Armillary(ctx);

stars.forEach(star => {
	armillary.addBody({
		name: star.names[0],
		radius: 0.75/180*Math.PI,
		rgb: [ 255, 255, 255 ],
		ra: star.ra,
		dec: star.dec,
	})
});

armillary.addBody({
	name: 'sun',
	radius: 3/180*Math.PI,
	rgb: [ 255, 255, 0 ],
	ra: 22,
	dec: -10,
});

armillary.addBody({
	name: 'moon',
	radius: 3/180*Math.PI,
	rgb: [ 192, 192, 192 ],
	ra: 8,
	dec: 15,
});

const getT = () => ((Date.now() - t0)*1e-3);

const render = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const rad = Math.min(canvas.width, canvas.height)*0.45;
	const t = getT();
	armillary.t.reset().rotY(t*2).rotX(Math.sin(t)*0.2);
	armillary.skyRad = rad;
	armillary.earthRad = rad*0.7;
	armillary.x = canvas.width/2;
	armillary.y = canvas.height/2;
	armillary.render();
};

const frameLoop = () => {
	requestAnimationFrame(frameLoop);
	render();
};
frameLoop();
