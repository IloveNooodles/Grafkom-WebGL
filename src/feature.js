let checked = [];
let modelList = [];
let pointList = [];
let tempX = 0;
let tempY = 0;
let tempScale = 1;
let tempShear = 0;
let tempRotation = 0;

function translation(positions, canvas) {
  //horizontal translation
  const xSlider = document.getElementById("x-translation");
  let tempX = 0;
  let newPositions = positions;

  xSlider.addEventListener("input", function () {
    let x = transformCoordinate(canvas, parseInt(xSlider.value), 0);
    let xTranslation = x[0] + 1;
    for (let i = 0; i < newPositions.length; i++) {
      newPositions[i][0] += xTranslation - tempX;
    }
    tempX = xTranslation;
  });

  //vertical translation
  const ySlider = document.getElementById("y-translation");
  let tempY = 0;

  ySlider.addEventListener("input", function () {
    let y = transformCoordinate(canvas, 0, parseInt(ySlider.value));
    let yTranslation = y[1] - 1;
    newPositions = positions;

    for (let i = 0; i < newPositions.length; i++) {
      newPositions[i][1] += yTranslation - tempY;
    }
    tempY = yTranslation;
  });
}

function dilatation(positions) {
  const scaleSlider = document.getElementById("dilatation");
  let newPositions = positions;
  let temp = 1;

  scaleSlider.addEventListener("input", function () {
    let scale = scaleSlider.value;
    for (let i = 0; i < newPositions.length; i += 1) {
      newPositions[i][0] *= scale / temp;
      newPositions[i][1] *= scale / temp;
    }
    temp = scale;
  });
}

function shear(positions, canvas) {
  const shearSlider = document.getElementById("shear");
  tempShear = 0;
  let newPositions = positions;

  shearSlider.addEventListener("input", function () {
    let shearValue = transformCoordinate(
      canvas,
      parseInt(shearSlider.value),
      0
    );
    let shear = shearValue[0] + 1;
    for (let i = 0; i < newPositions.length / 2; i++) {
      newPositions[i][0] += shear - temp;
    }
    tempShear = shear;
  });

  
}

// function rotation (type, positions, gl, program){
//   const rotationSlider = document.getElementById("rotation");
//   let newPositions = positions;
//   let temp = 0;
//   console.log(newPositions)
//   rotationSlider.addEventListener("input", function () {
//     let rotation = rotationSlider.value*Math.PI/180;
//     var center = getCentroid(newPositions);
//     //rotation on coordinate
//     for (let i = 0; i < newPositions.length; i += 1) {
//       newPositions[i][0] = (newPositions[i][0] - center[0]) * Math.cos(rotation - temp) - (newPositions[i][1] - center[1]) * Math.sin(rotation - temp) + center[0];
//       newPositions[i][1] = (newPositions[i][0] - center[0]) * Math.sin(rotation - temp) + (newPositions[i][1] - center[1]) * Math.cos(rotation - temp) + center[1];
//     temp = rotation;
//     }
//     clear();
//     if (type == "line") {
//       renderVertex(program, newPositions, 2);
//       for (let i = 0; i < newPositions.length; i++) {
//         gl.drawArrays(gl.LINES, i, 2);
//       }
//     } else if (type == "square" || type == "rectangle") {
//       renderVertex(program, newPositions, 2);
//       for (let i = 0; i < newPositions.length; i++) {
//         gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
//       }
//     }
//   });
// }

function changeColor(model) {
  const colorSlider = document.getElementById("color");
  colorSlider.addEventListener("input", function () {
    let color = getRGB(colorSlider.value);
    for (let i = 0; i < model.positions.length; i += 1) {
      if (model.positions[i] == model.selectedVertices) {
        model.colors[i][0] = color.r;
        model.colors[i][1] = color.g;
        model.colors[i][2] = color.b;
      }
    }
  });
}

function editObject() {
  let checkbox = document.querySelectorAll("input[type=checkbox]");
  checked = [];
  modelList = [];
  pointList = [];
  pointIndex = [];
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) {
      checked.push(checkbox[i].value);
    }
  }
  let list = filterSelectedObject(checked);
  modelList = list[0];
  pointList = list[1];
  pointIndex = list[2];

  const xSlider = document.getElementById("x-translation");
  tempX = 0;

  //horizontal translation
  xSlider.addEventListener("input", function () {
    let x = transformCoordinate(canvas, parseInt(xSlider.value), 0);
    let xTranslation = x[0] + 1;
    for (let p = 0; p < modelList.length; p++) {
      let model = modelList[p];
      for (let i = 0; i < model.positions.length; i++) {
        model.positions[i][0] += xTranslation - tempX;
      }
    }
    tempX = xTranslation;
  });

  //vertical translation
  const ySlider = document.getElementById("y-translation");
  tempY = 0;

  ySlider.addEventListener("input", function () {
    let y = transformCoordinate(canvas, 0, parseInt(ySlider.value));
    let yTranslation = y[1] - 1;
    for (let p = 0; p < modelList.length; p++) {
      let model = modelList[p];
      for (let i = 0; i < model.positions.length; i++) {
        model.positions[i][1] += yTranslation - tempY;
      }
    }
    tempY = yTranslation;
  });

  //dilatation
  const scaleSlider = document.getElementById("dilation");
  tempScale = 1;

  scaleSlider.addEventListener("input", function () {
    let scale = scaleSlider.value;
    for (let p = 0; p < modelList.length; p++) {
      let model = modelList[p];
      for (let i = 0; i < model.positions.length; i += 1) {
        model.positions[i][0] *= scale / tempScale;
        model.positions[i][1] *= scale / tempScale;
      }
    }
    tempScale = scale;
  });

  //shear
  const shearSlider = document.getElementById("shear");
  tempShear = 0;

  shearSlider.addEventListener("input", function () {
    let shearValue = transformCoordinate(
      canvas,
      parseInt(shearSlider.value),
      0
    );
    let shear = shearValue[0] + 1;
    for (let p = 0; p < modelList.length; p++) {
      let model = modelList[p];
      for (let i = 0; i < model.positions.length; i += 1) {
        model.positions[i][0] +=
          (model.positions[i][1] - 0) * (shear - tempShear);
      }
    }
    tempShear = shear;
  });

  //change color
  const colorSlider = document.getElementById("color");
  colorSlider.addEventListener("input", function () {
    let color = getRGB(colorSlider.value);
    console.log(color);
    for (let p = 0; p < modelList.length; p++) {
      let model = modelList[p];
      console.log(model);
      for (let i = 0; i < model.positions.length; i += 1) {
        model.colors[i][0] = color.r;
        model.colors[i][1] = color.g;
        model.colors[i][2] = color.b;
      }
    }
    for (let p = 0; p < pointList.length; p++) {
      let model = pointList[p];
      model.colors[pointIndex[p]-1][0] = color.r;
      model.colors[pointIndex[p]-1][1] = color.g;
      model.colors[pointIndex[p]-1][2] = color.b;
    }
  });

  for (let i = 0; i < modelList.length; i++) {
    if (modelList[i].constructor.name == "Polygon") {
      showPointPolyButtons();
      isPolygon = true;
      drawType = "polygon";
      editablePolygonIndex = i;
    } else {
      hidePointPolyButtons();
    }
  }

}

function filterSelectedObject(array) {
  let selectedModel = [];
  let selectedPoint = [];
  let modelInserted = [];
  let pointIndex = [];

  for (let i = 0; i < array.length; i++) {
    let m = array[i][0];
    if (array[i].length < 5) {
      if (m == "l") {
        selectedModel.push(models.line[array[i][1] - 1]);
        console.log(models.line[array[i][1] - 1]);
        modelInserted.push(array[i]);
      } else if (m == "s") {
        selectedModel.push(models.square[array[i][1] - 1]);
        modelInserted.push(array[i]);
      } else if (m == "r") {
        selectedModel.push(models.rectangle[array[i][1] - 1]);
        modelInserted.push(array[i]);
      }else if(m == "p"){
        selectedModel.push(models.polygon[array[i][1] - 1]);
        modelInserted.push(array[i]);
      }
    } else {
      let point = array[i].split("point")
      console.log(point)
      if (!modelInserted.includes(point[0])){
        if (m == "l"){
          selectedPoint.push(models.line[array[i][1]-1])
          modelInserted.push(array[i]);
          pointIndex.push(point[1]);
        }else if(m == "s"){
          selectedPoint.push(models.square[array[i][1]-1])
          modelInserted.push(array[i]);
          pointIndex.push(point[1]);
        }else if(m == "r"){
          selectedPoint.push(models.rectangle[array[i][1]-1])
          modelInserted.push(array[i]);
          pointIndex.push(point[1]);
        }else if(m == "p"){
          selectedPoint.push(models.polygon[array[i][1]-1])
          modelInserted.push(array[i]);
          pointIndex.push(point[1]);
        }
      }
    }
  }
  return [selectedModel, selectedPoint, pointIndex];
}

function printModels(model, obj) {
  console.log(model[0]);
  objCount = obj.length;
  pointCount = obj[objCount - 1].positions.length;
  console.log(obj[obj.length - 1].positions);
  let list = document.getElementById("list");
  object = document.createElement("li");
  object.innerHTML = `
  <input type="checkbox" id="${model[0]}${obj.length}" name="${model[0]}${obj.length}" value="${model[0]}${obj.length}" >
  <label for="${model[0]}${obj.length}">${model}${obj.length}</label><br>
   `;
  list.appendChild(object);
  for (let i = 1; i <= pointCount; i++) {
    let point = document.createElement("li");
    point.innerHTML = `
    <input type="checkbox" id="${model[0]}${obj.length}point${i}" name="${model[0]}${obj.length}point${i}" value="${model[0]}${obj.length}point${i}">
    <label for="${model[0]}${obj.length}point${i}">point${i}</label><br>
    `;

    object.appendChild(point);
  }
}
