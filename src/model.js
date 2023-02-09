function line(canvas, gl, program){
  let positions = [];
  let colors = [];
  canvas.addEventListener("mousedown", function (e) {
    let { x, y } = getMousePosition(canvas, e);
    let { realWidth, realHeight } = transformCoordinate(canvas, x, y);
    positions.push(realWidth, realHeight);
    colors.push(0, 0, 0, 1);

    if (positions.length % 4 == 0) {
      renderColor(program, colors, 4);
      renderVertex(program, positions, 2);

      clear();
      for (var i = 0; i < positions.length; i += 2) {
        gl.drawArrays(gl.LINES, i, 2);
      }
    }
  });

  clearButton.addEventListener("click", function () {
    clear();
    positions = [];
    colors = [];
  }
  );
}