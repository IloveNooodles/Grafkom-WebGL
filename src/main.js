/* ==== Element and event listener ==== */
const lineButton = document.getElementById("line");
lineButton.addEventListener("click", function () {
  drawType = "line";
});

const squareButton = document.getElementById("square");
squareButton.addEventListener("click", function () {
  drawType = "square";
});

const rectangleButton = document.getElementById("rectangle");
rectangleButton.addEventListener("click", function () {
  drawType = "rectangle";
});

const polygonButton = document.getElementById("polygon");
polygonButton.addEventListener("click", function () {
  drawType = "polygon";
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
  clear();
  resetState();
});

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function () {
  console.log("save");
});

const loadButton = document.getElementById("load");
loadButton.addEventListener("click", function () {
  console.log("load");
});

const scaleSlider = document.getElementById("size");
scaleSlider.addEventListener("input", function (e) {
  size = parseInt(scaleSlider.value);
});

// const changeColorButton = document.getElementById("change-color");
// changeColorButton.addEventListener("change", function () {
//   canvas.addEventListener("mousedown", function (e) {
//     let { x, y } = getMousePosition(canvas, e);
//     let { realWidth, realHeight } = transformCoordinate(canvas, x, y);
//     let nearestPoint = getNearestPoint(realWidth, realHeight, points);
//   }
//   );
// });

const canvas = document.getElementById("canvas");
canvas.addEventListener("mousemove", function (e) {
  if (isDown) {
    let { x, y } = getMousePosition(canvas, e);
    /* TODO: Defined for each object how to move */
    onMove(drawType, x, y);
  }
});
canvas.addEventListener("mousedown", function (e) {
  let { x, y } = getMousePosition(canvas, e);
  isDown = true;
  draw(drawType, x, y, size);
});
canvas.addEventListener("mouseup", function (e) {
  isDown = false;
});

/* ==== Global Object ==== */
const vertexShaderText = `
  precision mediump float;  
  attribute vec4 a_position;
  attribute vec4 vertColor;
  varying vec4 fragColor;

  void main() {
    fragColor = vertColor;
    gl_Position = a_position;
  }`;

/* to check change frag color to rgb */
const fragmentShaderText = `
  precision mediump float;
  varying vec4 fragColor;
  void main() {
    gl_FragColor = fragColor;
    // gl_FragColor = vec4(0.2,1,0.3, 1);
  }`;

const gl = canvas.getContext("webgl");
const program = createShaderProgram(vertexShaderText, fragmentShaderText);

let drawType = "line";
let size = parseInt(scaleSlider.value); /* size default for dilatation */
let isDown = false;
let models = {
  line: [],
  square: [],
  rectangle: [],
  polygon: [],
};

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

function onMove(type, x, y) {
  if (type === "line") {
    let [realWidth, realHeight] = transformCoordinate(canvas, x, y);
    let len = lineState.positions.length;
    lineState.positions[len - 1][0] = realWidth;
    lineState.positions[len - 1][1] = realHeight;
  }
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

/* size is component per vertecies */
function render(
  gl,
  program,
  attribute = "a_position",
  arr = [],
  size = 3,
  type = gl.FLOAT,
  isNormalized = gl.FALSE
) {
  const attributeLocation = gl.getAttribLocation(program, attribute);
  const buffer = gl.createBuffer();

  /* Change this settings later */
  const stride = 0;
  const offset = 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);

  gl.useProgram(program);
  gl.enableVertexAttribArray(attributeLocation);
  gl.vertexAttribPointer(
    attributeLocation,
    size,
    type,
    isNormalized,
    stride,
    offset
  );
}

function renderColor(program, arr = [], size = 3) {
  render(gl, program, "vertColor", arr, size);
}

function renderVertex(program, arr = [], size = 3) {
  render(gl, program, "a_position", arr, size);
}

function draw(model, x, y, size = 5) {
  if (!gl) {
    alert("WebGL not supported");
    return;
  }

  if (!program) {
    alert("Failed creating WebGL Program");
    return;
  }

  // const positions = [0.7, 0.7, 0.3, 0.7, 0.7, 0.3, 0.3, 0.3, 0.1, 0.1];
  // const colors = [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1];

  // renderVertex(program, positions, 2);
  // renderColor(program, colors, 4);

  // clear();
  // gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);

  if (model === "line") {
    line(canvas, gl, program, x, y);
  } else if (model === "square") {
    square(canvas, gl, program, x, y);
  } else if (model === "rectangle") {
    //rectangle
  } else if (model === "polygon") {
    //polygon
  } else {
    return;
  }
}

function resetState() {
  lineState.positions = [];
  lineState.colors = [];
  squareState.positions = [];
  squareState.colors = [];
  rectangleState.positions = [];
  rectangleState.colors = [];
  polygonState.positions = [];
  polygonState.colors = [];
}

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

renderObject(program);
