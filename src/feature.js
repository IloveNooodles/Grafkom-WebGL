var isChecked = true;

function translation(positions, canvas, gl, program) {
  //horizontal translation
  const xSlider = document.getElementById("x-translation");
  let tempX = 0;
  xSlider.addEventListener("input", function () {
    let x = transformCoordinate(canvas, parseInt(xSlider.value), 0);
    let xTranslation = x.realWidth + 1;
    let newPositions = positions;
    if (tempX < xTranslation) {
      for (let i = 0; i < newPositions.length; i += 2) {
        newPositions[i] += xTranslation - tempX;
      }
    } else {
      for (let i = 0; i < newPositions.length; i += 2) {
        newPositions[i] -= tempX - xTranslation;
      }
    }
    tempX = xTranslation;

    renderVertex(program, newPositions, 2);
    clear();
    for (let i = 0; i < newPositions.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  });

  //vertical translation
  const ySlider = document.getElementById("y-translation");
  let tempY = 0;
  ySlider.addEventListener("input", function () {
    let y = transformCoordinate(canvas, 0, parseInt(ySlider.value));
    let yTranslation = y.realHeight - 1;
    let newPositions = positions;
    if (tempY > yTranslation) {
      for (let i = 0; i < newPositions.length; i += 2) {
        newPositions[i + 1] += yTranslation - tempY;
      }
    } else {
      for (let i = 0; i < newPositions.length; i += 2) {
        newPositions[i + 1] -= tempY - yTranslation;
      }
    }
    tempY = yTranslation;

    renderVertex(program, newPositions, 2);
    clear();
    for (let i = 0; i < newPositions.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  });
}

function dilatation(positions, gl, program) {
  const scaleSlider = document.getElementById("dilatation");
  let newPositions = positions;
  let temp = 1;
  scaleSlider.addEventListener("input", function () {
    let scale = parseInt(scaleSlider.value);
    for (let i = 0; i < newPositions.length; i += 1) {
      newPositions[i] = (positions[i] * scale) / temp;
    }
    temp = scale;

    renderVertex(program, newPositions, 2);
    clear();
    for (let i = 0; i < newPositions.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  });
}

function changeColor(colors, points, canvas, gl, program) {
  let colorInput = document.getElementById("color");
  let newColors = colors;
  colorInput.addEventListener("input", function () {
    let color = parseInt(colorInput.value);
    color = getRGB(color);
    if (isChecked) {
      for (let i = 0; i < newColors.length; i += 4) {
        newColors[i] = color.r;
        newColors[i + 1] = color.g;
        newColors[i + 2] = color.b;
      }
    } else {
      // canvas.addEventListener("mousedown", function (e) {
      //   console.log("click")
      //   let { x, y } = getMousePosition(canvas, e);
      //   let { realWidth, realHeight } = transformCoordinate(canvas, x, y);
      //   let index = getNearestPoint(realWidth, realHeight, points);
      //   newColors[index] = color.r;
      //   newColors[index+1] = color.g;
      //   newColors[index+2] = color.b;
      // });
    }

    renderColor(program, newColors, 4);
    clear();
    for (let i = 0; i < points.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  });
}

function handleAllPoints(value) {
  if (value == "all") {
    isChecked = true;
  } else {
    isChecked = false;
  }
}
