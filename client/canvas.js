var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var maxWidth = 800;
var maxHeight = 600;
var minWidth = 0;
var minHeight = 0;
var currentTopLeft = 10;
var currentBotRight = 100;
var move = 1;

var startPosition = {
  x: 10,
  y: 10,
};

var player = new Player("Dude", 1, startPosition, ctx, 1);
// var gravity = 1;
var flag = new Flag(50, 50, ctx);
var base1 = new Base( {ctx:ctx, teamId:1, x:150, y:300} );
var base2 = new Base( {ctx:ctx, teamId:2, x:800-150, y:300} );
flag.capturedByPlayer(player);

var update = function(){
  var currentPosition = player.position;
  if(keysPressedArr.indexOf("right") > -1){
    currentPosition.x+=5;
    if (collisions(currentPosition.x, 'x')) {
      player.move(currentPosition);
    }
    else {
      currentPosition.x-=5;
    }
  }
  if(keysPressedArr.indexOf("down") > -1){
    currentPosition.y+=5;
    if (collisions(currentPosition.y, 'y')) {
      player.move(currentPosition);
    }
    else {
      currentPosition.y-=5;
    }
  }
  if(keysPressedArr.indexOf("left") > -1){
    currentPosition.x-=5;
    if (collisions(currentPosition.x, 'x')) {
      player.move(currentPosition);
    }
    else {
      currentPosition.x+=5;
    }
  }
  if(keysPressedArr.indexOf("up") > -1){
    currentPosition.y-=5;
    if (collisions(currentPosition.y, 'y')) {
      player.move(currentPosition);
    }
    else {
      currentPosition.y+=5;
    }
  }

  flag.update();
  base1.update();
  base2.update();

  // gravity
  // currentPosition.y+= gravity;
  // player.move(currentPosition);
};

var collisions = function(position, direction) {
  // tests for if moving in x or y direction
  if (direction === 'x') {
    if (position > minWidth + (player.radius - .01) && position < maxWidth - (player.radius - .01)) {
      return true;
    }
    else {
      console.log('we be stuck');
      return false;
    }
  }
  else {
    if (position > minHeight + (player.radius - .01) && position < maxHeight - (player.radius - .01)) {
      return true;
    }
    else {
      console.log('we be stuck Y');
      return false;
    }
  }
}
var draw = function(){
  ctx.clearRect(minWidth, minHeight, maxWidth, maxHeight);
  player.draw();
  flag.draw();
  base1.draw();
  base2.draw();
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
