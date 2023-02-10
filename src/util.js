function getMousePosition(canvas, e) {
  const position = canvas.getBoundingClientRect();
  const x = e.clientX - position.x;
  const y = e.clientY - position.y;
  return { x, y };
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
  let nearestPoint = null;
  let minDistance = 0.05;
  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    let distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
    if (distance < minDistance) {
      minDistance = distance;
      nearestPoint = point;
    }
  }
  return nearestPoint;
}
