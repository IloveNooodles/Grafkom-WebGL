class Shape {
  constructor(name, type, positions, colors) {
    this.name = name;
    this.type = type;
    this.positions = positions;
    this.colors = colors;
  }
}

/* TODO: Define inheritance of the models */
class Line {}

class Square {}

class Rectangle {}

class Polygon {}

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
  for (i = 0; i < 2; i++) {
    lineState.positions.push(transformCoordinate(canvas, x, y));
    lineState.colors.push(0, 0, 0, 1);
  }

  translation("line", lineState.positions, canvas, gl, program);
  dilatation("line", lineState.positions, gl, program);
  changeColor(
    "line",
    lineState.colors,
    lineState.positions,
    canvas,
    gl,
    program
  );
}

function renderObject() {
  clear();

  /* line */
  renderColor(program, lineState.colors, 4);
  renderVertex(program, flatten(lineState.positions), 2);
  for (let i = 0; i < lineState.positions.length; i += 2) {
    gl.drawArrays(gl.LINES, i, 2);
  }

  /* square */
  let arrSize = squareState.positions.length;

  renderColor(program, flatten(squareState.colors), 4);
  renderVertex(program, flatten(squareState.positions), 2);
  for (let i = 0; i < arrSize; i += 4) {
    gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
  }

  /* rectangle */
  let recSize = rectangleState.positions.length;

  renderColor(program, flatten(rectangleState.colors), 4);
  renderVertex(program, flatten(rectangleState.positions), 2);
  for (let i = 0; i < recSize; i += 4) {
    gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
  }

  window.requestAnimFrame(function (program) {
    renderObject(program);
  });
}

function square(canvas, gl, program, x, y) {
  /* add vertices by clockwise manner */
  let tempPosition = [];
  let tempColor = [];
  tempPosition.push(transformCoordinate(canvas, x, y));
  tempPosition.push(transformCoordinate(canvas, x + size, y));
  tempPosition.push(transformCoordinate(canvas, x, y + size));
  tempPosition.push(transformCoordinate(canvas, x + size, y + size));

  /* colors */
  for (let i = 0; i < 4; i++) {
    tempColor.push([0, 0, 0, 1]);
  }

  squareState.colors.push(...tempColor);
  squareState.positions.push(...tempPosition);
 
  translation("square", squareState.positions, canvas, gl, program);
  dilatation("square", squareState.positions, gl, program);
}

function rectangle(canvas, gl, program, x, y) {
  for (let i = 0; i < 4; i++) {
    rectangleState.positions.push(transformCoordinate(canvas, x, y));
    rectangleState.colors.push([0, 0, 0, 1]);
  }

  translation("rectangle", rectangleState.positions, canvas, gl, program);
  dilatation("rectangle", rectangleState.positions, gl, program);
}

function polygon() {}
