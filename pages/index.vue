<template>
  <div>
    <canvas id="glCanvas" width="500" height="500"></canvas>
    <button type="button" @click="drawCanvas(generateVertex(4))">click</button>
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
<script lang="ts" scoped>
import Vue from "vue";
import { Context } from "@nuxt/types";
export default Vue.extend({
  asyncData(context: Context) {
    return {
      shaders: {
        vertex: require("@/assets/shaders/index/vertex.glsl"),
        fragment: require("@/assets/shaders/index/fragment.glsl")
      }
    };
  },
  methods: {
    generateVertex(vertexNumber: number): Float32Array {
      return Float32Array.from(
        { length: vertexNumber * 2 },
        () => Math.random() * 2 - 1
      );
    },
    drawCanvas(vertices: Float32Array) {
      const canvas = document.getElementById("glCanvas") as HTMLCanvasElement;
      const gl = canvas.getContext("webgl") as WebGLRenderingContext;
      const vsSource = this.$data.shaders.vertex.default;
      const fsSource = this.$data.shaders.fragment.default;

      const glProgram = this.$initWebGLProgram(
        gl,
        vsSource,
        fsSource
      ) as WebGLProgram;
      gl.useProgram(glProgram);

      const aPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, aPositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      // passing data to attribute buffer: vec4 a_Position
      const a_Position = gl.getAttribLocation(glProgram, "a_Position");
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },
  mounted() {
    this.drawCanvas(this.generateVertex(4));
  }
});
</script>
