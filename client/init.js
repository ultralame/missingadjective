var envVariables = {
  player: null,
  flag: null,
  base0: null,
  base1: null,
  moveSpeed: 5,
  score: { team0: 0, team1: 0 },
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
To do:

Remove all canvasContext paramaters for classes and objects since it is
now global

Move client files to folders
*/
