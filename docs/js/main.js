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
logAreaDiv.style.backgroundColor = '#bcbcbc';

function _createButtonWrap(width, height) {
  const wrap = document.createElement('div');
  wrap.style.width = width;
  wrap.style.height = height;
  wrap.style.display = 'flex';
  wrap.style.justifyContent = 'center';
  wrap.style.alignItems = 'center';
  return wrap;
}

function createIcon(char) {
  const icon = document.createElement('span');
  icon.textContent = char;
  icon.style.fontSize = '2rem';
  icon.style.fontWeight = 900;
  icon.style.color = '#fefefe';
  return icon;
}

function createActionButton(iconChar) {
  const icon = createIcon(iconChar);
  const wrap = _createButtonWrap(btnW, '100%');
  const button = _createButtonWrap('90%', '90%');
  button.style.borderRadius = btnRadius;
  button.style.backgroundColor = '#ababab';
  button.appendChild(icon);
  wrap.appendChild(button);
  return wrap;
}

const selectAllButton = createActionButton('⎁');
const redoButton = createActionButton('⤻');
const undoButton = createActionButton('⤺');

operationDiv.appendChild(logAreaDiv);
operationDiv.appendChild(selectAllButton);
operationDiv.appendChild(redoButton);
operationDiv.appendChild(undoButton);

document.body.appendChild(editorDiv);

undoButton.addEventListener('click', () => {
  undo(editor);
});

redoButton.addEventListener('click', () => {
  redo(editor);
});

selectAllButton.addEventListener('click', () => {
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
  const moveDistance = Math.round((endX - startX) / 8);
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
