var isChecked = true;

function translation(positions, canvas, gl, program){
  //horizontal translation
  const xSlider = document.getElementById("x-translation");
  var tempX = 0;
  xSlider.addEventListener("input", function () {
    var x = transformCoordinate(canvas, xSlider.value, 0);
    var xTranslation = x.realWidth + 1;
    var newPositions = positions;
    if (tempX < xTranslation) {
      for (var i = 0; i < newPositions.length; i += 2) {
        newPositions[i] += (xTranslation - tempX);
      }
    } else {
      for (var i = 0; i < newPositions.length; i += 2) {
        newPositions[i] -= (tempX - xTranslation);
      }
    }
    tempX = xTranslation;

    renderVertex(program, newPositions, 2);
    clear();
    for (var i = 0; i < newPositions.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  });

  //vertical translation
  const ySlider = document.getElementById("y-translation");
  var tempY = 0;
  ySlider.addEventListener("input", function () {
    var y = transformCoordinate(canvas, 0, ySlider.value);
    var yTranslation = y.realHeight - 1;
    var newPositions = positions;
    if (tempY > yTranslation) {
      for (var i = 0; i < newPositions.length; i += 2) {
        newPositions[i+1] += (yTranslation - tempY);
      }
    } else {
      for (var i = 0; i < newPositions.length; i += 2) {
        newPositions[i+1] -= (tempY - yTranslation);
      }
    }
    tempY = yTranslation;

    renderVertex(program, newPositions, 2);
    clear();
    for (var i = 0; i < newPositions.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  });
}

function dilatation(positions, gl, program){
  const scaleSlider = document.getElementById("dilatation");
  var newPositions = positions;
  var temp = 1;
  scaleSlider.addEventListener("input", function () {
    var scale = scaleSlider.value;
    for (var i = 0; i < newPositions.length; i += 1) {
      newPositions[i] = positions[i]*scale/temp;
    }
    temp = scale;

    renderVertex(program, newPositions, 2);
    clear();
    for (var i = 0; i < newPositions.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  });
}

function changeColor( colors, points, canvas, gl, program){
  var colorInput = document.getElementById("color");
  var newColors = colors;
  colorInput.addEventListener("input", function () {
    var color = colorInput.value;
    color = getRGB(color);
    if (isChecked){
      for (var i = 0; i < newColors.length; i += 4) {
        newColors[i] = color.r;
        newColors[i+1] = color.g;
        newColors[i+2] = color.b;
      }
    } else {
      // canvas.addEventListener("mousedown", function (e) {
      //   console.log("click")
      //   let { x, y } = getMousePosition(canvas, e);
      //   let { realWidth, realHeight } = transformCoordinate(canvas, x, y);
      //   var index = getNearestPoint(realWidth, realHeight, points);
      //   newColors[index] = color.r;
      //   newColors[index+1] = color.g;
      //   newColors[index+2] = color.b;
      // });
    }

    renderColor(program, newColors, 4);
    clear();
    for (var i = 0; i < points.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  });
}

function handleAllPoints(value){
  if (value == "all"){
    isChecked = true;
  } else {
    isChecked = false;
  }
}
