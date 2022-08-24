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

const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
// editorDiv.style.backgroundColor = 'turquoise';
editorDiv.style.width = '100%';

//document.body.appendChild(editorDiv);

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

const overflowView = EditorView.theme({
  '&': { maxHeight: `${visualViewport.height}`, fontSize: '0.8rem' },
  '.cm-gutter,.cm-content': { minHeight: `${visualViewport.height}` },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily:
      'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
  },
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
    tabSize.of(EditorState.tabSize.of(2)),
    EditorView.lineWrapping, // 改行
    javascript(),
    oneDark, // theme
    // myOneDark, // theme
    // indentationMarkers(),
    // backgroundOpacity,
    whitespaceShow,
    overflowView,
  ],
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});

export { editor, editorDiv, undo, redo, EditorSelection };
