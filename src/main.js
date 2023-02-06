/* ==== Element and event listener ==== */
const lineButton = document.getElementById("line");
lineButton.addEventListener("click", function () {
  draw("line");
});

const squareButton = document.getElementById("square");
squareButton.addEventListener("click", function () {
  console.log("square");
});

const rectangleButton = document.getElementById("rectangle");
rectangleButton.addEventListener("click", function () {
  console.log("rectangle");
});

const polygonButton = document.getElementById("polygon");
polygonButton.addEventListener("click", function () {
  console.log("polygon");
});

const undoButton = document.getElementById("undo");
undoButton.addEventListener("click", function () {
  console.log("undo");
});

const redoButton = document.getElementById("redo");
redoButton.addEventListener("click", function () {
  console.log("redo");
});

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", function () {
  console.log("clear");
});

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function () {
  console.log("save");
});

const loadButton = document.getElementById("load");
loadButton.addEventListener("click", function () {
  console.log("load");
});

const canvas = document.getElementById("canvas");

/* ==== Global Object ==== */
const vertexShaderText = [
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

const fragmentShaderText = [
  "precision mediump float;",
  "",
  "varying vec3 fragColor;",
  "void main()",
  "{",
  "  gl_FragColor = vec4(fragColor, 1.0);",
  "}",
].join("\n");

const gl = canvas.getContext("webgl");

/* ==== Function ==== */
window.onload = function start() {
  console.log("start");

  if (!gl) {
    alert("WebGL not supported");
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

function draw(model) {
  if (!gl) {
    alert("WebGL not supported");
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

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

  const program = gl.createProgram();
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
  } else if (model == "square") {
    //square
  } else if (model == "rectangle") {
    //rectangle
  } else if (model == "polygon") {
    //polygon
  }
}
