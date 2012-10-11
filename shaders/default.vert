attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying lowp vec4 vColor;
varying lowp vec4 vPosition;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vPosition = vec4(aVertexPosition, 1.0);
    vColor = vec4(aVertexColor,1.0);
    
}