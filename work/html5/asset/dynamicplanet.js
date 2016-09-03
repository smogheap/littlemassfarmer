var soilctx	= null;


LOAD({
	"name": "planet",
	"scale": 1,
	"above": [
		{
			"name": "circle01",
			"image": "planet/circle01.png",
			"pivot": {
				"x": 180,
				"y": 180
			},
			"rotate": 0,
			"scale": 1,
			"alpha": 1,
			"offset": {
				"x": 306,
				"y": 306
			},
			"above": [],
			"below": []
		}
	],
	"below": []
}, {

load: function load()
{
	console.log('loaded dynamic planet');
	console.log(this);

	/*
		Generate an internal canvas to draw the planet to. As it grows extra
		layers will be drawn, and it can then be drawn as a single image for
		each rendering tick.
	*/
	this.radius = 0;
	this.grow(250);
	this.grow(50);
	this.grow(50);
	this.grow(30);
	this.grow(10);
	this.grow(50);
	this.grow(100);
	this.grow(75);
	this.grow(75);
},

getNewContext: function getNewContext(size)
{
	var ctx = document.createElement("canvas").getContext("2d");

	ctx.canvas.width	= size;
	ctx.canvas.height	= size;

	ctx.translate(size / 2, size / 2);

	return(ctx);
},

grow: function grow(mass)
{
	var oldc	= soilctx ? soilctx.canvas : null;
	var oldr	= this.radius;
	var ctx;

	// TODO Actually calculate how much the added mass would matter and grow
	//		by that ammount... for now though, just add to the radius
	if (!isNaN(mass)) {
		this.radius += mass;
	}

	console.log('Planet radius grew to: ' + this.radius);

	ctx = this.getNewContext(this.radius * 2);

	function getRandomColor() {
		var letters	= '0123456789ABCDEF';
		var color	= '#';

		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return(color);
	};

	// TODO Find a good way to draw a wavy line instead of a perfect circle
	ctx.beginPath();
	ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);

	ctx.fillStyle	= getRandomColor();
	ctx.strokeStyle	= getRandomColor();
	ctx.lineWidth	= 3;

	ctx.fill();
	ctx.stroke();

	/* Draw the old planet on top of the new layer */
	if (oldc) {
		ctx.drawImage(oldc, -oldr, -oldr);
	}

	soilctx = ctx;
},

draw: function draw(ctx, scale, displayx, displayy, rot, time)
{
	if (!soilctx) {
		return;
	}

	/* Override the regular draw function so we can draw a dynamic planet */
	ctx.save();

	if (isNaN(displayx) || isNaN(displayy)) {
		ctx.translate(this.x * scale, this.y * scale);
	} else {
		ctx.translate(displayx * scale, displayy * scale);
	}
	ctx.scale(scale || 1, scale || 1);

	if (!isNaN(rot)) {
		ctx.rotate(rot * TO_RADIANS);
	}

	ctx.drawImage(soilctx.canvas, -this.radius, -this.radius, this.radius * 2, this.radius * 2);

	ctx.restore();
}

});

