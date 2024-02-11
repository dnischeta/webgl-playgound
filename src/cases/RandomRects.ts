import { RenderCase } from "./RenderCase";
import { simpleFrag, simpleVert, vpMatrixVert } from "../shaders";
import { createProgram, createShader } from "../lib/webgl";
import { randomInt } from "../lib/math";

export class RandomRects extends RenderCase {
  name = "Random rects";

  colorUniformLocation: WebGLUniformLocation;
  resolutionUniformLocation: WebGLUniformLocation;
  scaleUniformLocation: WebGLUniformLocation;
  vpUniformLocation: WebGLUniformLocation;
  positionAttributeLocation: number;
  positionBuffer: WebGLBuffer;

  constructor(gl: WebGLRenderingContext) {
    super(gl, false, {});
  }

  public compile() {
    const vertexShader = createShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      vpMatrixVert.concat(simpleVert)
    );
    const fragmentShader = createShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      simpleFrag
    );
    this.program = createProgram(this.gl, vertexShader, fragmentShader);
    this.vpUniformLocation = this.gl.getUniformLocation(
      this.program,
      "u_mat3_vp"
    );
    this.colorUniformLocation = this.gl.getUniformLocation(
      this.program,
      "u_color"
    )!;
    this.resolutionUniformLocation = this.gl.getUniformLocation(
      this.program,
      "u_resolution"
    )!;
    this.positionAttributeLocation = this.gl.getAttribLocation(
      this.program,
      "a_position"
    )!;
    this.scaleUniformLocation = this.gl.getUniformLocation(
      this.program,
      "u_scale"
    )!;
    this.positionBuffer = this.gl.createBuffer()!;
  }

  private setRectangle(x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

    // ПРИМ.: gl.bufferData(gl.ARRAY_BUFFER, ...) воздействует
    // на буфер, который привязан к точке привязке `ARRAY_BUFFER`,
    // но таким образом у нас будет один буфер. Если бы нам понадобилось
    // несколько буферов, нам бы потребовалось привязать их сначала к `ARRAY_BUFFER`.

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
      this.gl.STATIC_DRAW
    );
  }

  render(state: Record<string, unknown>) {
    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    var size = 2; // 2 компоненты на итерацию
    var type = this.gl.FLOAT; // наши данные - 32-битные числа с плавающей точкой
    var normalize = false; // не нормализовать данные
    var stride = 0; // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
    var offset = 0; // начинать с начала буфера
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    this.gl.uniform2f(
      this.resolutionUniformLocation,
      this.gl.canvas.width,
      this.gl.canvas.height
    );

    this.gl.uniformMatrix3fv(this.vpUniformLocation, false, super.vpMatrix);

    for (let idx = 0; idx < 25; idx++) {
      this.setRectangle(
        randomInt(300),
        randomInt(300),
        randomInt(300),
        randomInt(300)
      );

      // задаём случайный цвет
      this.gl.uniform4f(
        this.colorUniformLocation,
        Math.random(),
        Math.random(),
        Math.random(),
        0.5
      );

      this.gl.uniform1f(this.scaleUniformLocation, 1);

      // отрисовка прямоугольника
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
  }
}
