/* ==== Element and event listener ==== */
let isPolygon = false;
let isEditing = false;
let polyPoints = [];
let editablePolygon;
let editablePolygonPointIndex = [];
const lineButton = document.getElementById("line");
lineButton.addEventListener("click", function () {
  if (!isEditing) {
    hideDrawPolyButtons();
    isPolygon = false;
    drawType = "line";
  } else {
    alert("Click finish button first!");
  }
});

const squareButton = document.getElementById("square");
squareButton.addEventListener("click", function () {
  if (!isEditing) {
    hideDrawPolyButtons();
    isPolygon = false;
    drawType = "square";
  } else {
    alert("Click finish button first!");
  }
});

const rectangleButton = document.getElementById("rectangle");
rectangleButton.addEventListener("click", function () {
  if (!isEditing) {
    hideDrawPolyButtons();
    isPolygon = false;
    drawType = "rectangle";
  } else {
    alert("Click finish button first!");
  }
});

const polygonButton = document.getElementById("polygon");
polygonButton.addEventListener("click", function () {
  if (!isEditing) {
    isPolygon = true;
    showDrawPolyButtons();
  } else {
    alert("Click finish button first!");
  }
});

const startDrawPolygonButton = document.getElementById("mulai-gambar-polygon");
startDrawPolygonButton.addEventListener("click", function () {
  if (!isEditing) {
    drawType = "polygon";
  } else {
    alert("Click finish button first!");
  }
});

const stopDrawPolygonButton = document.getElementById("stop-gambar-polygon");
stopDrawPolygonButton.addEventListener("click", function () {
  if (!isEditing) {
    if (polyPoints.length > 2) {
      models.polygon.push(new Polygon(polyPoints));
      printModels("polygon", models.polygon);
      isPolygon = false;
      drawType = "";
      polyPoints = [];
    }
  } else {
    alert("Click finish button first!");
  }
});

const addPointPolygonButton = document.getElementById("tambah-titik-polygon");
addPointPolygonButton.addEventListener("click", function () {
  //let { r, g, b } = getRGB(rgb);
  if (!isEditing) {
    for (let i = 0; i < polyPoints.length; i += 2) {
      editablePolygon.positions.push(
        transformCoordinate(canvas, polyPoints[i], polyPoints[i + 1])
      );
      editablePolygon.colors.push([1, 1, 1, 1]);
      //console.log(editablePolygon.colors);
    }
    let vertexCount = editablePolygon.positions.length;
    editablePolygon.positions = convexHull(
      editablePolygon.positions,
      vertexCount
    );

    polyPoints = [];
    printModels("polygon", models.polygon);
  } else {
    alert("Click finish button first!");
  }
});

const deletePointPolygonButton = document.getElementById("hapus-titik-polygon");
deletePointPolygonButton.addEventListener("click", function () {
  if (!isEditing) {
    let deletePointCount = editablePolygonPointIndex.length;
    for (let i = 0; i < deletePointCount; i++) {
      //console.log("jumlah loop");
      editablePolygon.positions.splice(editablePolygonPointIndex[i], 1);
      editablePolygon.colors.splice(editablePolygonPointIndex[i], 1);
      for (let j = i + 1; j < editablePolygonPointIndex.length; j++) {
        editablePolygonPointIndex[j] -= 1;
      }
    }

    let vertexCount = editablePolygon.positions.length;
    editablePolygon.positions = convexHull(
      editablePolygon.positions,
      vertexCount
    );
    printModels("polygon", models.polygon);
  } else {
    alert("Click finish button first!");
  }
});

const editButton = document.getElementById("edit");
editButton.addEventListener("click", function () {
  isEditing = !isEditing;
  if (isEditing) {
    alert("You can start editing now!");
    editButton.textContent = "finish";
  } else {
    alert("Selected object are edited");
    editButton.textContent = "edit";
    uncheckObject();
  }
  document.getElementById("x-translation").value = "0";
  document.getElementById("y-translation").value = "0";
  document.getElementById("dilation").value = "1";
  document.getElementById("shear").value = "0";
  document.getElementById("rotation").value = "0";
  drawType = "edit";
  editObject();
});

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", function (e) {
  if (!isEditing) {
    location.reload();
  } else {
    alert("Click finish button first!");
  }
});

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function () {
  if (!isEditing) {
    let file = save();
    let link = document.createElement("a");
    link.setAttribute("download", "save.json");
    link.href = file;
    document.body.appendChild(link);
    link.click();
    alert("File saved");
  } else {
    alert("Click finish button first!");
  }
});

const loadInput = document.getElementById("load");
loadInput.addEventListener("input", function (e) {
  if (!isEditing) {
    load(e.target.files[0]);
    alert("File loaded!");
  } else {
    alert("Click finish button first!");
  }
});

const scaleSlider = document.getElementById("size");
scaleSlider.addEventListener("input", function (e) {
  size = parseInt(scaleSlider.value);
});

const helpButton = document.getElementById("help");
helpButton.addEventListener("click", function () {
  document.getElementById("modal").style.display = "block";
});

const closeButton = document.getElementsByClassName("close");
closeButton[0].addEventListener("click", function () {
  document.getElementById("modal").style.display = "none";
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
});

canvas.addEventListener("mouseup", function (e) {
  isDown = false;
});

const colorInput = document.getElementById("color");
colorInput.addEventListener("input", function (e) {
  rgb = e.target.value;
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

let rgb = "#000000";

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

  if (model === "line" && !isPolygon) {
    models.line.push(new Line(x, y, program));
    printModels("line", models.line);
  } else if (model === "square" && !isPolygon) {
    models.square.push(new Square(x, y, program));
    printModels("square", models.square);
  } else if (model === "rectangle" && !isPolygon) {
    models.rectangle.push(new Rectangle(x, y, program));
    printModels("rectangle", models.rectangle);
  } else if (model === "polygon") {
    polyPoints.push(x, y);
  } else {
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
        let obj = new Polygon(polyPoints);
        obj.copy(item);
        console.log(item, obj);
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
  addPointPolygonButton.hidden = true;
  deletePointPolygonButton.hidden = true;
}

function showDrawPolyButtons() {
  startDrawPolygonButton.hidden = false;
  stopDrawPolygonButton.hidden = false;
}

function hidePointPolyButtons() {
  addPointPolygonButton.hidden = true;
  deletePointPolygonButton.hidden = true;
}

function showPointPolyButtons() {
  addPointPolygonButton.hidden = false;
  deletePointPolygonButton.hidden = false;
}
