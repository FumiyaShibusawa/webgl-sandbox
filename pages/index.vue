<template>
  <canvas id="glCanvas" width="500" height="500"></canvas>
</template>
<style lang="scss" scoped>
#glCanvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
<script scoped>
import * as WebGLUtils from "@/assets/js/webgl_utils";
export default {
  mounted() {
    const canvas = document.getElementById("glCanvas");
    const gl = canvas.getContext("webgl");
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;

    const fsSource = `
      void main() {
        gl_FragColor = vec4(1, 0, 0.5, 1);
      }
    `;

    const shaderProgram = WebGLUtils.initShaderProgram(gl, vsSource, fsSource);
    const vertexPosition = gl.getAttribLocation(
      shaderProgram,
      "aVertexPosition"
    );
    const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];
    const buffers = WebGLUtils.initBuffers(gl, positions);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    gl.useProgram(shaderProgram);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
};
</script>
