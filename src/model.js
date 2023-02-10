function line(canvas, gl, program){
  let positions = [];
  let colors = [];
  canvas.addEventListener("mousedown", function (e) {
    let { x, y } = getMousePosition(canvas, e);
    let { realWidth, realHeight } = transformCoordinate(canvas, x, y);
    positions.push(realWidth, realHeight);
    colors.push(0, 0, 0, 1);

    if (positions.length % 4 == 0) {
      renderColor(program, colors, 4);
      renderVertex(program, positions, 2);

      clear();
      for (var i = 0; i < positions.length; i += 2) {
        gl.drawArrays(gl.LINES, i, 2);
      }
    }
  });

  clearButton.addEventListener("click", function () {
    clear();
    positions = [];
    colors = [];
  }
  );
}

function polygon(canvas, gl, program){
  // let vertexCount = 0
  // let positions = [];
  // let colors = [];
  // const startDrawPolygonButton = document.getElementById("mulai-gambar-polygon");
  // const stopDrawPolygonButton = document.getElementById("stop-gambar-polygon");
  canvas.addEventListener("mousedown", function addVertex(e){
    let { x, y } = getMousePosition(canvas, e);
    let { realWidth, realHeight } = transformCoordinate(canvas, x, y);
    positions.push(realWidth, realHeight);
    colors.push(0, 10, 10, 1);
    vertexCount++;
    // console.log("1");
  });

  

  stopDrawPolygonButton.addEventListener("click", function() {
    renderColor(program, colors, 4);
    renderVertex(program, positions, 2);
    // console.log("1");

    clear();
    for (var i = 0; i < positions.length; i += 2) {
      // console.log("1");
      gl.drawArrays(gl.TRIANGLE_FAN, i, vertexCount);
    }
    // console.log(vertexCount);
    
    canvas.removeEventListener("mousedown", function addVertex(e){});
    canvas.addEventListener("mousedown", function(e){
      let { x, y } = getMousePosition(canvas, e);
      let { realWidth, realHeight } = transformCoordinate(canvas, x, y);
      
      for (var i = 0; i < positions.length; i += 2){
        if (
            (realWidth <= positions[i] + 0.1) && (realWidth >= positions[i] - 0.1) &&
            (realHeight <= positions[i + 1] + 0.1) && (realHeight >= positions[i + 1] - 0.1)
            ) {
          deleteVertexButton.hidden = false;
          deleteVertexButton.addEventListener("click", function (i) {
            colors.splice(i, 4);
            positions.splice(i, 2);
            vertexCount--;
              
            // console.log("1");
            // console.log(positions);
            deleteVertexButton.hidden = true;
    
            //Render ulang
            const program = createShaderProgram(vertexShaderText, fragmentShaderText);
    
            console.log(positions);
            console.log(vertexCount);
    
            renderColor(program, colors, 4);
            renderVertex(program, positions, 2);
            clear();
            for (var j = 0; j < positions.length; j += 2) {
              // console.log("1");
              gl.drawArrays(gl.TRIANGLE_FAN, j, vertexCount);
            }
    
            console.log(positions);
            console.log(vertexCount);
          });
        }
        else {
          deleteVertexButton.hidden = true;
        }
      }
      // console.log("1");
    });

  });

  clearButton.addEventListener("click", function () {
    clear();
    positions = [];
    colors = [];
    vertexCount = 0;
  });

}

