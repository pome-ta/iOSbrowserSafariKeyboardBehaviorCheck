import { EditorView } from 'codemirror';
import { basicSetup, minimalSetup } from 'codemirror';

import { EditorState, Compartment } from '@codemirror/state';
import {
  lineNumbers,
  highlightActiveLineGutter,
  dropCursor,
  highlightActiveLine,
  keymap,
} from '@codemirror/view';
import { indentOnInput, bracketMatching } from '@codemirror/language';
import { highlightSelectionMatches } from '@codemirror/search';
import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';

import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';

const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
// editorDiv.style.backgroundColor = 'turquoise';
// editorDiv.style.backgroundColor = '#232323';
editorDiv.style.width = '100%';
//editorDiv.style.height = '100%';
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


const tabSize = new Compartment();

const state = EditorState.create({
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
    keymap.of([...closeBracketsKeymap, ...completionKeymap]),
    /* --- basicSetup */
    tabSize.of(EditorState.tabSize.of(2)),
    EditorView.lineWrapping, // 改行
    javascript(),
    oneDark, // theme
    myTheme, // custom
    indentationMarkers(),
  ]
})


const editor = new EditorView({
  doc: codeSample,
  state,
  parent: editorDiv,
});
