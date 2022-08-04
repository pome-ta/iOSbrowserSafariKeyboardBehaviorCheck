import { EditorView, basicSetup } from 'https://esm.sh/codemirror';
import { javascript } from 'https://esm.sh/@codemirror/lang-javascript';

let editor = new EditorView({
  extensions: [basicSetup, javascript()],
  parent: document.body,
});
