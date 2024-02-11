<script setup lang="ts">
import { computed } from 'vue';
import PrimeDropdown from 'primevue/dropdown';
import { useRenderCases } from '../composables/use-render-cases'

const { selectedCase, cases } = useRenderCases()

const options = computed(() => cases.map((renderCase, idx) => ({
    id: idx,
    name: renderCase.name,
})))
</script>

<template>
    <PrimeDropdown v-model="selectedCase" :options="options" option-label="name" option-value="id" placeholder="Select case" />
</template>