var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "green"
ctx.fillRect(10,10, 100, 100);

var keysPressedArr = [];

$(document).ready(function(){
  //listening for arrow keys being pressed
  $(document).keydown(function(event){
    if(event.keyCode === 37) {
      // left
      console.log("pressed left");
      if(keysPressedArr.indexOf("left") === -1){
        keysPressedArr.push("left");
      }

    }
    else if (event.keyCode === 38){
      // up
      console.log("pressed up");
      if(keysPressedArr.indexOf("up") === -1){
        keysPressedArr.push("up");
      }
    }
    else if (event.keyCode === 39){
      // right
      if(keysPressedArr.indexOf("right") === -1){
        keysPressedArr.push("right");
      }
    }
    else if (event.keyCode === 40){
      // down
      if(keysPressedArr.indexOf("down") === -1){
        keysPressedArr.push("down");
      }
    }
    console.log(keysPressedArr);
  });

  //listening for arrow keys being released
  $(document).keyup(function(event){
    if(event.keyCode === 37) {
      // left
      console.log("released left");
      if(keysPressedArr.indexOf("left") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("left"), 1);
      }
    }
    else if (event.keyCode === 38){
      // up
      console.log("released up");
      if(keysPressedArr.indexOf("up") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("up"), 1);
      }
    }
    else if (event.keyCode === 39){
      // right
      console.log("released right");
      if(keysPressedArr.indexOf("right") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("right"), 1);
      }
    }
    else if (event.keyCode === 40){
      // down
      console.log("released down");
      if(keysPressedArr.indexOf("down") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("down"), 1);
      }
    }
    console.log(keysPressedArr);
  });
});
