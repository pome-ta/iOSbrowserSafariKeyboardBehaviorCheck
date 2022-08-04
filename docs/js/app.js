import { EditorView, basicSetup } from 'https://esm.sh/codemirror';
import { javascript } from 'https://esm.sh/@codemirror/lang-javascript';

const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
editorDiv.style.width = '100%';
document.body.appendChild(editorDiv);


const defaultValue = `📝 2022/07/23

class 用途に置き換えていく

keyboard と、key(s) を同時に持たせてるのも気持ち悪いか

keyboard で持たせるもの

key.el を格納していたが、key 🎹を持たせることにしている

持たせる要素として、めちゃくちゃ大きいから、メモリ的にはもったいない？

settings のキーボード設定

どのくらいのオクターブを持たせるか？と、どの音からスタートするのか？との関係が少々面倒かも
🤔

`;

let view = new EditorView({
  doc: defaultValue,
  extensions: [basicSetup, javascript()],
  //parent: document.body,
  parent: document.querySelector('#editorWrap'),
});
