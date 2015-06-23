var envVariables = {
  player: null,
  flag: null,
  base1: null,
  base2: null,
  moveSpeed: 5,
  playerContainer: {}
};

var windowVariables = {
  maxWidth: 800,
  maxHeight: 600,
  minWidth: 0,
  minHeight: 0
}

var canvas = document.getElementById('canvas');
var canvasContext = canvas.getContext('2d');

var keysPressedArr = [];
var Collisions = {};

var socket = io();

/*
To do list for changes:
move = moveSpeed
ctx = canvasContext
collisionContainer = Collisions
*/
