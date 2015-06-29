/* The purpose of this file is to initialize variables to be used throughout the app */

var envVariables = { // initialize environment variables
  player: null,
  flag: null,
  base0: null,
  base1: null,
  moveSpeed: 5,
  score: { 0: 0, 1: 0 }, // key is the team number and value is the score on initialize
  playerContainer: {} // list of all other players in the room not including yourself
};

var windowVariables = { // initialize game board size
  maxWidth: 800,
  maxHeight: 600,
  minWidth: 0,
  minHeight: 0
};

var canvas = document.getElementById('canvas'); // cache our canvas
var canvasContext = canvas.getContext('2d'); // cache and set canvas to use 2d context

var keysPressedArr = []; // holds movement value on keydown; movement values spliced upon keyup
var Collisions = {};  // Initialize container to hold collision detection logic

var socket = io(); // initialize socket connection


/*
To do:

Remove all canvasContext paramaters for classes and objects since it is
now global

Move client files to folders
*/
