attribute vec4 a_Position;
varying vec4 v_FragColor;
void main() {
  gl_Position = a_Position;
  gl_PointSize = 10.0;
  v_FragColor = a_Position;
}
