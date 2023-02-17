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
  let temp = 0;
  let newPositions = positions;

  shearSlider.addEventListener("input", function () {
    let shearValue = transformCoordinate(canvas, parseInt(shearSlider.value), 0);
    let shear = shearValue[0] + 1;
    for (let i = 0; i < newPositions.length/2; i++) {
      newPositions[i][0] += shear - temp;
    }
    temp = shear;
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

function changeColor(model){
  const colorSlider = document.getElementById("color");
  colorSlider.addEventListener("input", function () {
    let color = getRGB(colorSlider.value);
    for (let i = 0; i < model.positions.length; i += 1) {
      if (model.positions[i] == model.selectedVertices){
        model.colors[i][0] = color.r;
        model.colors[i][1] = color.g;
        model.colors[i][2] = color.b;
      }
    }
  });
}