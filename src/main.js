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
  // console.log(realWidth, realHeight);
  draw();
});

/* ==== Global Object ==== */
// const vertexShaderText = `
//   precision mediump float;
//   attribute vec2 vertPosition;
//   attribute vec3 vertColor;
//   varying vec3 fragColor;

//   void main()
//   {
//     fragColor = vertColor;
//     gl_Position = vec4(vertPosition, 0.0, 1.0);
//   }`;

// const fragmentShaderText = `
//   precision mediump float;
//   varying vec3 fragColor;
//   void main(){
//     gl_FragColor = vec4(fragColor, 1.0);
//   }`;
const vertexShaderText = `  // an attribute will receive data from a buffer
  attribute vec4 a_position;

  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position;
  }`;

const fragmentShaderText = ` // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
  }`;

const gl = canvas.getContext("webgl");

/* ==== Function ==== */
window.onload = function start() {
  console.log("start");

  if (!gl) {
    alert("WebGL not supported");
  }

  /* setting viewport */
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
  // gl.deleteShader(vertexShader);
  // gl.deleteShader(fragmentShader);

  return program;
}

function draw(model) {
  // create GLSL shaders, upload the GLSL source, compile the shaders
  // Link the two shaders into a program
  var program = createShaderProgram(vertexShaderText, fragmentShaderText);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = [0, 0, 0, 0.5, 0.7, 0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // code above this line is initialization code.
  // code below this line is rendering code.

  resizeCanvas(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
  // if (!gl) {
  //   alert("WebGL not supported");
  // }

  // clear();

  // const program = createShaderProgram(vertexShaderText, fragmentShaderText);

  // if (!program) {
  //   return;
  // }

  // const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  // const positionBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // var positions = [0, 0, 0, 0.5, 0.7, 0];
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // clear();

  // gl.useProgram(program);
  // gl.enableVertexAttribArray(positionAttributeLocation);

  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // /* transfer from arraybuffer to array in js */
  // gl.vertexAttribPointer(
  //   positionAttributeLocation,
  //   2,
  //   gl.FLOAT,
  //   gl.FALSE,
  //   0,
  //   0
  // );
  // gl.drawArrays(gl.TRIANGLES, 0, 3);

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

function initBufferPosition() {
  const bufferPos = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferPos);
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return bufferPos;
}
