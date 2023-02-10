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

  // translation(lineState.positions, canvas, gl, program);
  // dilatation(lineState.positions, gl, program);
  // changeColor(lineState.colors, lineState.positions, canvas, gl, program);
}

function renderObject(program) {
  clear();

  /* line */
  renderColor(program, lineState.colors, 4);
  renderVertex(program, lineState.positions, 2);
  if (lineState.positions.length % 4 == 0) {
    console.log("test");
    for (let i = 0; i < lineState.positions.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  }

  /* square */
  let arrSize = squareState.positions.length;

  renderColor(program, squareState.colors, 4);
  renderVertex(program, squareState.positions, 2);
  for (let i = 0; i < arrSize; i += 4) {
    gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
  }
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

  // let arrSize = squareState.positions.length;

  // console.log(squareState);
  // renderColor(program, squareState.colors, 4);
  // renderVertex(program, squareState.positions, 2);
  // clear();
  // for (let i = 0; i < arrSize; i += 4) {
  //   gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
  // }
}

function rectangle(canvas, gl, program, x, y, size) {}

function polygon() {}
