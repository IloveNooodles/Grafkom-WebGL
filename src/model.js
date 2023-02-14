class Shape {
  constructor() {
    this.positions = [];
    this.colors = [];
    this.selected = false;
    this.scale = [0, 0];
    this.rotation = 0;
    this.translation = [0, 0];
  }

  copy(obj) {
    this.positions = obj.positions;
    this.colors = obj.colors;
    this.selected = obj.selected;
    this.scale = obj.scale;
    this.rotation = obj.rotation;
    this.translation = obj.translation;
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

  move() {
    throw new Error("Must be implemented");
  }

  onRenderMove(x, y) {
    throw new Error("Must be implemented");
  }

  isClick() {
    return this;
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
  constructor(x, y) {
    super();
    for (let i = 0; i < 2; i++) {
      this.positions.push(transformCoordinate(canvas, x, y));
      this.colors.push([0, 0, 0, 1]);
    }
  }

  render(program) {
    renderColor(program, flatten(this.colors), 4);
    renderVertex(program, flatten(this.positions), 2);
    for (let i = 0; i < this.positions.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  }

  onRenderMove(x, y) {
    let len = this.positions.length;
    this.positions[len - 1][0] = x;
    this.positions[len - 1][1] = y;
  }
}

class Square extends Shape {
  constructor(x, y) {
    super();
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

  render(program) {
    let arrSize = this.positions.length;

    renderColor(program, flatten(this.colors), 4);
    renderVertex(program, flatten(this.positions), 2);
    for (let i = 0; i < arrSize; i += 4) {
      gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
    }
  }
}

class Rectangle extends Shape {
  constructor(x, y) {
    super();
    for (let i = 0; i < 4; i++) {
      this.positions.push(transformCoordinate(canvas, x, y));
      this.colors.push([0, 0, 0, 1]);
    }
  }
  render(program) {
    let recSize = this.positions.length;
    console.log(this.positions);
    renderColor(program, flatten(this.colors), 4);
    renderVertex(program, flatten(this.positions), 2);
    for (let i = 0; i < recSize; i += 4) {
      gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
    }
  }

  onRenderMove(x, y) {
    let len = this.positions.length;
    this.positions[len - 1][0] = x;
    this.positions[len - 1][1] = y;
    this.positions[len - 2][1] = y;
    this.positions[len - 3][0] = x;
  }
}

class Polygon extends Shape {
  constructor(polyPoints) {
    super();
    console.log(polyPoints);
    let vertexCount = polyPoints.length / 2;
    console.log(vertexCount);
    for (let i = 0; i < polyPoints.length; i += 2) {
      this.positions.push(transformCoordinate(canvas, polyPoints[i], polyPoints[i + 1]));
      this.colors.push([0, 0, 0, 1]);
    }  
  }

  render(program) {
    console.log(this.positions);
    let vertexCount = this.positions.length;
    renderColor(program, flatten(this.colors), 4);
    renderVertex(program, flatten(this.positions), 2);
    console.log(vertexCount);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexCount);
    // for (let i = 0; i < vertexCount - 2; i += 1) {
    //   console.log("berapa kali");
    //   // console.log("1");
    //   gl.drawArrays(gl.TRIANGLE_FAN, i, vertexCount);
    //   // console.log("1");
    // }
  }
}

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
