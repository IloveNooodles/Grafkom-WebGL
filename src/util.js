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

  return { r,g,b };
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

  return { realWidth, realHeight };
}

function getNearestPoint(x, y, points) {
  let index = -1;
  let minDistance = 100;
  for (let i = 0; i < points.length-2; i+=2) {
    let distance = Math.sqrt(Math.pow(x - points[i], 2) + Math.pow(y - points[i+1], 2));
    console.log("distance", distance)
    if (distance < minDistance) {
      minDistance = distance;
      index = i;
    }
  }
  return index;
}
