<script setup>
import { ref } from 'vue';
import BaseInput from './base/BaseInput.vue';

const searchQuery = ref('')
const emit = defineEmits(['search'])

const emitSearchQuery = () => {
    emit('search', searchQuery.value)
} //emit takes in the event name(parent will listen for this) and payload object(optional) or data we want to pass with the event
</script>

<template>
    <div class="field is-grouped container">
        <p class="control is-expanded">
            <BaseInput inputClass="input" inputType="text" inputPlaceholder="Search for commands" v-model="searchQuery" @input="emitSearchQuery"></BaseInput>
            
        </p>
        <p class="control">
            <button class="button is-primary" type="submit" @click="emitSearchQuery">
                Search
            </button>
        </p>
    </div>
</template>