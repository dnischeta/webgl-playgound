import { Ref, onMounted, onUnmounted, ref } from "vue";

export function useDomControls(el: Ref<HTMLElement>) {
  const dragging = ref(false);
  const dragStartPoint = ref<[number, number]>([0, 0]);

  const zoomListeners = ref<Array<(zoomDelta: number) => void>>([]);
  const rotationListeners = ref<Array<(rotationDelta: number) => void>>([]);
  const translateListeners = ref<
    Array<
      (startPoint: [number, number], currentPoint: [number, number]) => void
    >
  >([]);
  const translateEndListeners = ref<Array<() => void>>([]);

  onMounted(createListeners);

  onUnmounted(destroyListeners);

  function createListeners() {
    el.value.addEventListener("wheel", onWheel);
    el.value.addEventListener("mousedown", onMouseDown);
    el.value.addEventListener("mouseup", onMouseUp);
    el.value.addEventListener("mousemove", onMouseMove);
  }

  function destroyListeners() {
    el.value.removeEventListener("wheel", onWheel);
    el.value.removeEventListener("mousedown", onMouseDown);
    el.value.removeEventListener("mouseup", onMouseUp);
    el.value.removeEventListener("mousemove", onMouseMove);
  }

  function onWheel(event: WheelEvent) {
    event.preventDefault();

    const direction = Math.sign(event.deltaY);
    const zoomDelta = direction * 0.25; // TODO: use config

    zoomListeners.value.forEach((listener) => {
      listener(zoomDelta);
    });
  }

  function onMouseDown(event: MouseEvent) {
    dragging.value = true;
    dragStartPoint.value = getClipSpaceMousePosition(event);
  }

  function onMouseUp(event: MouseEvent) {
    if (!dragging.value) {
      return;
    }

    dragging.value = false;
    dragStartPoint.value = [0, 0];
    translateEndListeners.value.forEach((listener) => {
      listener();
    });
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging.value) {
      return;
    }

    const dragCurrentPoint = getClipSpaceMousePosition(event);

    translateListeners.value.forEach((listener) => {
      listener(dragStartPoint.value, dragCurrentPoint);
    });
  }

  function getClipSpaceMousePosition(event: MouseEvent): [number, number] {
    const { left, top } = el.value.getBoundingClientRect();
    const cssPosition = [event.clientX - left, event.clientY - top];
    const normalizedPosition = [
      cssPosition[0] / el.value.clientWidth,
      cssPosition[1] / el.value.clientHeight,
    ];

    return [normalizedPosition[0] * 2 - 1, normalizedPosition[1] * -2 + 1];
  }

  function on(event: "zoom", listener: (zoomDelta: number) => void);
  function on(event: "rotation", listener: (rotationDelta: number) => void);
  function on(
    event: "translate",
    listener: (start: [number, number], current: [number, number]) => void
  );
  function on(event: "translate-end", listener: () => void);
  function on(
    event: "zoom" | "rotation" | "translate" | "translate-end",
    listener
  ) {
    switch (event) {
      case "zoom":
        zoomListeners.value.push(listener);
        break;
      case "rotation":
        rotationListeners.value.push(listener);
        break;
      case "translate":
        translateListeners.value.push(listener);
        break;
      case "translate-end":
        translateEndListeners.value.push(listener);
        break;
    }
  }

  function off() {
    zoomListeners.value = [];
    translateListeners.value = [];
    rotationListeners.value = [];
    translateEndListeners.value = [];
  }

  return { on, off };
}
