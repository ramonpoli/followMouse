var canvas;
var ctx;
var eyes;
var mouse = {
	down: false,
	button: 1,
	x: 0,
	y: 0,
	px: 0,
	py: 0
};
var emoji1Sizes = {
	cx: 75,
	cy: -200,
	leftEye: {
		cx: 75 + 345,
		cy: -200 + 544
	},
	rightEye: {
		cx: 75 + 496,
		cy: -200 + 544
	},
	eyeRadius: 40
};
var emoji1 = new Image();
var debug = false;
window.requestAnimFrame =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};

$(document).ready(function() {
	canvas = document.getElementById('followMouseCanvas');
	ctx = canvas.getContext('2d');
	canvas.width = 1000;
	canvas.height = 750;

	canvas.onmousemove = function(e) {
		mouse.px = mouse.x;
		mouse.py = mouse.y;
		var rect = canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;
		e.preventDefault();
	};
	emoji1.src = 'https://www.dropbox.com/s/cjjjx02e71kkfox/emoji1_body.svg?raw=1';
	//emoji1.src = '/animations/followMouse/images/emoji1_body.svg';
	emoji1.width = '50';
	emoji1.height = '50';

	emoji1.onload = function() {
		ctx.drawImage(emoji1, emoji1Sizes.cx, emoji1Sizes.cy);
	};
	eyes = new Eyes();
	update();
});

function update() {
	eyes.draw();
	requestAnimFrame(update);
}

var Eyes = function() {
	this.eyes = [];
	this.eyes.push(new Eye(emoji1Sizes.leftEye.cx, emoji1Sizes.leftEye.cy, emoji1Sizes.eyeRadius));
	this.eyes.push(new Eye(emoji1Sizes.rightEye.cx, emoji1Sizes.rightEye.cy, emoji1Sizes.eyeRadius));
};

Eyes.prototype.draw = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(emoji1, emoji1Sizes.cx, emoji1Sizes.cy);
	if (debug)
		eyes.drawGrid();
	for ( var eyeKey in this.eyes)
		this.eyes[eyeKey].drawEye(mouse.x, mouse.y);
};

Eyes.prototype.drawGrid = function() {

	//positive y axis
	ctx.moveTo(emoji1Sizes.leftEye.cx, emoji1Sizes.leftEye.cy);
	ctx.lineTo(emoji1Sizes.leftEye.cx, 0);
	ctx.stroke();
	//positive y axis
	ctx.moveTo(emoji1Sizes.rightEye.cx, emoji1Sizes.rightEye.cy);
	ctx.lineTo(emoji1Sizes.rightEye.cx, 0);
	ctx.stroke();
	//negative y axis
	ctx.moveTo(emoji1Sizes.leftEye.cx, emoji1Sizes.leftEye.cy);
	ctx.lineTo(emoji1Sizes.leftEye.cx, canvas.height);
	ctx.stroke();
	//negative y axis
	ctx.moveTo(emoji1Sizes.rightEye.cx, emoji1Sizes.rightEye.cy);
	ctx.lineTo(emoji1Sizes.rightEye.cx, canvas.height);
	ctx.stroke();
	//positive x axis
	ctx.moveTo(emoji1Sizes.leftEye.cx, emoji1Sizes.leftEye.cy);
	ctx.lineTo(canvas.width, emoji1Sizes.leftEye.cy);
	ctx.stroke();
	//negative x axis
	ctx.moveTo(emoji1Sizes.leftEye.cx, emoji1Sizes.leftEye.cy);
	ctx.lineTo(0, emoji1Sizes.leftEye.cy);
	ctx.stroke();
	// inner circles
	ctx.arc(emoji1Sizes.leftEye.cx, emoji1Sizes.leftEye.cy, emoji1Sizes.eyeRadius, 0, 2 * Math.PI)

	ctx.arc(emoji1Sizes.rightEye.cx, emoji1Sizes.rightEye.cy, emoji1Sizes.eyeRadius, 0, 2 * Math.PI)

	ctx.strokeStyle = 'black';
	ctx.moveTo(emoji1Sizes.leftEye.cx, emoji1Sizes.leftEye.cy);
	ctx.lineTo(mouse.x, mouse.y);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.moveTo(emoji1Sizes.rightEye.cx, emoji1Sizes.rightEye.cy);
	ctx.lineTo(mouse.x, mouse.y);
	ctx.closePath();
	ctx.stroke();

};

var Eye = function(cx, cy, radius) {
	this.eyeImage = new Image();
	this.eyeImage.src = 'https://www.dropbox.com/s/szqsuxwql8zskp1/eye.svg?raw=1';

	this.x = cx;
	this.y = cy;
	this.radius = radius;
	this.eyeImage.onload = function() {
		ctx.drawImage(this.eyeImage, cx, cy);
	}
};

Eye.prototype.calculateQuadrant = function(mouseX, mouseY) {
	if (mouseX >= this.x && mouseY <= this.y)
		return 1;
	else if (mouseX < this.x && mouseY <= this.y)
		return 2;
	else if (mouseX <= this.x && mouseY > this.y)
		return 3;
	else if (mouseX > this.x && mouseY > this.y)
		return 4;
	else
		return false
};

Eye.prototype.drawEye = function(mouseX, mouseY) {
	this.quadrant = this.calculateQuadrant(mouseX, mouseY);
	var adjacent, oposite;
	switch(this.quadrant) {
		case (1):
			adjacent = ( mouseX - this.x );
			oposite = ( this.y - mouseY );
			break;
		case (2):
			adjacent = ( this.y - mouseY );
			oposite = ( this.x - mouseX );
			break;
		case (3):
			adjacent = ( this.x - mouseX );
			oposite = ( mouseY - this.y );
			break;
		case (4):
			adjacent = ( mouseY - this.y );
			oposite = ( mouseX - this.x );
			break;
	}
	this.angle = Math.atan( oposite / adjacent );

	this.smallAdjacent = this.radius * Math.cos(this.angle);
	this.smallOposite = this.radius * Math.sin(this.angle);
	switch(this.quadrant) {
		case (1):
			ctx.drawImage(this.eyeImage,this.x + this.smallAdjacent, this.y - this.smallOposite);
			break;
		case (2):
			ctx.drawImage(this.eyeImage,this.x - this.smallOposite, this.y - this.smallAdjacent);
			break;
		case (3):
			ctx.drawImage(this.eyeImage,this.x - this.smallAdjacent, this.y + this.smallOposite);
			break;
		case (4):
			ctx.drawImage(this.eyeImage,this.x + this.smallOposite, this.y + this.smallAdjacent);
			break;
	}
};
