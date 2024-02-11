<script setup lang="ts">
import AppLayout from '../components/AppLayout.vue';
import CaseView from '../components/CaseView.vue'
</script>

<template>
    <AppLayout>
        <CaseView :class="$s.canvas"/>
    </AppLayout>
</template>

<style module="$s">
.canvas {
    justify-self: stretch;
}
</style>
