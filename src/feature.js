var isChecked = true;

function translation(type, positions, canvas, gl, program) {
  //horizontal translation
  const xSlider = document.getElementById("x-translation");
  let tempX = 0;
  let newPositions = positions;

  xSlider.addEventListener("input", function () {
    let x = transformCoordinate(canvas, parseInt(xSlider.value), 0);
    let xTranslation = x[0] + 1;
    newPositions = positions;
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

  clear();
  if (type == "line") {
    renderVertex(program, newPositions, 2);
    for (let i = 0; i < newPositions.length; i++) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  } else if (type == "square" || type == "rectangle") {
    renderVertex(program, newPositions, 2);
    for (let i = 0; i < newPositions.length; i++) {
      gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
    } 
  }
}

function dilatation(type, positions, gl, program) {
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

    clear();
    if (type == "line") {
      renderVertex(program, newPositions, 2);
      for (let i = 0; i < newPositions.length; i++) {
        gl.drawArrays(gl.LINES, i, 2);
      }
    } else if (type == "square" || type == "rectangle") {
      renderVertex(program, newPositions, 2);
      for (let i = 0; i < newPositions.length; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
      }
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
    for (let i = 0; i < points.length; i ++) {
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
