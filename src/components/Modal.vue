<template>
    <div :class="{ 'is-active': modalState }" class="modal">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="container">
                <div class="box">
                    <h1 class="title">Hidden Columns</h1>
                    <BaseCheckbox :checkboxOptions="hiddenArray" v-model:vModelValue="checkedElements"></BaseCheckbox>

                    <div class="mt-4">
                        <button class="button is-primary mr-2" @click="showColumns">Show columns</button>
                        <button class="button" @click="$emit('closeModal')">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="$emit('closeModal')"></button>
    </div>
</template>

<script>
import BaseCheckbox from './base/BaseCheckbox.vue'

export default {
    components: {
        BaseCheckbox
    },
    data() {
        return {
            checkedElements: []
        }
    },

    props: {
        hiddenArray: Array,
        modalState: Boolean
    },

    emits: ['closeModal', 'showColumns'],

    methods: {
        closeModal() {
            this.$emit('closeModal')
        },
        showColumns() {
            this.$emit('showColumns', this.checkedElements)
            this.closeModal()
        }
    }
}
</script>