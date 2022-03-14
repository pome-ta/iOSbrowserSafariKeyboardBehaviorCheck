"use strict"


document.addEventListener('DOMContentLoaded', viewportHandler);
visualViewport.addEventListener('resize', viewportHandler);

window.addEventListener('scroll', viewportHandler);

document.addEventListener('DOMContentLoaded', loadcanvas);
/*
draw();
  function draw() {
    requestAnimationFrame(draw);
    viewportHandler();
    loadcanvas();
}
*/

function viewportHandler() {
  let offsetTop;
  let wrapper_height;
  const body_height = document.body.clientHeight;
  const window_height = window.innerHeight;
  if (body_height > window_height) {
    offsetTop = body_height + window_height;
  } else {
    offsetTop = 0;
  }
  
  /*
  const visualViewport_height = visualViewport.height;
  const window_innerHeight = window.innerHeight;
  const window_pageYOffset = window.pageYOffset;
  
  if (visualViewport_height === window_innerHeight) {
    offsetTop = 0;
  } else {
    //offsetTop = window_pageYOffset;
    offsetTop = 0;
  }
  */
  
  
  const canvasWrapper = document.querySelector('.canvasWrapper');
  const canvasWrapper_top = canvasWrapper.getBoundingClientRect().top;
  
  if (0 < canvasWrapper_top) {
    offsetTop = 0;
  } else {
    offsetTop = -(canvasWrapper_top);
  }
  
  
  
  document.documentElement.style.setProperty(
      '--visualViewport-height',
      `${visualViewport.height}px`
    );
  document.documentElement.style.setProperty(
      '--offset-top',
      `${offsetTop}px`
    );
  
  const wrapper = document.querySelector('.wrapper');
  const relativePositionTop = wrapper.getBoundingClientRect().top;
  const relativePositionBottom = wrapper.getBoundingClientRect().bottom - window.innerHeight;
  
  const body_ele = document.querySelector('body');
  //console.log(body_ele);
  
  
  
  const cli = wrapper.getBoundingClientRect();
  const log_text = `visualViewport.height: ${visualViewport.height}
  window.innerHeight: ${window.innerHeight}
  document.body: ${document.body.clientHeight}
  window.pageYOffset: ${window.pageYOffset}
  offsetTop: ${offsetTop}
  relativePositionTop: ${relativePositionTop}
  relativePositionBottom: ${relativePositionBottom}
  canvasWrapper_top: ${canvasWrapper_top}
  
  
  `;
  const targets = document.querySelectorAll('.log');
  for (const target of targets) {
    //target.innerHTML = log_text;
    target.innerText = log_text;
  }
}




//let myCanvas;

function loadcanvas() {
  let myCanvas = document.querySelector('#mainCanvas');
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




