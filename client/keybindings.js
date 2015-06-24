$(document).ready(function(){
  //listening for arrow keys being pressed
  $(document).keydown(function(event){
    if(event.keyCode === 37) {
      // left

      if(keysPressedArr.indexOf("left") === -1){
        keysPressedArr.push("left");
      }

    }
    else if (event.keyCode === 38){
      // up

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
  });

  //listening for arrow keys being released
  $(document).keyup(function(event){
    if(event.keyCode === 37) {
      // left

      if(keysPressedArr.indexOf("left") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("left"), 1);
      }
    }
    else if (event.keyCode === 38){
      // up

      if(keysPressedArr.indexOf("up") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("up"), 1);
      }
    }
    else if (event.keyCode === 39){
      // right

      if(keysPressedArr.indexOf("right") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("right"), 1);
      }
    }
    else if (event.keyCode === 40){
      // down

      if(keysPressedArr.indexOf("down") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("down"), 1);
      }
    }
  });
});
