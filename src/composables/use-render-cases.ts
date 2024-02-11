import { ref, computed } from "vue";
import { RandomRects, TwoDemTransform, RenderCase } from "../cases/index";

const cases = [RandomRects, TwoDemTransform];
const selectedCase = ref<number>();

export function useRenderCases() {
  return {
    cases,
    selectedCase: computed({
      get: () => selectedCase.value,
      set: (idx: number | undefined) => (selectedCase.value = idx),
    }),
  };
}
