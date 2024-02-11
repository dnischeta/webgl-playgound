import { ComputedRef, reactive, watch, computed } from "vue";
import * as mat3 from "../lib/m3";

type GlobalState = {
  camera: {
    x: number;
    y: number;
    rotation: number;
    zoom: number;
  };
};

export abstract class RenderCase<
  State extends Record<string, unknown> = Record<string, unknown>
> {
  abstract name: string;
  public state: State & GlobalState;

  protected gl: WebGLRenderingContext;
  protected program: WebGLProgram;
  private alwaysRerender: boolean;
  private unmounted: boolean = false;
  private unmountEffects: Array<() => void> = [];
  private viewProjectionMatrix: ComputedRef<mat3.Mat3>;

  private dragStartViewProjectionMatrix: mat3.Mat3 | undefined;
  private dragStartCamera: GlobalState["camera"] | undefined;
  private dragStartPoint: [number, number] | undefined;

  constructor(gl: WebGLRenderingContext, alwaysRerender = false, state: State) {
    this.alwaysRerender = alwaysRerender;
    this.gl = gl;
    this.state = reactive<State & GlobalState>({
      ...state,
      camera: { x: 0, y: 0, zoom: 0.5, rotation: 0 },
    });
    this.dragStartViewProjectionMatrix = undefined;
    this.dragStartCamera = undefined;
    this.viewProjectionMatrix = computed(() => {
      let cameraMat = mat3.identity();
      cameraMat = mat3.translate(
        cameraMat,
        this.state.camera.x,
        this.state.camera.y
      );
      cameraMat = mat3.rotate(cameraMat, this.state.camera.rotation);
      cameraMat = mat3.scale(
        cameraMat,
        this.state.camera.zoom,
        this.state.camera.zoom
      );

      const projectionMatrix = mat3.projection(
        this.gl.canvas.width,
        this.gl.canvas.height
      );
      const viewMatrix = mat3.invert(cameraMat);
      return mat3.multiply(projectionMatrix, viewMatrix!);
    });
    this.compile();
    this.init();
  }

  public get vpMatrix() {
    return this.viewProjectionMatrix.value;
  }

  public unmount() {
    this.unmounted = true;
    this.unmountEffects.forEach((effect) => {
      effect();
    });
  }

  public onZoom = (zoomDelta: number) => {
    this.state.camera.zoom += zoomDelta;
  };

  public onDrag = (
    startPoint: [number, number],
    currentPoint: [number, number]
  ) => {
    if (!this.dragStartViewProjectionMatrix) {
      this.dragStartViewProjectionMatrix = mat3.invert(this.vpMatrix);
      this.dragStartCamera = { ...this.state.camera };
      this.dragStartPoint = mat3.transformPoint(
        startPoint,
        this.dragStartViewProjectionMatrix
      );
    }

    const currentPosition = mat3.transformPoint(
      currentPoint,
      this.dragStartViewProjectionMatrix
    );

    this.state.camera.x =
      this.dragStartCamera.x + this.dragStartPoint[0] - currentPosition[0];
    this.state.camera.y =
      this.dragStartCamera.y + this.dragStartPoint[1] - currentPosition[1];
  };

  public onDragEnd = () => {
    this.dragStartViewProjectionMatrix = undefined;
    this.dragStartCamera = undefined;
  }

  public onRotation() {}

  private init() {
    if (this.alwaysRerender) {
      this.rafRender();
    } else {
      const unwatch = watch(
        this.state,
        (state) => {
          this.render(state);
        },
        { immediate: true, deep: true }
      );
      this.unmountEffects.push(unwatch);
    }
  }

  private rafRender() {
    if (this.unmounted) {
      return;
    }

    this.render(this.state);
    window.requestAnimationFrame(() => {
      this.rafRender();
    });
  }

  abstract render(state: State);

  abstract compile();
}
