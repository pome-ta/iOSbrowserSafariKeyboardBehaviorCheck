import {
  editor,
  editorDiv,
  undo,
  redo,
  EditorSelection,
} from './app.bundle.js';

document.body.style.backgroundColor = '#232323';

const operationDiv = document.createElement('div');
operationDiv.id = 'operationWrap';
operationDiv.style.width = '100%';
operationDiv.style.height = '3rem';
operationDiv.style.padding = '0.25rem';
operationDiv.style.backgroundColor = 'turquoise';
operationDiv.style.display = 'flex';
operationDiv.style.alignItems = 'center';

document.body.appendChild(operationDiv);

const btnW = '2rem';
const btnRadius = '8%';

const logAreaDiv = document.createElement('div');
logAreaDiv.id = 'logAreaWrap';
logAreaDiv.textContent = 'log area & move caret';
logAreaDiv.style.flexGrow = '1';
logAreaDiv.style.height = '100%';
logAreaDiv.style.border = '1px solid';
// logAreaDiv.style.borderRadius = btnRadius;
logAreaDiv.style.backgroundColor = '#bcbcbc';

const selectAllDiv = document.createElement('div');
selectAllDiv.id = 'selectAllWrap';
//selectAllDiv.textContent = '⎁';
selectAllDiv.textContent = 'A';
selectAllDiv.style.textAlign = 'center';
// selectAllDiv.textContent = 'select all';
selectAllDiv.style.width = btnW;
selectAllDiv.style.height = '100%';
selectAllDiv.style.border = '1px solid';
// selectAllDiv.style.borderRadius = btnRadius;
selectAllDiv.style.backgroundColor = '#ababab';

const redoDiv = document.createElement('div');
redoDiv.id = 'redoWrap';
//redoDiv.textContent = 'redo';
//redoDiv.textContent = '↪';
redoDiv.textContent = 'R';
redoDiv.style.textAlign = 'center';
redoDiv.style.width = btnW;
redoDiv.style.height = '100%';
redoDiv.style.border = '1px solid';
// redoDiv.style.borderRadius = btnRadius;
redoDiv.style.backgroundColor = '#ababab';

const undoDiv = document.createElement('div');
undoDiv.id = 'undoWrap';
//undoDiv.textContent = 'undo';
//undoDiv.textContent = '⎌';
undoDiv.textContent = 'U';
undoDiv.style.textAlign = 'center';
undoDiv.style.width = btnW;
undoDiv.style.height = '100%';
undoDiv.style.border = '1px solid';
// undoDiv.style.borderRadius = btnRadius;
undoDiv.style.backgroundColor = '#ababab';

operationDiv.appendChild(logAreaDiv);
operationDiv.appendChild(selectAllDiv);
operationDiv.appendChild(redoDiv);
operationDiv.appendChild(undoDiv);

document.body.appendChild(editorDiv);

undoDiv.addEventListener('click', () => {
  undo(editor);
});

redoDiv.addEventListener('click', () => {
  redo(editor);
});

selectAllDiv.addEventListener('click', () => {
  const endRange = editor.state.doc.length;
  const transaction = {
    selection: EditorSelection.create([EditorSelection.range(0, endRange)]),
  };
  editor.dispatch(transaction);
  editor.focus();
});

// todo: MouseEvent TouchEvent wrapper
const { touchBegan, touchMoved, touchEnded } = {
  touchBegan:
    typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  touchMoved:
    typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  touchEnded:
    typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};

let caret = 0;
let startX = 0;
let endX = 0;
function logAreaSwipeStart(event) {
  caret = editor.state.selection.main.anchor;
  startX = event.touches[0].pageX;
}

function logAreaSwipeMove(event) {
  event.preventDefault();
  endX = event.touches[0].pageX;
  const moveDistance = Math.round((endX - startX) / 16);
  startX = endX;
  caret += moveDistance;
  const cursor = caret >= 0 ? caret : 0;
  logAreaDiv.textContent = `${cursor}: ${moveDistance}`;
  editor.dispatch({
    selection: EditorSelection.create([EditorSelection.cursor(cursor)]),
  });
  editor.focus();
}

logAreaDiv.addEventListener(touchBegan, logAreaSwipeStart);

logAreaDiv.addEventListener(touchMoved, logAreaSwipeMove);
