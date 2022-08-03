//import { EditorView, basicSetup } from 'https://cdn.skypack.dev/codemirror';

import {EditorState} from 'https://cdn.skypack.dev/@codemirror/state';
import {EditorView} from 'https://cdn.skypack.dev/@codemirror/view';
import {lineNumbers} from 'https://cdn.skypack.dev/@codemirror/gutter';

let startState = EditorState.create({
  doc: "Hello World",
  //extensions: [lineNumbers()]
})

let view = new EditorView({
  state: startState,
  parent: document.body,
});
