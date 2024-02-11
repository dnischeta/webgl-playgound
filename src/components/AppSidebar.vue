<script setup lang="ts">
import PrimePanel from 'primevue/panel'

import CaseSelect from './CaseSelect.vue'
</script>

<template>
    <PrimePanel>
        <template #header>
            <h1>WebGL playground</h1>
        </template>
        <CaseSelect />
    </PrimePanel>
</template>