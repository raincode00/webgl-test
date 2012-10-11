precision mediump float;
varying lowp vec4 vColor;
varying lowp vec4 vPosition;

void main(void) {
    vec4 color = vColor;
    if (color.r > 0.51) {
        color.r = 1.0;
    } else if (color.r < 0.49) {
        color.r = 0.0;
    } else {
        color.r = 50.0*(color.r - 0.49);
    }
    if (color.g > 0.51) {
        color.g = 1.0;
    } else if (color.g < 0.49) {
        color.g = 0.0;
    } else {
        color.g = 50.0*(color.g - 0.49);
    }
    if (color.b > 0.51) {
        color.b = 1.0;
    } else if (color.b < 0.49) {
        color.b = 0.0;
    } else {
        color.b = 50.0*(color.b - 0.49);
    }
    //color.r = sin(vColor.r*31.4)*0.5 + 0.5;
    //color.g = sin(vColor.g*31.4)*0.5 + 0.5;
    //color.b = sin(vColor.b*31.4)*0.5 + 0.5;
    gl_FragColor = color;
}