<template>
  <div>
    <canvas id="glCanvas" width="500" height="500"></canvas>
    <script id="vsSource" type="vs">
  attribute vec4 a_Position;
  attribute vec2 a_texCoord;
  varying vec2 v_TexCoord;
  void main() {
    gl_Position = a_Position;
    v_TexCoord = a_texCoord;
  }
    </script>
    <script id="fsSource" type="fs">
  precision mediump float;
  uniform sampler2D u_Image;
  varying vec2 v_TexCoord;
  void main() {
    gl_FragColor = texture2D(u_Image, v_TexCoord);
  }
    </script>
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
        }
      ]
    };
  },
  mounted() {
    const canvas = document.getElementById("glCanvas");
    const gl = (<HTMLCanvasElement>canvas).getContext(
      "webgl"
    ) as WebGLRenderingContext;
    const vsSource = document.getElementById("vsSource") as HTMLScriptElement;
    const fsSource = document.getElementById("fsSource") as HTMLScriptElement;
    if (!vsSource && !fsSource) {
      alert(`Error occurred during fetching shader sources`);
    }
    const glProgram = this.$initWebGLProgram(
      gl,
      vsSource.innerText,
      fsSource.innerText
    ) as WebGLProgram;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const verticesTexCoords = new Float32Array([
      -1.0,
      1.0,
      0.0,
      1.0,
      -1.0,
      -1.0,
      0.0,
      0.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      0.0
    ]);
    const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    // passing data to attribute buffer: a_Position, a_texCoord
    const a_Position = gl.getAttribLocation(glProgram, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

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

    const image = new Image();
    image.src = this.$data.textures[0].src;
    image.onload = () => {
      // passing texture data to sampler2D
      const texture = gl.createTexture();
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
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
        image
      );
      const u_Image = gl.getUniformLocation(glProgram, "u_Image");
      gl.uniform1i(u_Image, 0);
      gl.useProgram(glProgram);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
  }
});
</script>
