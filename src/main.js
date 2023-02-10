/* ==== Element and event listener ==== */
let positions = [];
let colors = [];
let vertexCount = 0;
const startDrawPolygonButton = document.getElementById("mulai-gambar-polygon");
const stopDrawPolygonButton = document.getElementById("stop-gambar-polygon");
const deleteVertexButton = document.getElementById("hapus-vertex");

const lineButton = document.getElementById("line");
lineButton.addEventListener("click", function () {
  startDrawPolygonButton.hidden = true;
  stopDrawPolygonButton.hidden = true;
  draw("line");
});

const squareButton = document.getElementById("square");
squareButton.addEventListener("click", function () {
  startDrawPolygonButton.hidden = true;
  stopDrawPolygonButton.hidden = true;
  console.log("square");
});

const rectangleButton = document.getElementById("rectangle");
rectangleButton.addEventListener("click", function () {
  startDrawPolygonButton.hidden = true;
  stopDrawPolygonButton.hidden = true;
  console.log("rectangle");
});

const polygonButton = document.getElementById("polygon");
polygonButton.addEventListener("click", function () {
  startDrawPolygonButton.hidden = false;
  stopDrawPolygonButton.hidden = false;
});

startDrawPolygonButton.addEventListener("click", function() {
  draw("polygon");
})

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

/* size is component per vertecies */
function render(gl, program, attribute = "a_position", arr = [], size = 3) {
  const attributeLocation = gl.getAttribLocation(program, attribute);
  const buffer = gl.createBuffer();

  /* Change this settings later */
  const stride = 0;
  const offset = 0;
  const type = gl.FLOAT;
  const normalized = gl.FALSE;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);

  gl.useProgram(program);
  gl.enableVertexAttribArray(attributeLocation);
  gl.vertexAttribPointer(
    attributeLocation,
    size,
    type,
    normalized,
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

function draw(model) {
  if (!gl) {
    alert("WebGL not supported");
    return;
  }

  const program = createShaderProgram(vertexShaderText, fragmentShaderText);

  if (!program) {
    alert("Failed creating WebGL Program");
    return;
  }

  // const positions = [1, 1, 1, -1, -1, 1, -1, -1];
  // const colors = [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1];

  // renderColor(program, colors, 4);
  // renderVertex(program, positions, 2);

  // clear();
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);

  if (model == "line") {
    line(canvas, gl, program);
  } else if (model == "square") {
    //square
  } else if (model == "rectangle") {
    //rectangle
  } else if (model == "polygon") {
    polygon(canvas, gl, program);
  } else {
    return;
  }
}

function changeColor(color) {
  console.log(color);
}

// canvas.addEventListener("mousedown", function(e){
//   let { x, y } = getMousePosition(canvas, e);
//   let { realWidth, realHeight } = transformCoordinate(canvas, x, y);
  
//   for (var i = 0; i < positions.length; i += 2){
//     if (
//         (realWidth <= positions[i] + 0.1) && (realWidth >= positions[i] - 0.1) &&
//         (realHeight <= positions[i + 1] + 0.1) && (realHeight >= positions[i + 1] - 0.1)
//         ) {
//       deleteVertexButton.hidden = false;
//       deleteVertexButton.addEventListener("click", function (i) {
//         colors.splice(i, 4);
//         positions.splice(i, 2);
//         vertexCount--;
          
//         // console.log("1");
//         // console.log(positions);
//         deleteVertexButton.hidden = true;

//         //Render ulang
//         const program = createShaderProgram(vertexShaderText, fragmentShaderText);

//         console.log(positions);
//         console.log(vertexCount);

//         renderColor(program, colors, 4);
//         renderVertex(program, positions, 2);
//         clear();
//         for (var j = 0; j < positions.length; j += 2) {
//           // console.log("1");
//           gl.drawArrays(gl.TRIANGLE_FAN, j, vertexCount);
//         }

//         console.log(positions);
//         console.log(vertexCount);
//       });
//     }
//     else {
//       deleteVertexButton.hidden = true;
//     }
//   }
//   // console.log("1");
// });