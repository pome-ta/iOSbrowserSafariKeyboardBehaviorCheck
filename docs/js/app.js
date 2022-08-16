import { EditorView } from 'codemirror';
import { basicSetup, minimalSetup } from 'codemirror';

import { EditorState, EditorSelection, Compartment } from '@codemirror/state';
import {
  lineNumbers,
  highlightActiveLineGutter,
  dropCursor,
  highlightActiveLine,
  keymap,
  highlightSpecialChars,
} from '@codemirror/view';
import { indentOnInput, bracketMatching } from '@codemirror/language';
import { highlightSelectionMatches } from '@codemirror/search';
import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import { undo, redo, indentWithTab } from '@codemirror/commands';

import { javascript } from '@codemirror/lang-javascript';

import { oneDark } from '@codemirror/theme-one-dark';
import { myOneDark } from './theme-my-oneDark.js';

import { indentationMarkers } from '@replit/codemirror-indentation-markers';

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

const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
// editorDiv.style.backgroundColor = 'turquoise';
editorDiv.style.width = '100%';

document.body.appendChild(editorDiv);

const codeSample = `// プログラムオブジェクトを生成しシェーダをリンクする関数
function create_program(vs, fs) {
  // プログラムオブジェクトの生成
  const program = gl.createProgram();
  // プログラムオブジェクトにシェーダを割り当てる
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  // シェーダをリンク
  gl.linkProgram(program);
  // シェーダのリンクが正しく行なわれたかチェック
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // 成功していたらプログラムオブジェクトを有効にする
    gl.useProgram(program);
    // プログラムオブジェクトを返して終了
    return program;
  } else {
    // 失敗していたら NULL を返す
    return null;
  }
}
`;

const tabSize = new Compartment();

const u00b7 = '·'; // ラテン語中点
const u2018 = '∘'; // RING OPERATOR
const u2022 = '•'; // bullet
const u2023 = '‣'; // triangular bullet
const u2219 = '∙'; // BULLET OPERATOR
const u22c5 = '⋅'; // DOT OPERATOR
const u30fb = '・'; // 全角中点
const uff65 = '･'; // 半角中点

const ivory = '#abb2bf44'; // todo: oneDark から拝借
const stone = '#7d8799'; // Brightened compared to original to increase contrast  // 濃い灰色
const whitespaceShow = highlightSpecialChars({
  render: (code) => {
    let node = document.createElement('span');
    node.classList.add('cm-whoteSpace');
    // node.style.opacity = 0.5;
    node.style.color = ivory;
    // node.style.color = stone;
    node.innerText = u22c5;
    // node.innerText = uff65;
    node.title = '\\u' + code.toString(16);
    return node;
  },
  // specialChars: /\x20/g,
  addSpecialChars: /\x20/g,
});

const darkBackground = '#21252b44';
const backgroundOpacity = EditorView.theme({
  '.cm-line': { padding: 0 },
  '.cm-line *': { backgroundColor: darkBackground },
});

const state = EditorState.create({
  doc: codeSample,
  extensions: [
    minimalSetup,
    /* diff basicSetup */
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    dropCursor(),
    indentOnInput(),
    bracketMatching(),
    highlightSelectionMatches(),
    closeBrackets(),
    autocompletion(),
    keymap.of([...closeBracketsKeymap, ...completionKeymap, indentWithTab]),
    /* --- basicSetup */
    //
    tabSize.of(EditorState.tabSize.of(2)),
    EditorView.lineWrapping, // 改行
    javascript(),
    oneDark, // theme
    // myOneDark, // theme
    // indentationMarkers(),
    // backgroundOpacity,
    whitespaceShow,
  ],
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});

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
  const moveDistance = Math.round((endX - startX) / 8);
  //startX = endX
  caret += moveDistance;
  logAreaDiv.textContent = `${caret}: ${moveDistance}`;
  const cursor = caret >= 0 ? caret : 0;
  editor.dispatch({
    selection: EditorSelection.create([EditorSelection.cursor(cursor)]),
  });
  editor.focus();
}

logAreaDiv.addEventListener(touchBegan, logAreaSwipeStart);

logAreaDiv.addEventListener(touchMoved, logAreaSwipeMove);

/*
logAreaDiv.addEventListener(touchBegan, (e) => {
//logAreaDiv.addEventListener('click', (e) => {
  caret = editor.state.selection.main.anchor;
  // editor.dispatch({
  //   selection: { anchor: ++caret },
  // });
  // editor.focus();
  editor.dispatch({
    selection: EditorSelection.create([EditorSelection.cursor(++caret)]),
  });
  //editor.focus();
});

logAreaDiv.addEventListener(touchMoved, () => {
  event.preventDefault();
});


logAreaDiv.addEventListener(touchEnded, () => {
  editor.focus();
});

*/
