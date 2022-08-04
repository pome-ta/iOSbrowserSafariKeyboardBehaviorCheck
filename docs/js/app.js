import { EditorView, basicSetup } from 'https://esm.sh/codemirror';
import { javascript } from 'https://esm.sh/@codemirror/lang-javascript';


const codeText = `function initShader() {
  gl = cxtCanvas.getContext('webgl2');
  //gl = cxtCanvas.getContext('webgl');
  const prg = create_program(
    create_shader('vs', vertexPrimitive),
    create_shader('fs', fragmentPrimitive)
  );
  uniLocation[0] = gl.getUniformLocation(prg, 'time');
  uniLocation[1] = gl.getUniformLocation(prg, 'mouse');
  uniLocation[2] = gl.getUniformLocation(prg, 'resolution');

  const position = new Float32Array([
    -1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0,
  ]);
  const index = new Uint16Array([0, 2, 1, 1, 2, 3]);

  const vPosition = create_vbo(position);
  const vIndex = create_ibo(index);
  const vAttLocation = gl.getAttribLocation(prg, 'vertexPosition');

  const VERTEX_SIZE = 3; // vec3

  gl.bindBuffer(gl.ARRAY_BUFFER, vPosition);
  gl.enableVertexAttribArray(vAttLocation);
  gl.vertexAttribPointer(vAttLocation, VERTEX_SIZE, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
}
`;

const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
editorDiv.style.width = '100%';
document.body.appendChild(editorDiv);



let editor = new EditorView({
  doc: codeText,
  extensions: [basicSetup, javascript()],
  parent: document.querySelector('#editorWrap'),
});
