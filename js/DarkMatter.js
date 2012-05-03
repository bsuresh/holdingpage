/* Author Suresh Bsub
   Dark matter overlay
*/

var DarkMatter = new function() {
	var width = window.innerWidth,
	height = window.innerHeight,
	c = document.getElementById('darklayer'),
	ctx = c.getContext('2d');
	c.width = width;
	c.height = height;
	var down = false;
	var mouseSize = 200;
	var mouse = {x:0,y:0};
	sx = width/2;
	sy = height/2;
	var rotat = 2;
	function init(){
		c.addEventListener('mousedown', MouseDown, false);
		c.addEventListener('mouseup', MouseUp, false);
		c.addEventListener('mousemove', MouseMove, false);
		clear();
		setInterval( update, 40 );
	}
	function update(){
		darkMaterial();
	}
	function clear(){
		ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
		ctx.beginPath();
		ctx.rect(0, 0, width, height);
		ctx.closePath();
		ctx.fill();
	}
	function darkMaterial(){
		ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
		ctx.beginPath();
		ctx.rect(0, 0, width, height);
		ctx.closePath();
		ctx.fill();
	}
	function MouseMove(e) {
		if (e.layerX || e.layerX == 0) { // Firefox
			mouse.x = e.layerX - c.offsetLeft;
			mouse.y = e.layerY - c.offsetTop;
			if (down){
				ctx.clearRect(mouse.x - (mouseSize/2), mouse.y - (mouseSize/2), mouseSize, mouseSize);
				/*for(var i=0; i<5; i++)
				{
					ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
					ctx.lineWidth = 5 + (5*i);
					ctx.beginPath();
					ctx.arc(mouse.x, mouse.y, mouseSize/2, 0, Math.PI*2, true); 
					ctx.closePath();
					ctx.stroke();  
				}*/
			}
		}
	}
	function MouseDown(e) {
		if (e.layerX || e.layerX == 0) {
			down = true;
		}
	}
	function MouseUp(e) {
		if (e.layerX || e.layerX == 0) {
			down = false;
		}
	}
	init();
}







