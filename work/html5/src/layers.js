var LMF = {
	canvas: null,
	scene: null,
	width: 1080,
	height: 1920,
	json: {},
	thing: {},
	action: null
};

function LOAD(json) {
	var data = json;
	var name = data.name || "anonymous";
	LMF.json[name] = data;
}

function tick(scene, time) {
	LMF.thing.planet.$.circle05.rotate = -time / 20;


	var wiggle = Math.sin(time / 200);
	var wiggle2 = Math.cos(time / 200);
	var bob = Math.cos(time / 100);
	var bob2 = Math.sin(time / 100);
	LMF.thing.farmer.$["body01"].pivot = {
		"x": 227,
		"y": 327
	};
	LMF.thing.farmer.$["body01"].offset = {
		"x": 0,
		"y": -400
	};

	LMF.thing.farmer.$["foot-r01"].flipx = false;
	LMF.thing.farmer.$["arm-r01"].flipy = false;
	LMF.thing.farmer.$["arm-l01"].flipy = false;

	LMF.thing.farmer.$["body01"].rotate = wiggle * 3;
	LMF.thing.farmer.$["body01"]._offset.y = bob * -50;
	LMF.thing.farmer.$["head01"].rotate = wiggle2 * -3;
	LMF.thing.farmer.$["eye01"].rotate = wiggle * -6;
	LMF.thing.farmer.$["eye02"].rotate = wiggle * -6;
	LMF.thing.farmer.$["hair03"].rotate = bob2 * 20;
	LMF.thing.farmer.$["arm-l01"].rotate = bob2 * -10;
	LMF.thing.farmer.$["arm-r01"].rotate = bob2 * 10;
	LMF.thing.farmer.$["leg-l01"].rotate = 40 + wiggle2 * 80;
	LMF.thing.farmer.$["foot-l01"].rotate = 5 + (bob2 * 20) + (wiggle * 30);
	LMF.thing.farmer.$["leg-r01"].rotate = wiggle2 * -60;
	LMF.thing.farmer.$["foot-r01"].rotate = 5 + (bob2 * 20) - (wiggle * 30);
}

function start() {
	console.log("start");
	LMF.scene = new penduinSCENE(LMF.canvas, LMF.width, LMF.height,
								 tick, 60);
	LMF.scene.setAutoOrder(false);
	LMF.scene.showFPS(true);
	LMF.scene.addOBJ(LMF.thing.planet, "planet");
	LMF.scene.addOBJ(LMF.thing.farmer, "farmer");
	LMF.thing.farmer.$["body01"]._offset = {x: 0, y: 0};
	LMF.scene.setBG("lightblue");

	LMF.thing.planet.x = LMF.width / 2;
	LMF.thing.planet.y = LMF.height;
	LMF.thing.farmer.x = LMF.width / 2;
	LMF.thing.farmer.y = LMF.height * 0.65;
	LMF.thing.farmer.$.body01.scale = 0.5;
}

function combineCallbacks(cbList, resultsVary, cb) {
	var results = [];
	var res = [];
	var uniq = [];
	while(results.length < cbList.length) {
		results.push(null);
	}
	cbList.every(function(callback, idx) {
		return callback(function(val) {
			res.push(val);
			results[idx] = val;
			if(uniq.indexOf(val) < 0) {
				uniq.push(val);
			}
			if(res.length === cbList.length) {
				if(uniq.length === 1) {
					cb(uniq[0], results);
				} else if(uniq.length > 1) {
					cb(resultsVary, results);
				} else {
					cb(null, results);
				}
			}
		});
	});
}

function click(e) {
	if(LMF.action === "run") {
		LMF.action = "roll";
	} else {
		LMF.action = "run";
	}
}
function wheel(e) {
	if(e.deltaY > 0) {
//		LMF.thing.farmer.$.body01.scale *= 0.9;
	} else {
//		LMF.thing.farmer.$.body01.scale *= 1.1;
	}
}
function mousemove(e) {
//	var scale = LMF.scene.getScale();
//	LMF.thing.farmer.x = (e.clientX - e.target.offsetLeft) / scale;
//	LMF.thing.farmer.y = (e.clientY - e.target.offsetTop) / scale;
}

window.addEventListener("load", function() {
	LMF.canvas = document.querySelector("#display");
	var cbs = [];

	// load object armatures
	Object.keys(LMF.json).every(function(key) {
		cbs.push(function(cb) {
			LMF.thing[key] = new penduinOBJ(LMF.json[key], cb);
			return true;
		});
		return true;
	});

	//LMF.canvas.addEventListener("mousemove", mousemove);
	LMF.canvas.addEventListener("click", click);
	LMF.canvas.addEventListener("wheel", wheel);

	combineCallbacks(cbs, null, start);
});
