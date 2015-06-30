/*
 * The purpose of this file is to set up event listeners for key presses when the client tries to move his
 * player. Key down events will push movement values into the keysPressedArr container and key up movements
 * will splice them out. The call to requestAnimationFrame in canvas.js will continuosly redraw the player
 * position based on what's in the keysPressedArr container.
 */

$(document).ready(function(){
  $(document).keydown(function(event){  //listening for arrow keys being pressed
    if(event.keyCode === 37 || event.keyCode === 65) {  // left
      if(keysPressedArr.indexOf("left") === -1){
        keysPressedArr.push("left");
      }
    }
    else if (event.keyCode === 38 || event.keyCode === 87){  // up
      if(keysPressedArr.indexOf("up") === -1){
        keysPressedArr.push("up");
      }
    }
    else if (event.keyCode === 39 || event.keyCode === 68){  // right
      if(keysPressedArr.indexOf("right") === -1){
        keysPressedArr.push("right");
      }
    }
    else if (event.keyCode === 40 || event.keyCode === 83){  // down
      if(keysPressedArr.indexOf("down") === -1){
        keysPressedArr.push("down");
      }
    }
  });

  $(document).keyup(function(event){  //listening for arrow keys being released
    if(event.keyCode === 37 || event.keyCode === 65) {  // left
      if(keysPressedArr.indexOf("left") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("left"), 1);
      }
    }
    else if (event.keyCode === 38 || event.keyCode === 87){  // up
      if(keysPressedArr.indexOf("up") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("up"), 1);
      }
    }
    else if (event.keyCode === 39 || event.keyCode === 68){  // right
      if(keysPressedArr.indexOf("right") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("right"), 1);
      }
    }
    else if (event.keyCode === 40 || event.keyCode === 83){  // down
      if(keysPressedArr.indexOf("down") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("down"), 1);
      }
    }
  });
});
