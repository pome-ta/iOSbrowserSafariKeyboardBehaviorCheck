"use strict"


document.addEventListener('DOMContentLoaded', viewportHandler);
visualViewport.addEventListener('resize', viewportHandler);

document.addEventListener('DOMContentLoaded', loadcanvas);



//console.log(visualViewport.height);
function viewportHandler(event) {
  document.documentElement.style.setProperty(
      '--visualViewport-height',
      `${visualViewport.height}px`
    );
  
  const targets = document.querySelectorAll('.log');
  for (const target of targets) {
    target.innerHTML = visualViewport.height;
  }
  
}




let myCanvas;

function loadcanvas() {
  myCanvas = document.querySelector('#mainCanvas');
  //const { clientWidth : w , clientHeight : h } =  myCanvas;
  const {width : w, height : h} =  myCanvas;
  const ctx = myCanvas.getContext('2d');
  ctx.fillStyle = 'maroon';
  ctx.fillRect(0, 0, w, h);
  ctx.beginPath();
  ctx.strokeStyle = 'blue';
  ctx.moveTo(0, 0); ctx.lineTo(w, h);
  ctx.moveTo(w, 0); ctx.lineTo(0, h);
  ctx.stroke();
}




