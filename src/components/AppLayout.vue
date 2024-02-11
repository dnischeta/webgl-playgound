<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
</script>

<template>
    <div :class="$s.layout">
        <AppSidebar />
        <slot />
    </div>
</template>

<style module="$s">
.layout {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 300px auto;
    padding: 8px;
    gap: 8px;
}
</style>