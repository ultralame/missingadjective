var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "green"
ctx.fillRect(10,10, 100, 100);

var maxWidth = 800;
var maxHeight = 600;
var minWidth = 0;
var minHeight = 0;
var currentTopLeft = 10;
var currentBotRight = 100;
var move = 1;

var startPosition = {
  x1: 10,
  y1: 10,
  x2: 30,
  y2: 40
};

var player = new Player("Dude", 1, startPosition, ctx);

var update = function(){
  var currentPosition = player.position;
  if(keysPressedArr.indexOf("right") > -1){
    currentPosition.x1+=5;
    player.move(currentPosition);
  }
  if(keysPressedArr.indexOf("down") > -1){
    currentPosition.y1+=5;
    player.move(currentPosition);
  }
  if(keysPressedArr.indexOf("left") > -1){
    currentPosition.x1-=5;
    player.move(currentPosition);
  }
  if(keysPressedArr.indexOf("up") > -1){
    currentPosition.y1-=5;
    player.move(currentPosition);
  }
};

var draw = function(){
  ctx.clearRect(minWidth, minHeight, maxWidth, maxHeight);
  player.draw();
};

var render = function(){
  update();
  draw();
  // Clear the canvas (delete everything);
  requestAnimationFrame(render);
  // currentTopLeft += move;
  // currentBotRight += move;
  // ctx.fillRect(currentTopLeft, 10, currentBotRight, 100);
  // if (currentTopLeft < minWidth) {
  //   move *= -1;
  // }
  // else if (currentBotRight > maxWidth) {
  //   move *= -1;
  // };
};

render();
