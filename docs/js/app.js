import { EditorView } from 'codemirror';
import { basicSetup, minimalSetup } from 'codemirror';

import { EditorState, Compartment } from '@codemirror/state';
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
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';

import { oneDark } from '@codemirror/theme-one-dark';
import { myOneDark } from './theme-my-oneDark.js';

import { indentationMarkers } from '@replit/codemirror-indentation-markers';

const statusAreaDiv = document.createElement('div');
statusAreaDiv.id = 'statusArea';
statusAreaDiv.style.width = '100%';
statusAreaDiv.style.height = '4rem';
statusAreaDiv.style.background = 'green';
//statusAreaDiv.style.position = 'absolute';

statusAreaDiv.style.position = 'fixed';
statusAreaDiv.style.bottom = 0;
statusAreaDiv.style.zIndex = 3;

//document.body.appendChild(statusAreaDiv);

const undoDiv = document.createElement('div');
undoDiv.textContent = 'undo';
undoDiv.style.width = '100%';
undoDiv.style.height = '4rem';
undoDiv.style.background = 'red';

//document.body.appendChild(undoDiv);

const redoDiv = document.createElement('div');
redoDiv.textContent = 'redo';
redoDiv.style.width = '100%';
redoDiv.style.height = '4rem';
redoDiv.style.background = 'blue';

//document.body.appendChild(redoDiv);

const backDiv = document.createElement('div');
backDiv.id = 'backWrap';
backDiv.style.width = '100%';
// backDiv.style.height = '900px';
backDiv.style.height = '100%';
// backDiv.style.background = 'blue';
// backDiv.style.opacity = 0.5;
// backDiv.style.position = 'sticky';
// backDiv.style.position = 'relative';
// backDiv.style.position = 'static';
backDiv.style.position = 'fixed';
backDiv.style.top = 0;
backDiv.style.left = 0;
backDiv.style.zIndex = 1;

const myCanvas = document.createElement('canvas');

function loadcanvas() {
  const w = backDiv.clientWidth;
  const h = backDiv.clientHeight;
  myCanvas.width = w;
  myCanvas.height = h;
  // const {width : w, height : h} =  myCanvas;
  const ctx = myCanvas.getContext('2d');
  ctx.fillStyle = 'maroon';
  ctx.fillRect(0, 0, w, h);
  ctx.beginPath();
  ctx.strokeStyle = 'blue';
  ctx.moveTo(0, 0);
  ctx.lineTo(w, h);
  ctx.moveTo(w, 0);
  ctx.lineTo(0, h);
  ctx.stroke();
  //console.log(window.visualViewport.height)
}

backDiv.appendChild(myCanvas);

const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
// editorDiv.style.backgroundColor = 'turquoise';
// editorDiv.style.backgroundColor = '#232323';
editorDiv.style.width = '100%';
editorDiv.style.display = 'flex';
editorDiv.style.flexDirection='column'
//editorDiv.style.height = '100%';
// editorDiv.style.position = 'absolute';
editorDiv.style.position = 'relative';
// editorDiv.style.position = 'static';
// editorDiv.style.position = 'sticky';
// editorDiv.style.position = 'fixed';
editorDiv.style.zIndex = 2;
editorDiv.style.top = 0;
//editorDiv.style.opacity = 0.5;

document.body.appendChild(backDiv);
document.body.appendChild(editorDiv);

const codeSample = `// シェーダを生成する関数
function create_shader(type, text) {
  let shader;
  // scriptタグのtype属性をチェック
  switch (type) {
    // 頂点シェーダの場合
    case 'vs':
      shader = gl.createShader(gl.VERTEX_SHADER);
      break;
    // フラグメントシェーダの場合
    case 'fs':
      shader = gl.createShader(gl.FRAGMENT_SHADER);
      break;
    default:
      return;
  }

  // 生成されたシェーダにソースを割り当てる
  gl.shaderSource(shader, text);
  // シェーダをコンパイルする
  gl.compileShader(shader);
  // シェーダが正しくコンパイルされたかチェック
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // 成功していたらシェーダを返して終了
    return shader;
  } else {
    // 失敗していたらエラーログをアラートしコンソールに出力
    // alert(gl.getShaderInfoLog(shader));
    console.log(gl.getShaderInfoLog(shader));
  }
}

// プログラムオブジェクトを生成しシェーダをリンクする関数
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

//const tabSize = new Compartment();

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
    //tabSize.of(EditorState.tabSize.of(4)),
    EditorView.lineWrapping, // 改行
    //python(),
    //cpp(),
    javascript(),
    //oneDark, // theme
    myOneDark, // theme
    // indentationMarkers(),
    backgroundOpacity,
    whitespaceShow,
  ],
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});

editorDiv.appendChild(statusAreaDiv);


document.addEventListener('DOMContentLoaded', loadcanvas);

window.addEventListener('resize', loadcanvas);

/*
undoDiv.addEventListener('click', () => {
  //console.log('hoge');
  undoDiv.style.background =
    undoDiv.style.background === 'red' ? 'blue' : 'red';

  //editor.focus();
  undo(editor);
});

redoDiv.addEventListener('click', () => {
  //console.log('hoge');
  redoDiv.style.background =
    redoDiv.style.background === 'red' ? 'blue' : 'red';

  //editor.focus();
  redo(editor);
});
*/
