class Shape {
  constructor(program) {
    this.program = program;
    this.positions = [];
    this.colors = [];
    this.selected = false;
    this.scale = [0, 0];
    this.rotation = 0;
    this.translation = [0, 0];
  }
  scale(x, y) {
    throw new Error("Must be implemented");
  }
  translate(x, y) {
    throw new Error("Must be implemented");
  }
  rotate(deg) {
    throw new Error("Must be implemented");
  }
  toggleSelect() {
    this.selected = !this.selected;
  }
  render() {
    throw new Error("Must be implemented");
  }
}

/* TODO: Define inheritance of the models */
class Line extends Shape {
  constructor(x, y, program) {
    super(program);
    for (let i = 0; i < 2; i++) {
      this.positions.push(transformCoordinate(canvas, x, y));
      this.colors.push([0, 0, 0, 1]);
    }
  }
  render() {
    renderColor(this.program, flatten(this.colors), 4);
    renderVertex(this.program, flatten(this.positions), 2);
    for (let i = 0; i < this.positions.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  }
}

class Square extends Shape {
  constructor(x, y, program) {
    super(program);
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

    this.colors.push(...tempColor);
    this.positions.push(...tempPosition);
  }
  render() {
    let arrSize = this.positions.length;

    renderColor(this.program, flatten(this.colors), 4);
    renderVertex(this.program, flatten(this.positions), 2);
    for (let i = 0; i < arrSize; i += 4) {
      gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
    }
  }
}

class Rectangle extends Shape {
  constructor(x, y, program) {
    for (let i = 0; i < 4; i++) {
      rectangleState.positions.push(transformCoordinate(canvas, x, y));
      rectangleState.colors.push([0, 0, 0, 1]);
    }
  }
  render() {}
}

class Polygon extends Shape {}

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
  // changeColor(
  //   "line",
  //   lineState.colors,
  //   lineState.positions,
  //   canvas,
  //   gl,
  //   program
  // );
}

function renderObject() {
  clear();

  // console.log(Object.keys(models));
  let keys = Object.keys(models);
  for (let key of keys) {
    for (let model of models[key]) {
      model.render();
    }
  }
  /* line */
  // renderColor(program, lineState.colors, 4);
  // renderVertex(program, flatten(lineState.positions), 2);
  // for (let i = 0; i < lineState.positions.length; i += 2) {
  //   gl.drawArrays(gl.LINES, i, 2);
  // }

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

  /* render per frame (1s / 60 frame) */
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
