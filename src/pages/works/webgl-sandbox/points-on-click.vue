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
        vertex: require("@/assets/shaders/points-on-click/vertex.glsl"),
        fragment: require("@/assets/shaders/points-on-click/fragment.glsl")
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
      const u_FragColor = gl.getUniformLocation(glProgram, "u_FragColor");

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const points = [] as number[][];
      const colors = [] as number[][];
      canvas.addEventListener("mousedown", (el: MouseEvent) => {
        gl.clear(gl.COLOR_BUFFER_BIT);
        const rect = el.target.getBoundingClientRect();
        const x = ((el.clientX - rect.left - rect.width / 2) /
          (rect.width / 2)) as number;
        const y = ((rect.height / 2 - (el.clientY - rect.top)) /
          (rect.height / 2)) as number;
        points.push([x, y, 0.0]);
        colors.push([Math.abs(x), Math.abs(y), 1.0, 1.0]);
        for (let i = 0; i < points.length; i++) {
          gl.vertexAttrib3f(a_Position, ...points[i]);
          gl.uniform4f(u_FragColor, ...colors[i]);
          gl.drawArrays(gl.POINTS, 0, 1);
        }
      });
    }
  },
  mounted() {
    this.drawCanvas();
  }
});
</script>
