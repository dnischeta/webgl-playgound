import { RenderCase } from "./RenderCase";
import { simpleFrag, matrixVert, vpMatrixVert } from "../shaders";
import { createProgram, createShader } from "../lib/webgl";
import * as mat3 from '../lib/m3'

type State = {
  transformation: { x: number; y: number };
  rotation: number;
  scale: number;
};

export class TwoDemTransform extends RenderCase<State> {
  name = "2D transforms";

  constructor(gl: WebGLRenderingContext) {
    super(
      gl,
      false,
      {
        transformation: { x: 0, y: 0 },
        rotation: 0,
        scale: 1,
      }
    );
  }

  public compile() {
    const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vpMatrixVert.concat(matrixVert));
    const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, simpleFrag);

    this.program = createProgram(this.gl, vertexShader, fragmentShader);
  }

  private setGeometry() {
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
          // left column
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,

          // top rung
          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,

          // middle rung
          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90,
      ]),
      this.gl.STATIC_DRAW);
  }

  render(state: State) {
    const vpUniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_mat3_vp'
    );
    const transformationUniformLocation = this.gl.getUniformLocation(
      this.program,
      "u_transform"
    );
    const colorUniformLocation = this.gl.getUniformLocation(
      this.program,
      "u_color"
    );
    const positionAttributeLocation = this.gl.getAttribLocation(
      this.program,
      "a_position"
    );
    const positionBuffer = this.gl.createBuffer();

    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    var size = 2; // 2 компоненты на итерацию
    var type = this.gl.FLOAT; // наши данные - 32-битные числа с плавающей точкой
    var normalize = false; // не нормализовать данные
    var stride = 0; // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
    var offset = 0; // начинать с начала буфера
    this.gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    this.gl.uniformMatrix3fv(vpUniformLocation, false, super.vpMatrix);

    this.setGeometry();
    this.gl.uniform4f(colorUniformLocation, 127, 0, 127, 1);

    // Соберем матрицу трансформации
    const translateMatrix = mat3.translation(state.transformation.x, state.transformation.y)
    const rotationMatrix = mat3.rotation(state.rotation * Math.PI / 180)
    const scaleMatrix = mat3.scaling(state.scale, state.scale)
    var matrix = mat3.projection(this.gl.canvas.width, this.gl.canvas.height)

    for (var i = 0; i < 5; ++i) {
      // Multiply the matrices.
      matrix = mat3.multiply(matrix, translateMatrix);
      matrix = mat3.multiply(matrix, rotationMatrix);
      matrix = mat3.multiply(matrix, scaleMatrix);

      // Set the matrix.
      this.gl.uniformMatrix3fv(transformationUniformLocation, false, matrix);

      // Draw the geometry.
      var primitiveType = this.gl.TRIANGLES;
      var offset = 0;
      var count = 18;  // 6 triangles in the 'F', 3 points per triangle
      this.gl.drawArrays(primitiveType, offset, count);
    }
  }
}
