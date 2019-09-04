<template>
  <div>
    <canvas id="glCanvas" width="500" height="500"></canvas>
    <button type="button" @click="drawCanvas">click</button>
  </div>
</template>
<style lang="scss" scoped>
#glCanvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
button {
  position: absolute;
  top: 12.5%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
<script scoped>
import * as WebGLUtils from "@/assets/js/webgl_utils";
export default {
  methods: {
    generateVertex(vertexNumber) {
      return Array.from(
        { length: vertexNumber * 2 },
        () => Math.random() * 2 - 1
      );
    },
    drawCanvas() {
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

      const shaderProgram = WebGLUtils.initShaderProgram(
        gl,
        vsSource,
        fsSource
      );
      const vertexPosition = gl.getAttribLocation(
        shaderProgram,
        "aVertexPosition"
      );
      const positions = this.generateVertex(4);
      const buffers = WebGLUtils.initBuffers(gl, positions);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexPosition);

      gl.useProgram(shaderProgram);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  mounted() {
    this.drawCanvas();
  }
};
</script>
