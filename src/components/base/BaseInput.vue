<template>
    <input :type="inputType" :class="inputClass" :placeholder="inputPlaceholder" v-model="inputValue" :readonly="isReadOnly" :style="inputStyle"/>
</template>

<script setup>
const props = defineProps({
    inputType: String,
    inputClass: String,
    inputPlaceholder: String,
    isReadOnly: Boolean,
    inputStyle: Object
})

const inputValue = defineModel('inputValue', {
    type: [String, Number, Date]
})
//const emit = defineEmits(['update:modelValue'])

</script>