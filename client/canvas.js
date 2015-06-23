var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var maxWidth = 800;
var maxHeight = 600;
var minWidth = 0;
var minHeight = 0;
// var currentTopLeft = 10;
// var currentBotRight = 100;
var move = 5;

// var player = new Player("Dude", 1, startPosition, ctx, 1);
var enemy = new Enemy("Bad Guy", 2, {x:400, y:300}, ctx, 2);
var playerContainer = [ enemy ];
// var gravity = 1;

var flag = new Flag(50, 50, ctx);
var base1 = new Base( {ctx:ctx, teamId:1, x:150, y:300} );
var base2 = new Base( {ctx:ctx, teamId:2, x:800-150, y:300} );
var collisionContainer = Collisions;
// flag.capturedByPlayer(player);

var collisionDetection = function(collided, direction, posOrNeg){
  player.position[direction] += move * posOrNeg;

  playerContainer.forEach(function(otherPlayer){
    if(collisionContainer.playerDetection(player, otherPlayer)){
      console.log('we collided')
      collided = true;
    }
  });

  if (collisionContainer.windowDetection(player.position[direction], direction) && !collided) {
    player.move(player.position); //check to see if redundant;
    collisionContainer.flagDetection(player, flag);
  } else {
    player.position[direction] += move * posOrNeg * -1;
    collided = false;
  }
};

var update = function(){
  var collided = false;

  if(keysPressedArr.indexOf("right") > -1){
    collisionDetection(collided, 'x', 1);
  }
  if(keysPressedArr.indexOf("down") > -1){
    collisionDetection(collided, 'y', 1);
  }
  if(keysPressedArr.indexOf("left") > -1){
    collisionDetection(collided, 'x', -1);
  }
  if(keysPressedArr.indexOf("up") > -1){
    collisionDetection(collided, 'y', -1);
  }

  flag.update();
  base1.update();
  base2.update();

  // gravity
  // currentPosition.y+= gravity;
  // player.move(currentPosition);
};


var draw = function(){
  ctx.clearRect(minWidth, minHeight, maxWidth, maxHeight);
  player.draw();
  flag.draw();
  base1.draw();
  base2.draw();
  enemy.draw();
};

var render = function(){
  update();
  draw();

  requestAnimationFrame(render);
};
