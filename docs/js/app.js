//import { EditorView, basicSetup } from 'https://esm.sh/codemirror';
import { javascript } from 'https://esm.sh/@codemirror/lang-javascript';



import { EditorState } from 'https://esm.sh/@codemirror/state';
import { EditorView, keymap } from 'https://esm.sh/@codemirror/view';
import { defaultKeymap } from 'https://esm.sh/@codemirror/commands';




//import { cpp } from 'https://esm.sh/@codemirror/lang-cpp';



const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
editorDiv.style.width = '100%';
document.body.appendChild(editorDiv);


let startState = EditorState.create({
  doc: "Hello World",
  extensions: [keymap.of(defaultKeymap)]
})


let editor = new EditorView({
  state: startState,
  parent: document.querySelector('#editorWrap'),
});
