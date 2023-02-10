const lineState = {
  positions: [],
  colors: [],
};

const squareState = {
  positions: [],
  colors: [],
};

const polygonState = {
  positions: [],
  colors: [],
};

const rectangleState = {
  positions: [],
  colors: [],
};

function line(canvas, gl, program, x, y) {
  //get mouse position
  lineState.positions.push(x, y);
  lineState.colors.push(0, 0, 0, 1);

  if (lineState.positions.length % 4 == 0) {
    renderColor(program, lineState.colors, 4);
    renderVertex(program, lineState.positions, 2);
    clear();
    for (var i = 0; i < lineState.positions.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  }

  translation(lineState.positions, canvas, gl, program);
  dilatation(lineState.positions, gl, program);
}
