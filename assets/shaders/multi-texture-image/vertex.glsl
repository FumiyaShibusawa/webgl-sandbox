attribute vec4 a_Position;
attribute vec2 a_texCoord;
varying vec2 v_TexCoord;
void main() {
  gl_Position = a_Position;
  v_TexCoord = a_texCoord;
}
