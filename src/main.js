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
canvas.addEventListener("mousedown", function (e) {
  let { x, y } = getMousePosition(canvas, e);
  let { realWidth, realHeight } = transformCoordinate(canvas, x, y);
  draw();
});

/* ==== Global Object ==== */
const vertexShaderText = `
  precision mediump float;  
  attribute vec4 a_position;
  attribute vec3 vertColor;
  varying vec3 fragColor;

  void main() {
    fragColor = vertColor;
    gl_Position = a_position;
  }`;

/* to check change frag color to rgb */
const fragmentShaderText = `
  precision mediump float;
  varying vec3 fragColor;
  void main() {
    // gl_FragColor = vec4(fragColor, 1);
    gl_FragColor = vec4(0.2,1,0.3, 1);
  }`;

const gl = canvas.getContext("webgl");

/* ==== Function ==== */
window.onload = function start() {
  console.log("start");

  if (!gl) {
    alert("WebGL not supported");
  }

  clear();
};

function clear() {
  /* create a green tosca screen */
  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function loadShader(type, input) {
  let shader = gl.createShader(type);

  gl.shaderSource(shader, input);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling vertex shader!",
      gl.getShaderInfoLog(vertexShader)
    );
    return null;
  }

  return shader;
}

function createShaderProgram(vertexShaderText, fragmentShaderText) {
  const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderText);
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderText);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program!", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }

  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("ERROR validating program!", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }

  /* dont forget to delete after use it  */
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

function draw(model) {
  if (!gl) {
    alert("WebGL not supported");
  }
  const program = createShaderProgram(vertexShaderText, fragmentShaderText);

  if (!program) {
    return;
  }

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = [0, 0, 0, 0.5, 0.7, 0, 1, 0.2, 0.3];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  clear();

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  /* transfer from arraybuffer to array in js */
  gl.vertexAttribPointer(
    positionAttributeLocation,
    2,
    gl.FLOAT,
    gl.FALSE,
    0,
    0
  );
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  if (model == "line") {
    //line
  } else if (model == "square") {
    //square
  } else if (model == "rectangle") {
    //rectangle
  } else if (model == "polygon") {
    //polygon
  } else {
    return;
  }
}
