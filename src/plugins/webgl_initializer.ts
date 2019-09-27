import Vue from "vue";
declare module "vue/types/vue" {
  interface Vue {
    $initWebGLProgram(
      gl: WebGLRenderingContext,
      vsSource: string,
      fsSource: string
    ): WebGLProgram | null;
  }
}
Vue.prototype.$initWebGLProgram = (
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
) => {
  const createShader = (type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type) as WebGLShader;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(`Compiling shader failed: ${gl.getShaderInfoLog(shader)}`);
      return null;
    }
    return shader;
  };

  const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram() as WebGLProgram;
  if (vertexShader && fragmentShader) {
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  }

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Initializing program failed: ${gl.getProgramInfoLog(shaderProgram)}`
    );
    return null;
  }
  return shaderProgram;
};
