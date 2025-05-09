<template>
    <div class="select">
        <select @blur="$emit('blur')" :multiple="multiple" v-model="inputValue">
            <option value="" disabled>Select Option</option>
            <slot name="options" :selectOptions="selectOptions"></slot>
        </select>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    selectOptions: Object,
    multiple: Boolean, 
});

const emit = defineEmits(["blur"]);
const inputValue = defineModel("inputValue", {
    type: [String, Number, Date, Array, Boolean],
});
</script>
