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
import { indentationMarkers } from '@replit/codemirror-indentation-markers';

const backDiv = document.createElement('div');
backDiv.id = 'backWrap';
backDiv.style.width = '100%';
backDiv.style.height = '100%';
backDiv.style.opacity = 0.5;
// backDiv.style.position = 'sticky';
backDiv.style.position = 'relative';
// backDiv.style.top = 0;
backDiv.style.zIndex = 1;

// document.body.appendChild(backDiv);

const undoDiv = document.createElement('div');
undoDiv.textContent = 'undo';
undoDiv.style.width = '100%';
undoDiv.style.height = '4rem';
undoDiv.style.background = 'red';

document.body.appendChild(undoDiv);

const redoDiv = document.createElement('div');
redoDiv.textContent = 'redo';
redoDiv.style.width = '100%';
redoDiv.style.height = '4rem';
redoDiv.style.background = 'blue';

document.body.appendChild(redoDiv);

const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
// editorDiv.style.backgroundColor = 'turquoise';
// editorDiv.style.backgroundColor = '#232323';
editorDiv.style.width = '100%';
//editorDiv.style.height = '100%';
// editorDiv.style.position = 'absolute';
// editorDiv.style.position = 'relative';
// editorDiv.style.position = 'static';
// editorDiv.style.position = 'sticky';
// editorDiv.style.position = 'fixed';
// editorDiv.style.zIndex = 2;
// editorDiv.style.top = 0;



document.body.appendChild(editorDiv);

const codeSample = ``;

const myTheme = EditorView.baseTheme({
  '&.cm-editor': {
    fontSize: '0.8rem',
  },
  '.cm-scroller': {
    fontFamily:
      'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
  },
});

//const tabSize = new Compartment();

const u00b7 = '·'; // ラテン語中点
const u2018 = '∘'; // RING OPERATOR
const u2022 = '•'; // bullet
const u2023 = '‣'; // triangular bullet
const u2219 = '∙'; // BULLET OPERATOR
const u22c5 = '⋅'; // DOT OPERATOR
const u30fb = '・'; // 全角中点
const uff65 = '･'; // 半角中点

const whitespaceShow = highlightSpecialChars({
  render: (code) => {
    let node = document.createElement('span');
    node.style.opacity = 0.5;
    node.innerText = u22c5;
    node.title = '\\u' + code.toString(16);
    return node;
  },
  specialChars: /\x20/g,
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
    myTheme, // custom
    // indentationMarkers(),
    whitespaceShow,
  ],
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});


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



