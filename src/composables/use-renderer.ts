import { onMounted, ref } from "vue";
import { resizeCanvasToDisplaySize } from '../lib/webgl'

export function useRenderer() {
    const gl = ref<WebGLRenderingContext>()
    const canvas = ref<HTMLCanvasElement>()

    onMounted(() => {
        const ctx = canvas.value?.getContext('webgl')

        if (!ctx) {
            throw new Error('Failed to obtain webgl context')
        }

        resizeCanvasToDisplaySize(canvas.value, 1);
        gl.value = ctx;
        gl.value.viewport(0, 0, gl.value.canvas.width, gl.value.canvas.height)
    })

    return { canvas, gl }
}