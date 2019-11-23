<template>
  <div>
    <canvas id="glCanvas" width="500" height="500"></canvas>
  </div>
</template>
<style lang="scss" scoped>
#glCanvas {
  position: absolute;
  top: 50%;
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
        vertex: require("@/assets/shaders/points-on-click-by-buffer/vertex.glsl"),
        fragment: require("@/assets/shaders/points-on-click-by-buffer/fragment.glsl")
      }
    };
  },
  methods: {
    drawCanvas() {
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

      const a_Position = gl.getAttribLocation(glProgram, "a_Position");
      const buffer = gl.createBuffer();

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const points = [] as number[];
      canvas.addEventListener("mousedown", (event: MouseEvent) => {
        gl.clear(gl.COLOR_BUFFER_BIT);
        const target = event.target as HTMLCanvasElement;
        const rect = target.getBoundingClientRect();
        const x = ((event.clientX - rect.left - rect.width / 2) /
          (rect.width / 2)) as number;
        const y = ((rect.height / 2 - (event.clientY - rect.top)) /
          (rect.height / 2)) as number;
        points.push(x, y);

        const pointsData = Float32Array.from(points);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, pointsData, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.enableVertexAttribArray(a_Position);
        gl.drawArrays(gl.POINTS, 0, pointsData.length / 2);
      });
    }
  },
  mounted() {
    this.drawCanvas();
  }
});
</script>
