var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");
var program = gl.createProgram();
var start = function () {
  console.log("start")
  
  if (!gl) {
    alert("WebGL not supported");
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

var lineButton = document.getElementById("line");
  lineButton.addEventListener("click", function () {
  console.log("line");
});

var squareButton = document.getElementById("square");
  squareButton.addEventListener("click", function () {
  console.log("square");
});

var rectangleButton = document.getElementById("rectangle");
  rectangleButton.addEventListener("click", function () {
  console.log("rectangle");
});

var polygonButton = document.getElementById("polygon");
  polygonButton.addEventListener("click", function () {
  console.log("polygon");
});

var undoButton = document.getElementById("undo");
  undoButton.addEventListener("click", function () {
  console.log("undo");
});

var redoButton = document.getElementById("redo");
  redoButton.addEventListener("click", function () {
  console.log("redo");
});

var clearButton = document.getElementById("clear");
  clearButton.addEventListener("click", function () {
  console.log("clear");
});

var saveButton = document.getElementById("save");
  saveButton.addEventListener("click", function () {
  console.log("save");
});

var loadButton = document.getElementById("load");
  loadButton.addEventListener("click", function () {
  console.log("load");
});

