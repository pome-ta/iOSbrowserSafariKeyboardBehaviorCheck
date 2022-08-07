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

//import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';

import { oneDark } from '@codemirror/theme-one-dark';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';

const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
// editorDiv.style.backgroundColor = 'turquoise';
// editorDiv.style.backgroundColor = '#232323';
editorDiv.style.width = '100%';
//editorDiv.style.height = '100%';
document.body.appendChild(editorDiv);

const codeSample = `import math

def calc_distance(x1, y1, x2, y2):
    diff_x = x1 - x2
    diff_y = y1 - y2

    return math.sqrt(diff_x**2 + diff_y**2)
`;

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

const myHiChars = highlightSpecialChars({
  render: (code) => {
    let node = document.createElement('span');
    node.innerText = '•';
    node.title = '\\u' + code.toString(16);
    console.log(node);
    return node;
  },
  //specialChars: /[\x01-\x08\x0B-\x1F]/g
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
    keymap.of([...closeBracketsKeymap, ...completionKeymap]),
    /* --- basicSetup */
    //tabSize.of(EditorState.tabSize.of(4)),
    EditorView.lineWrapping, // 改行
    python(),
    //oneDark, // theme
    //myTheme, // custom
    //indentationMarkers(),
    //highlightSpecialChars(),
    myHiChars,
  ],
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});
