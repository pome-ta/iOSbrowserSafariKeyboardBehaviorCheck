import {
  editor,
  editorDiv,
  undo,
  redo,
  EditorSelection,
} from './app.bundle.js';

// document.body.style.backgroundColor = '#232323';

const operationDiv = document.createElement('div');
operationDiv.id = 'operationWrap';
operationDiv.style.width = '100%';
operationDiv.style.height = '2.5rem';
//operationDiv.style.padding = '0.25rem';
operationDiv.style.backgroundColor = 'turquoise';
operationDiv.style.display = 'flex';
operationDiv.style.alignItems = 'center';

document.body.appendChild(operationDiv);

const btnW = '2rem';
const btnRadius = '16%';

const logAreaDiv = document.createElement('div');
logAreaDiv.id = 'logAreaWrap';
logAreaDiv.textContent = 'log area & move caret';
logAreaDiv.style.flexGrow = '1';
logAreaDiv.style.height = '100%';
logAreaDiv.style.border = '1px solid';
// logAreaDiv.style.borderRadius = btnRadius;
logAreaDiv.style.backgroundColor = '#bcbcbc';

// const selectAllDiv = document.createElement('div');
// selectAllDiv.id = 'selectAllWrap';
// //selectAllDiv.textContent = '⎁';
// selectAllDiv.textContent = 'A';
// selectAllDiv.style.textAlign = 'center';
// // selectAllDiv.textContent = 'select all';
// selectAllDiv.style.width = btnW;
// selectAllDiv.style.height = '100%';
// selectAllDiv.style.border = '1px solid';
// // selectAllDiv.style.borderRadius = btnRadius;
// selectAllDiv.style.backgroundColor = '#ababab';

/* select All --- */
const selectAllDiv = document.createElement('div');
selectAllDiv.id = 'selectAllWrap';
selectAllDiv.style.width = btnW;
selectAllDiv.style.height = '100%';
selectAllDiv.style.display = 'flex';
selectAllDiv.style.justifyContent = 'center';
selectAllDiv.style.alignItems = 'center';

const selectAllButton = document.createElement('div');
selectAllButton.id = 'redoBtn';
selectAllButton.style.width = '90%';
selectAllButton.style.height = '90%';
selectAllButton.style.borderRadius = btnRadius;
selectAllButton.style.backgroundColor = '#ababab';
selectAllButton.style.display = 'flex';
selectAllButton.style.justifyContent = 'center';
selectAllButton.style.alignItems = 'center';

const selectAllIcon = document.createElement('span');
selectAllIcon.textContent = '⎁';

selectAllIcon.style.fontWeight = 900;
// selectAllIcon.style.transform = `rotate(${90}deg)`;
selectAllButton.appendChild(selectAllIcon);
selectAllDiv.appendChild(selectAllButton);
/* --- select All */

/* redo --- */
const redoDiv = document.createElement('div');
redoDiv.id = 'redoWrap';
redoDiv.style.width = btnW;
redoDiv.style.height = '100%';
redoDiv.style.display = 'flex';
redoDiv.style.justifyContent = 'center';
redoDiv.style.alignItems = 'center';

const redoButton = document.createElement('div');
redoButton.id = 'redoBtn';
redoButton.style.width = '90%';
redoButton.style.height = '90%';
redoButton.style.borderRadius = btnRadius;
redoButton.style.backgroundColor = '#ababab';
redoButton.style.display = 'flex';
redoButton.style.justifyContent = 'center';
redoButton.style.alignItems = 'center';

const redoIcon = document.createElement('span');
redoIcon.textContent = '⤻';
//redoIcon.style.transform = `rotate(${90}deg)`;
redoButton.appendChild(redoIcon);
redoDiv.appendChild(redoButton);
/* --- redo */

/* undo --- */
const undoDiv = document.createElement('div');
undoDiv.id = 'undoWrap';
//undoDiv.textContent = 'undo';
//undoDiv.textContent = '⎌';
//undoDiv.textContent = 'U';
// undoDiv.style.textAlign = 'center';
undoDiv.style.width = btnW;
undoDiv.style.height = '100%';
// undoDiv.style.border = '1px solid';
undoDiv.style.display = 'flex';
undoDiv.style.justifyContent = 'center';
undoDiv.style.alignItems = 'center';

// undoDiv.style.borderRadius = btnRadius;
//undoDiv.style.backgroundColor = '#ababab';

const undoButton = document.createElement('div');
undoButton.id = 'undoBtn';
// undoButton.textContent = 'Un';
undoButton.style.width = '90%';
undoButton.style.height = '90%';
undoButton.style.borderRadius = btnRadius;
undoButton.style.backgroundColor = '#ababab';
// undoButton.style.margin = '0 auto';
// undoButton.style.padding = '1rem';
undoButton.style.display = 'flex';
undoButton.style.justifyContent = 'center';
undoButton.style.alignItems = 'center';

const undoIcon = document.createElement('span');
undoIcon.textContent = '⤺';
undoIcon.style.fontSize = '2rem';
undoIcon.style.fontWeight = 900;
undoIcon.style.color = '#fefefe';
//undoIcon.style.transform = `rotate(${-90}deg)`;
//undoIcon.style.display = 'inline-block'
//undoIcon.style.verticalAlign = 'top'
undoButton.appendChild(undoIcon);
undoDiv.appendChild(undoButton);
/* --- undo */
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
  // todo: mobile しか想定していないけども
  startX = event.touches ? event.touches[0].pageX : event.pageX;
}

function logAreaSwipeMove(event) {
  event.preventDefault();
  // todo: mobile しか想定していないけども
  // xxx: ドラッグでの移動
  endX = event.touches ? event.touches[0].pageX : event.pageX;
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

