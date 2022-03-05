"use strict"

//console.log(visualViewport.height);
function viewportHandler(event) {
  document.documentElement.style.setProperty(
      '--visualViewport-height',
      `${visualViewport.height}px`
    );
  //console.log(visualViewport.height);
  
  const targets = document.querySelectorAll('.log');
  //targets.innerHTML = visualViewport.height;
  for (const target of targets) {
    target.innerHTML = visualViewport.height;
  }
  
}


document.addEventListener('DOMContentLoaded', viewportHandler);
visualViewport.addEventListener('resize', viewportHandler);





const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
console.log(canvas);



