"use strict"

console.log('hoge');
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
