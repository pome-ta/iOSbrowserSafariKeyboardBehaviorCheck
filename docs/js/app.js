//import { EditorView, basicSetup } from 'https://cdn.skypack.dev/codemirror';

import { EditorState } from 'https://cdn.skypack.dev/@codemirror/state';
import { EditorView, keymap } from 'https://cdn.skypack.dev/@codemirror/view';
import { defaultKeymap } from 'https://cdn.skypack.dev/@codemirror/commands';
import { lineNumbers } from 'https://cdn.skypack.dev/@codemirror/gutter';

console.log(EditorState);

let startState = EditorState.create({
  doc: 'Hello World',
  extensions: [keymap.of(defaultKeymap)],
});

document.addEventListener('DOMContentLoaded', () => {
  let view = new EditorView({
    state: startState,
    parent: document.body,
  });
});
