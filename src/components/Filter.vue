<template>
    <div class="container">
        <div class="card mt-5">
            <div class="card-content">
                <div class="content">
                    <p class="is-small">Search by filter:</p>
                        <BaseSelect :selectOptions="buttons" @change="addInput($event.target.value)">
                            <template #options="{selectOptions}">
                                <option class="is-small m-1" v-for="(button, index) in selectOptions" :key="index"
                                    :value="index">
                                    {{ button.label }}
                                </option>
                            </template>
                        </BaseSelect>

                    <div v-for="(input, index) in selectedInputs" :key="index" class="field">
                        <div class="is-flex mt-4">
                            <button class="delete is-small" @click="clearInput(index)"></button>
                            <label class="label is-small ml-1">{{ input.label }}</label>

                        </div>

                        <!--If input is a dropdown-->
                        <span v-if="['select', 'boolean'].includes(input.type)">

                            <BaseSelect :selectOptions="input.type === 'select' ? dropdownOpts[input.optionsKey] : booleanOpts" @blur="emitSearch"
                                v-model:inputValue="input.value">
                                <template #options="{selectOptions}">
                                    <option v-for="[key, option] in Object.entries(selectOptions)" :key="key"
                                        :value="key">
                                        {{ option.label }}
                                    </option>
                                </template>
                            </BaseSelect>

                        </span>

                        <!--if input is date, number, etc-->
                        <span v-else>

                            <BaseInput :inputType="input.type" :inputPlaceholder="input.label" v-model:inputValue="input.value"
                                inputClass="input is-small" @blur="emitSearch" :inputStyle="input.style">
                            </BaseInput>
                        </span>

                    </div>

                    <!--<button class="button is-black is-small mt-1" @click="emitSearch">Search</button>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BaseInput from './base/BaseInput.vue'
import BaseSelect from './base/BaseSelect.vue'
import config from '@/config/config'

export default {
    components: {
        BaseInput,
        BaseSelect
    },
    data() {
        return {
            selectedInputs: [],
            dropdownOpts: config.table.options,
            booleanOpts: config.table.booleanOptions,
        }
    },
    props: {
        buttons: Array,
    },
    emits: ['filterSearch'],
    methods: {
        addInput(index) {
            const button = this.buttons[index]
            if (!this.selectedInputs.some(input => input.key === button.key)) {
                this.selectedInputs.push({ ...button, value: '' })
                //console.log(this.selectedInputs)
            }

            const dropdown = document.querySelector('select')
            if (dropdown) {
                dropdown.value = ''
            }


        },
        clearInput(index) {
            this.selectedInputs.splice(index, 1)
            this.emitSearch()

            const dropdown = document.querySelector('select')
            if (dropdown) {
                dropdown.value = ''
            }
        },
        // checks if key exists in dropdownOptions and renders as dropdown input
        isDropdown(key){
            return this.dropdownOptionsObj && this.dropdownOptionsObj[key]
        },
        emitSearch() {
            // criteria is object and input is selectedInputs element which is also object, assigns key to value
            const searchCriteria = this.selectedInputs.reduce((criteria, input) => {
                criteria[input.key] = input.value
                return criteria
            }, {})
            
            this.$emit('filterSearch', searchCriteria)
            
            

        }
    }
}

</script>