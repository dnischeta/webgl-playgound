<script setup lang="ts">
import { watch, ref } from 'vue'
import { useRenderer } from '../composables/use-renderer';
import { useRenderCases } from '../composables/use-render-cases'
import { useDomControls } from '../composables/use-dom-controls'
import { RenderCase } from '../cases'

const mountedCase = ref<RenderCase>();

const { cases, selectedCase } = useRenderCases()
const { canvas, gl } = useRenderer()
const { on, off } = useDomControls(canvas)


watch(selectedCase, (caseIdx) => {
    if (mountedCase.value) {
        mountedCase.value.unmount()
        off()
    }

    if (caseIdx !== undefined && cases[caseIdx]) {
        mountedCase.value = new cases[caseIdx](gl.value!)

        on('zoom', mountedCase.value.onZoom)
        on('rotation', mountedCase.value.onRotation)
        on('translate', mountedCase.value.onDrag)
        on('translate-end', mountedCase.value.onDragEnd)
    }
})
</script>

<template>
    <canvas ref="canvas" :class="$s.canvas" />
</template>

<style module="$s">
.canvas {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
}
</style>