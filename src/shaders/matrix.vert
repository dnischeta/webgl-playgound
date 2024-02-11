uniform vec2 u_resolution;
uniform mat3 u_transform;

attribute vec2 a_position;

void main() {
    gl_Position = vec4((u_mat3_vp * vec3(a_position, 1)).xy, 0, 1);
}