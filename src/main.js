var vertexShaderText = [
  "precision mediump float;",
  "",
  "attribute vec2 vertPosition;",
  "attribute vec3 vertColor;",
  "varying vec3 fragColor;",
  "",
  "void main()",
  "{",
  "  fragColor = vertColor;",
  "  gl_Position = vec4(vertPosition, 0.0, 1.0);",
  "}",
].join("\n");

var fragmentShaderText = [
  "precision mediump float;",
  "",
  "varying vec3 fragColor;",
  "void main()",
  "{",
  "  gl_FragColor = vec4(fragColor, 1.0);",
  "}",
].join("\n");

var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");
export function start() {
  console.log("start");

  if (!gl) {
    alert("WebGL not supported");
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

var lineButton = document.getElementById("line");
lineButton.addEventListener("click", function () {
  draw("line");
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

function draw(model) {
  if (!gl) {
    alert("WebGL not supported");
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling vertex shader!",
      gl.getShaderInfoLog(vertexShader)
    );
    return;
  }
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling fragment shader!",
      gl.getShaderInfoLog(fragmentShader)
    );
    return;
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program!", gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("ERROR validating program!", gl.getProgramInfoLog(program));
    return;
  }
  if (model == "line") {
    //line
  }else if (model == "square") {
    //square
  }else if (model == "rectangle") {
    //rectangle
  }else if (model == "polygon") {
    //polygon
  }
}

