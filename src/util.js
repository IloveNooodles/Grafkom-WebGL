function getMousePosition(canvas, e) {
  const position = canvas.getBoundingClientRect();
  const x = e.clientX - position.x;
  const y = e.clientY - position.y;
  return { x, y };
}

function getRGB(color) {
  //convert #ffffff to rgb
  const red = parseInt(color.substr(1, 2), 16);
  const green = parseInt(color.substr(3, 2), 16);
  const blue = parseInt(color.substr(5, 2), 16);

  //convert rgb to 0 to 1
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  return { r, g, b };
}

function resizeCanvas(canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    canvas.width = width;
    canvas.height = height;
  }

  return needResize;
}

function transformCoordinate(canvas, x, y) {
  const position = canvas.getBoundingClientRect();
  const [width, height] = [position.width, position.height];

  /* Converts from coordinate to zero to one */
  /* converts zero to one to zero to two */
  /* Converts zero to two to -1 to 1 */
  const realWidth = (x / width) * 2 - 1;
  const realHeight = (y / height) * -2 + 1;

  return [realWidth, realHeight];
}

/* TODO: Change this using 2d array */
/* Get nearest point */
// function getNearestPoint(x, y, points) {
//   let index = -1;
//   let minDistance = 100;
//   for (let i = 0; i < points.length - 2; i += 2) {
//     // euclidDistance()
//     let distance = Math.sqrt(
//       Math.pow(x - points[i], 2) + Math.pow(y - points[i + 1], 2)
//     );
//     console.log("distance", distance);
//     if (distance < minDistance) {
//       minDistance = distance;
//       index = i;
//     }
//   }
//   return index;
// }

function getNearestPoint(pointA, pointB) {
  let index = -1;
  let minDistance = 100;
  for (let i = 0; i < pointA.length - 2; i += 2) {
    let distance = euclidDistance(pointA, pointB);
    if (distance < minDistance) {
      minDistance = distance;
      index = i;
    }
    return index;
  }
}

function euclidDistance(pointA, pointB) {
  return Math.sqrt(
    Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2)
  );
}

function centroid(matrix) {
  let x = 0;
  let y = 0;
  // console.log(matrix);
  let vertexCount = matrix.length;
  // console.log(vertexCount);
  for (i = 0; i < vertexCount; i++) {
    x += matrix[i][0];
    y += matrix[i][1];
  }

  x = x / vertexCount;
  y = y / vertexCount;

  return [x,y];
}

// function destroySliderEventListener() {
//   const xSlider = document.getElementById("x-translation");
//   const ySlider = document.getElementById("y-translation");

//   // xSlider.removeEventListener("input", sliderMovedX);
//   // ySlider.removeEventListener("input", sliderMovedY);
// }

function selectObject(x, y) {
  let keys = Object.keys(models);
  let mousePos = transformCoordinate(canvas, x, y)
  let minDistance = 0.2;
  // console.log("1");
  for (let key of keys) {
    if (models[key].length !== 0) {
      console.log(models[key]);
      for (let model of models[key]) {
        // console.log("jumlah iterasi");
        // let shapeCentroid = centroid(model.positions);
        if (euclidDistance(mousePos, model.centroid) <= minDistance) {
          /* Kasus objek telah dipilih, dan akan memilih salah satu titik
          dari objek tersebut */
          if (model.selected === true) {
            selectVertex(model, mousePos);
          } else {
            model.selected = true;
            let type = key;
            console.log(key);
            translation(type, model.positions, canvas, gl, program);
          }
          // console.log("1");
          console.log(model.selected);
        } else {
          model.selected = false;
          console.log(model.selected);
        }
      }
    }
  }
  return;
}



function selectVertex(model, mousePos) {
  let vertexCount = model.positions.length;
  let minDistance = 0.2;
  for (i = 0; i < vertexCount; i++) {
    if (euclidDistance(mousePos, model.positions[i]) <= minDistance) {
      console.log("titik terpilih");
      console.log(model.positions[i]);
    }
  }
}

/* flatten 2d array to 1d */
function flatten(matrix) {
  let len = matrix.length;
  let n = len;
  let isArr = false;

  if (Array.isArray(matrix[0])) {
    isArr = true;
    n *= matrix[0].length;
  }

  let result = new Float32Array(n);
  let cur = 0;

  if (isArr) {
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        result[cur++] = matrix[i][j];
      }
    }
  } else {
    for (let i = 0; i < len; i++) {
      result[cur++] = matrix[i];
    }
  }

  return result;
}
