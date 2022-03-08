"use strict"


document.addEventListener('DOMContentLoaded', viewportHandler);
visualViewport.addEventListener('resize', viewportHandler);

document.addEventListener('DOMContentLoaded', loadcanvas);



function viewportHandler(event) {
  let offsetTop;
  const body_height = document.body.clientHeight;
  const window_height = window.innerHeight;
  if (body_height > window_height) {
    offsetTop = body_height + window_height;
  }
  document.documentElement.style.setProperty(
      '--visualViewport-height',
      `${visualViewport.height}px`
    );
    
  const log_text = `visualViewport.height: ${visualViewport.height}
  VisualViewport.offsetTop: ${VisualViewport.offsetTop}
  window.outerHeight: ${window.outerHeight}
  window.innerHeight: ${window.innerHeight}
  document.body: ${document.body.clientHeight}
  document.documentElement: ${document.documentElement.clientHeight}
  `;
  const targets = document.querySelectorAll('.log');
  for (const target of targets) {
    //target.innerHTML = log_text;
    target.innerText = log_text;
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




