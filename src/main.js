/* ==== Element and event listener ==== */
let isPolygon = false;
let polyPoints = [];
const lineButton = document.getElementById("line");
lineButton.addEventListener("click", function () {
  hideDrawPolyButtons();
  isPolygon = false;
  drawType = "line";
});

const squareButton = document.getElementById("square");
squareButton.addEventListener("click", function () {
  hideDrawPolyButtons();
  isPolygon = false;
  drawType = "square";
});

const rectangleButton = document.getElementById("rectangle");
rectangleButton.addEventListener("click", function () {
  hideDrawPolyButtons();
  isPolygon = false;
  drawType = "rectangle";
});

const polygonButton = document.getElementById("polygon");
polygonButton.addEventListener("click", function () {
  isPolygon = true;
  showDrawPolyButtons();
});

const startDrawPolygonButton = document.getElementById("mulai-gambar-polygon");
startDrawPolygonButton.addEventListener("click", function () {
  drawType = "polygon";
});

const stopDrawPolygonButton = document.getElementById("stop-gambar-polygon");
stopDrawPolygonButton.addEventListener("click", function () {
  isPolygon = false;
  drawType = "";
  console.log(polyPoints);
  models.polygon.push(new Polygon(polyPoints, program));
  polyPoints = [];
});


const editButton = document.getElementById("edit");
editButton.addEventListener("click", function () {
  drawType = "edit";
});

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", function () {
  clear();
  resetState();
});

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function () {
  let file = save();
  let link = document.createElement("a");
  link.setAttribute("download", "save.json");
  link.href = file;
  document.body.appendChild(link);
  link.click();
});

const loadInput = document.getElementById("load");
loadInput.addEventListener("input", function (e) {
  load(e.target.files[0]);
});

const scaleSlider = document.getElementById("size");
scaleSlider.addEventListener("input", function (e) {
  size = parseInt(scaleSlider.value);
});

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
  selectObject(x, y);
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
    gl_PointSize = 10.0;
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

let drawType = null;
let size = parseInt(scaleSlider.value); /* size default for dilatation */
let isDown = false;
let savedFile = null;
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
  let [realWidth, realHeight] = transformCoordinate(canvas, x, y);
  if (type === "line") {
    /* get latest object and call on render move */
    let lenObject = models["line"].length;
    models["line"][lenObject - 1].onRenderMove(realWidth, realHeight);
  } else if (type === "rectangle") {
    /* get latest object and call on render move*/
    let lenObject = models["rectangle"].length;
    models["rectangle"][lenObject - 1].onRenderMove(realWidth, realHeight);
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

/* size is component per vertices */
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

function draw(model, x, y) {
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

  if (model === "line" && !isPolygon) {
    models.line.push(new Line(x, y, program));
  } else if (model === "square" && !isPolygon) {
    models.square.push(new Square(x, y, program));
  } else if (model === "rectangle" && !isPolygon) {
    models.rectangle.push(new Rectangle(x, y, program));
  } else if (model === "polygon") {
    polyPoints.push(x, y);
  } else {
    // dapet objectnya
    // edit mode
    // scale, ngubarh warna dll
    return;
  }
}

function save() {
  let jsonFile = JSON.stringify(models);
  let data = new Blob([jsonFile], { type: "application/json" });

  /* if already exists remove */
  if (savedFile !== null) {
    window.URL.revokeObjectURL(savedFile);
  }

  savedFile = window.URL.createObjectURL(data);
  return savedFile;
}

function loadModel(loadedModel) {
  resetState();
  let keys = Object.keys(loadedModel);
  for (let key of keys) {
    for (let item of loadedModel[key]) {
      if (key === "line") {
        let obj = new Line(0, 0);
        obj.copy(item);
        models[key].push(obj);
      } else if (key === "square") {
        let obj = new Square(0, 0);
        obj.copy(item);
        models[key].push(obj);
      } else if (key === "rectangle") {
        let obj = new Square(0, 0);
        obj.copy(item);
        models[key].push(obj);
      } else if (key === "polygon") {
        let obj = new Polygon();
        obj.copy(item);
        models[key].push(obj);
      }
    }
  }
}

function load(file) {
  let reader = new FileReader();
  reader.readAsText(file);
  reader.addEventListener("load", function (e) {
    loadModel(JSON.parse(reader.result));
  });
}

function resetState() {
  models.line = [];
  models.polygon = [];
  models.rectangle = [];
  models.square = [];
  polyPoints = [];
}

function renderObject() {
  clear();

  // console.log(Object.keys(models));
  let keys = Object.keys(models);
  for (let key of keys) {
    for (let model of models[key]) {
      model.render(program);
    }
  }

  /* render per frame (1s / 60 frame) */
  window.requestAnimFrame(function (program) {
    renderObject(program);
  });
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

function hideDrawPolyButtons() {
  startDrawPolygonButton.hidden = true;
  stopDrawPolygonButton.hidden = true;
}

function showDrawPolyButtons() {
  startDrawPolygonButton.hidden = false;
  stopDrawPolygonButton.hidden = false;
}
