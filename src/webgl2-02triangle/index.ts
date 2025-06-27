import vertexShaderCode from "./vertex.glsl";
import fragmentShaderCode from "./fragment.glsl";

function createShader(gl: WebGL2RenderingContext, type: "vertex" | "fragment", source: string) {
  const shader = gl.createShader(type === "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
  if (!shader) return console.log("fail to create shader", source);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  //编译通过
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }
  //打印编译错误信息
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}
function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram();
  //链接这两个着色器成一个程序
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  //编译通过
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  }
  //打印编译错误信息
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function createAttribute(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  data: number[],
  attribute: string,
  size: number
) {
  const location = gl.getAttribLocation(program, attribute);
  const buffer = gl.createBuffer();
  //绑定buffer到ARRAY_BUFFER
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  //打开attribute
  gl.enableVertexAttribArray(location);
  //将buffer赋值给attribute的方式

  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
}

function main() {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.height = 800;
  canvas.width = 800;

  const gl = canvas.getContext("webgl2");

  if (!gl) {
    return alert("not support webgl2");
  }

  const vertexShader = createShader(gl, "vertex", vertexShaderCode);

  const fragmentShader = createShader(gl, "fragment", fragmentShaderCode);
  if (!vertexShader || !fragmentShader) return;
  const program = createProgram(gl, vertexShader, fragmentShader);

  if (!program) return;
  //创建vertext顶点数组
  const vao = gl.createVertexArray();
  //绑定当前使用的顶点数组
  gl.bindVertexArray(vao);
  createAttribute(gl, program, [0.5, 0.5, -0.5, -0.5, 0.5, -0.5], "a_position", 2);

  createAttribute(gl, program, [1, 0, 0, 0, 1, 0, 0, 0, 1], "a_color", 3);
  //调整视图大小
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  //清空画布
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //webgl使用程序
  gl.useProgram(program);

  //绑定 attribue或buffer
  gl.bindVertexArray(vao);
  //绘制三角形
  {
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 3;
    gl.drawArrays(primitiveType, offset, count);
  }
}
main();
