<template>
    <div v-if="checkboxOptions">
        <div v-for="checkboxOption in checkboxOptions" :key="checkboxOption.key">
            <label class="checkbox">
                <input type="checkbox" :value="checkboxOption" v-model="vModelValue">
                {{ checkboxOption.label }}
            </label>
        </div>
    </div>

    <div v-else>
        <label class="checkbox">
            <input type="checkbox" v-model="vModelValue">
            <slot></slot>
        </label>
    </div>
</template>


<script setup>
const props = defineProps({
    checkboxOptions: Object,
    vModelValue: [Boolean, Array],

})

const vModelValue = defineModel('vModelValue')
</script>