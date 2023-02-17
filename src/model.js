class Shape {
  constructor() {
    this.positions = [];
    this.colors = [];
    this.selected = false;
    this.selectedVetrices = [];
    this.scale = [0, 0];
    this.rotation = 0;
    this.translation = [0, 0];
    this.centroid = [0, 0]
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

  setCentroid() {
    this.centroid = centroid(this.positions);
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
    this.setCentroid();
    // console.log(this.positions);
    // console.log(this.centroid);

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
    this.setCentroid();
    // console.log(this.positions);
    // console.log(this.positions.length);
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
    this.setCentroid();

    let recSize = this.positions.length;
    // console.log(this.positions);
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
    // console.log(polyPoints);
    let vertexCount = polyPoints.length / 2;
    // console.log(vertexCount);
    for (let i = 0; i < polyPoints.length; i += 2) {
      this.positions.push(transformCoordinate(canvas, polyPoints[i], polyPoints[i + 1]));
      this.colors.push([0, 0, 0, 1]);
    }  
  }

  render(program) {
    // console.log(this.positions);
    // let polyCentroid = centroid(this.positions);
    // console.log(polyCentroid[0]);
    // console.log(polyCentroid[1]);
    this.setCentroid();

    let vertexCount = this.positions.length;
    renderColor(program, flatten(this.colors), 4);
    renderVertex(program, flatten(this.positions), 2);
    // console.log(vertexCount);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexCount);
    // for (let i = 0; i < vertexCount - 2; i += 1) {
    //   console.log("berapa kali");
    //   // console.log("1");
    //   gl.drawArrays(gl.TRIANGLE_FAN, i, vertexCount);
    //   // console.log("1");
    // }
  }
}
