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