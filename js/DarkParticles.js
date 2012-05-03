function DarkParticles(){
	var canvas, layer;
	var context;
	var width;
	var height;
	var mouse = {x: 500, y: 500, p: false};
	var interval;
	var vms = [];
	var MAX_NUM = 60;
	var N = 80;
	var px = 500;
	var py = 500;
	var colours = ['#000000', '#FFFFFF', '#FF0000', '#FF7F00','#FFFF00','#009933','#33CC33','#007FFF','#0000FF','#7F00FF']
	var worm_colour = '#000000'
	var worm_length = 60;
	var worm_thickness = 1;
	this.initialize = function(){
		canvas = document.getElementById("darkparticles");
		layer = document.getElementById("darklayer");
		context = canvas.getContext('2d');
		//context.globalCompositeOperation = "lighter";

		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
		layer.addEventListener('mousemove', MouseMove, false);
		layer.addEventListener('mousedown', MouseDown, false);
		layer.addEventListener('mouseup', MouseUp, false);
		layer.addEventListener('mouseout', MouseUp, false);
		layer.addEventListener('touchstart', TouchDown, false);
		layer.addEventListener('touchmove', TouchMove, false);
		layer.addEventListener('touchend', TouchUp, false);
		//Clear();
		//CreateControls();
		var interval = setInterval(Draw, 20);
	}
	var Draw = function(){
		var len = vms.length;
		var i;
		for (i = 0; i < len; i++){
			var o = vms[i];
			if (o.count < N){
				DrawWorm(o);
				o.count++;
			} else {
				len--;
				vms.splice(i, 1);
				i--;
			}
		}
		Check();
		darkMaterial();
	}
	function darkMaterial(){
		context.fillStyle = "rgba(0, 0, 0, 0.2)";
		context.beginPath();
		context.rect(0, 0, width, height);
		context.closePath();
		context.fill();
	}
	//Takes a worm (obj) param
	var DrawWorm = function (obj){
		if (Math.random() > 0.9){
			obj.tmt.rotate(-obj.r * 2);
			obj.r *= -1;
		}
		//Prepend is just concat -- right?
		obj.vmt.prependMatrix(obj.tmt);
		var cc1x = -obj.w * obj.vmt.c + obj.vmt.tx;
		var cc1y = -obj.w * obj.vmt.d + obj.vmt.ty;
		var pp1x = (obj.c1x + cc1x) / 2;
		var pp1y = (obj.c1y + cc1y) / 2;
		var cc2x = obj.w * obj.vmt.c + obj.vmt.tx;
		var cc2y = obj.w * obj.vmt.d + obj.vmt.ty;
		var pp2x = (obj.c2x + cc2x) / 2;
		var pp2y = (obj.c2y + cc2y) / 2;

		context.fillStyle = worm_colour;
		context.beginPath();
		context.moveTo(obj.p1x , obj.p1y);
		context.quadraticCurveTo(obj.c1x, obj.c1y, pp1x, pp1y);
		context.lineTo(pp2x, pp2y);
		context.quadraticCurveTo(obj.c2x, obj.c2y, obj.p2x, obj.p2y);
		context.closePath();
		context.fill();
		obj.c1x = cc1x;
		obj.c1y = cc1y;
		obj.p1x = pp1x;
		obj.p1y = pp1y;
		obj.c2x = cc2x;
		obj.c2y = cc2y;
		obj.p2x = pp2x;
		obj.p2y = pp2y;
	}
	var Check = function(){
		var x0 = mouse.x;
		var y0 = mouse.y;
		var vx = x0 - px;
		var vy = y0 - py;
		var len = Math.min(Magnitude(vx, vy), 50);
		if (len < 10 || mouse.p == false){
			return;
		}
		var matrix = new Matrix2D();
		matrix.rotate((Math.atan2(vy, vx)));
		matrix.translate(x0, y0);
		createWorm(matrix, len);
		context.beginPath();
		context.strokeStyle = worm_colour;
		context.moveTo(px, py);
		context.lineTo(x0, y0);
		context.stroke();
		context.closePath();
		px = x0;
		py = y0;
	}
	var createWorm = function(mtx, len){
		var angle = Math.random() * (Math.PI/6 - Math.PI/64) + Math.PI/64;
		if(Math.random() > 0.5){
			angle *= -1;
		}
		var tmt = new Matrix2D();
		tmt.scale(0.95, 0.95);
		tmt.rotate(angle);
		tmt.translate(worm_length, 0);
		var w = 0.5;
		var obj = new Worm();
		obj.c1x = (-w * mtx.c + mtx.tx);
		obj.p1x = (-w * mtx.c + mtx.tx);
		obj.c1y = (-w * mtx.d + mtx.ty);
		obj.p1y = (-w * mtx.d + mtx.ty);
		obj.c2x = (w * mtx.c + mtx.tx);
		obj.p2x = (w * mtx.c + mtx.tx);
		obj.c2y = (w * mtx.d + mtx.ty);
		obj.p2y = (w * mtx.d + mtx.ty);
		obj.vmt = mtx;
		obj.tmt = tmt;
		obj.r = angle;
		obj.w = worm_thickness;
		obj.count = 0;
		vms.push(obj);
		if (vms.length > MAX_NUM){
			vms.shift();
		}
	}
	var Worm = function(){
		this.c1x = null;
		this.c1y = null;
		this.c2x = null;
		this.c2y = null;
		this.p1x = null;
		this.p1y = null;
		this.p2x = null;
		this.p2y = null;
		this.w = null;
		this.r = null;
		this.count = null;
		this.vmt = null;
		this.tmt = null;
	}
	//Clear the canvas, and remove any currently drawing curves.
	var Clear = function(){
		vms = [];
		context.fillStyle = "#000000";
		context.fillRect(0, 0, width, height);
	}
	//
	// --- Mouse IO
	//
	var MouseDown = function(e) {
		worm_colour = colours[Math.floor(Math.random()*colours.length)];
		e.preventDefault();
		//Set mouse position
		mouse.x = e.offsetX || (e.layerX - canvas.offsetLeft);
		mouse.y = e.offsetY || (e.layerY - canvas.offsetTop);
		px = mouse.x;
		py = mouse.y;
		mouse.p = true;
	}
	var MouseUp = function(e) {
		e.preventDefault();
		mouse.p = false;
	}
	var MouseMove = function(e) {
		mouse.x = e.offsetX || (e.layerX - canvas.offsetLeft);
		mouse.y = e.offsetY || (e.layerY - canvas.offsetTop);
	}
	//
	// --- Touch IO
	//
	var TouchDown = function(e) { //Hehe, touchdown!
		if(event.touches.length == 1) {
			e.preventDefault();
			worm_colour = colours[Math.floor(Math.random()*colours.length)];
			mouse.x = e.offsetX || (e.layerX - canvas.offsetLeft);
			mouse.y = e.offsetY || (e.layerY - canvas.offsetTop);
			px = mouse.x;
			py = mouse.y;
			mouse.p = true;
		}
	}
	function TouchMove(e) {
		if(event.touches.length == 1) {
			e.preventDefault();
			mouse.x = e.offsetX || (e.layerX - canvas.offsetLeft);
			mouse.y = e.offsetY || (e.layerY - canvas.offsetTop);
		}
	}
	function TouchUp(e) { //Haha, this one is funny too :O
		mouse.p = false;
	}
	var Magnitude = function(x, y){
		return Math.sqrt((x * x) + (y * y));
	}
}

var app;
window.onload = function() {
	app = new DarkParticles();
	app.initialize();
}