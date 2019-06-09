var elem = document.getElementById('canvas');
var canvas = {
  elem: elem,
  ctx: elem.getContext('2d'),
  width: elem.width,
  height: elem.height
}
var scale = 30000

function drawPoint(point) {
	var x = point.x/scale  * canvas.width;
	var y =  point.y/scale  * canvas.height;
	var ctx = canvas.ctx;
  ctx.fillStyle = "#e54949";
  ctx.fillRect(x, y, 8, 8);
};
function drawLine(pointA,pointB){
  var ax = pointA.x/scale  * canvas.width;
  var ay =  pointA.y/scale  * canvas.height;
  var bx = pointB.x/scale  * canvas.width;
  var by =  pointB.y/scale  * canvas.height;
  var ctx = canvas.ctx;
  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(ax,ay);
  ctx.lineTo(bx,by);
  ctx.stroke();
};
