<template>
  <div>
    <canvas
      id="glCanvas"
      width="500"
      height="500"
      v-on:mouseover="animate()"
      v-on:mouseout="render()"
    ></canvas>
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
      textures: [
        {
          src: require("@/assets/images/sample-1024-1024.png")
        },
        {
          src: require("@/assets/images/sample2-1024-1024.png")
        }
      ],
      shaders: {
        vertex: require("@/assets/shaders/multi-texture-image/vertex.glsl"),
        fragment: require("@/assets/shaders/multi-texture-image/fragment.glsl")
      },
      vertices: {
        vertexCoords: [[-1.0, 1.0], [-1.0, -1.0], [1.0, 1.0], [1.0, -1.0]],
        textureCoords: [[0.0, 1.0], [0.0, 0.0], [1.0, 1.0], [1.0, 0.0]]
      },
      dispFactor: 0.0
    };
  },
  methods: {
    drawCanvas(
      vertices: Float32Array,
      textures: Array<HTMLImageElement>,
      dispFactor: number
    ): void {
      // Initializing gl context
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

      // Preparing buffer for shaders
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      const FSIZE = vertices.BYTES_PER_ELEMENT;

      // passing data to attribute buffer: (a_Position: vec4)
      const a_Position = gl.getAttribLocation(glProgram, "a_Position");
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
      gl.enableVertexAttribArray(a_Position);

      // passing data to attribute buffer: (a_texCoord: vec2)
      const a_texCoord = gl.getAttribLocation(glProgram, "a_texCoord");
      gl.vertexAttribPointer(
        a_texCoord,
        2,
        gl.FLOAT,
        false,
        FSIZE * 4,
        FSIZE * 2
      );
      gl.enableVertexAttribArray(a_texCoord);

      this.initTexture(gl, textures[0], gl.TEXTURE0);
      this.initTexture(gl, textures[1], gl.TEXTURE1);

      const u_Sampler0 = gl.getUniformLocation(glProgram, "u_Sampler0");
      gl.uniform1i(u_Sampler0, 0);
      const u_Sampler1 = gl.getUniformLocation(glProgram, "u_Sampler1");
      gl.uniform1i(u_Sampler1, 1);

      const u_DispFactor = gl.getUniformLocation(glProgram, "u_DispFactor");
      gl.uniform1f(u_DispFactor, dispFactor);

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    loadImages(...paths: Array<string>) {
      const promises = paths.map((path: string) => {
        return new Promise(resolve => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.src = path;
        });
      });
      return Promise.all(promises);
    },
    zip(...args: number[][]): Array<number> {
      const new_array = [] as Array<number>;
      for (let i = 0; i < args[0].length; i++) {
        new_array.push(...args.map(arg => arg[i]));
      }
      return new_array;
    },
    initTexture(
      gl: WebGLRenderingContext,
      texture: HTMLImageElement,
      textureUnit: number
    ): void {
      const tex = gl.createTexture();
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.activeTexture(textureUnit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        texture
      );
    },
    render() {
      const textures = this.$data.imgObjects;
      if (this.$data.dispFactor > 1.0) this.$data.dispFactor = 0.0;
      this.drawCanvas(this.$data.vertices, textures, this.$data.dispFactor);

      if (this.$data.reqId) cancelAnimationFrame(this.$data.reqId);
    },
    animate() {
      const dispFactor = this.$data.dispFactor;
      this.render();
      this.$data.dispFactor += 0.1;
      if (this.$data.dispFactor > 1.0) {
        cancelAnimationFrame(this.$data.reqId);
        return;
      }
      this.$data.reqId = requestAnimationFrame(this.animate);
      console.log(dispFactor, this.$data.reqId, arguments);
    }
  },
  mounted() {
    this.$data.vertices = new Float32Array(
      this.zip(
        this.$data.vertices.vertexCoords,
        this.$data.vertices.textureCoords
      ).flat()
    );
    const paths = this.$data.textures.map((data: any) => data.src);
    this.loadImages(...paths).then(textures => {
      this.$data.imgObjects = textures;
      this.render();
    });
  }
});
</script>
