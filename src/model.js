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

  translation(lineState.positions, canvas, gl, program);
  dilatation(lineState.positions, gl, program);
  changeColor(lineState.colors, lineState.positions, canvas, gl, program);
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

  renderColor(program, squareState.colors, 4);
  renderVertex(program, squareState.positions, 2);
  for (let i = 0; i < arrSize; i += 4) {
    gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
  }
  // window.requestAnimFrame(renderObject);
  // window.requestAnimationFrame(renderObject);
  window.requestAnimFrame(function (program) {
    renderObject(program);
  });
}

function square(canvas, gl, program, x, y) {
  /* add vertices by clockwise manner */
  let tempPosition = [];
  let tempColor = [];
  tempPosition.push(...transformCoordinate(canvas, x, y));
  tempPosition.push(...transformCoordinate(canvas, x + size, y));
  tempPosition.push(...transformCoordinate(canvas, x, y + size));
  tempPosition.push(...transformCoordinate(canvas, x + size, y + size));

  /* colors */
  for (let i = 0; i < 4; i++) {
    tempColor.push(0, 0, 0, 1);
  }

  squareState.colors = [...squareState.colors, ...tempColor];
  squareState.positions = [...squareState.positions, ...tempPosition];
}

function rectangle(canvas, gl, program, x, y, size) {}

function polygon() {}
