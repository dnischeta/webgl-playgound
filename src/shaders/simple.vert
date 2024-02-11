uniform vec2 u_transformation;
uniform float u_rotation;
uniform float u_scale;

attribute vec2 a_position;

void main() {
    vec2 scaledPosition = a_position * u_scale;

    float rotateSin = sin(u_rotation);
    float rotateCos = cos(u_rotation);

    vec2 rotated = vec2(
        scaledPosition.x * rotateCos + scaledPosition.y * rotateSin,
        scaledPosition.y * rotateCos - scaledPosition.x * rotateSin
    );
    vec2 transformed = rotated + u_transformation;

    gl_Position = vec4((u_mat3_vp * vec3(transformed, 1)).xy, 0, 1);
}