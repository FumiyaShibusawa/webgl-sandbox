precision mediump float;
varying vec4 v_FragColor;
void main() {
  gl_FragColor = abs(v_FragColor);
}
