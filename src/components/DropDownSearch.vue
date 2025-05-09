<template>
    <div class="field has-addons mb-4">
        <p class="control">

                <BaseSelect :selectOptions="dropdownCategories" @change="addSelectedCategories" :multiple="isMultiSelect" :size="isMultiSelect ? 3 : 1">
                    <template #options="{ selectOptions }">
                        <option v-for="(category) in selectOptions" :key="category.key" :value="category.key">
                            {{ category.label }}

                        </option>
                    </template>
                </BaseSelect>
            
        </p>


        <div class="control" v-if="selectedCategories.length > 0">
            <template v-if="selectedCategories[0].type === 'select'">
                
                    <BaseSelect @change="updateCategoryValues" v-model:inputValue="inputValue"
                        :selectOptions="dropdownOpts[selectedCategories[0].optionsKey]">
                        <template #options="{selectOptions}">
                            <option v-for="[key, option] in Object.entries(selectOptions)" :key="key" :value="key">
                                {{ option.label }}
                            </option>
                        </template>
                    </BaseSelect>

                

            </template>

            <template v-else-if="selectedCategories[0].type === 'boolean'">
                
                    <BaseSelect @change="updateCategoryValues" v-model:inputValue="inputValue"
                        :selectOptions="booleanOpts">
                        <template #options="{ selectOptions }">
                            <option v-for="[key, option] in Object.entries(selectOptions)" :key="key" :value="key">
                                {{ option.label }}
                            </option>
                        </template>
                    </BaseSelect>

                

            </template>



            <BaseInput v-else :inputType="selectedCategories[0].type"
                :inputPlaceholder="`Enter ${selectedCategories.map(cat => cat.label).join(',')}`" v-model:inputValue="inputValue"
                inputClass="input" @input="updateCategoryValues">
            </BaseInput>
        </div>

        <p class="control">
            <span class="select">
                <select v-model="isMultiSelect" @change="handleModeChange">
                    <option :value="false">Uni select</option>
                    <option :value="true">Multi select</option>
                </select>
            </span>


        </p>
    </div>
</template>

<script>
import BaseInput from './base/BaseInput.vue'
import config from '@/config/config'
import BaseSelect from './base/BaseSelect.vue'


export default {
    components: {
        BaseInput,
        BaseSelect
    },
    data() {
        return {
            isMultiSelect: false,
            selectedCategories: [],
            inputValue: '',
            currentType: null,
            dropdownOpts: config.table.options,
            booleanOpts: config.table.booleanOptions,
            selectedOptions2: null
        }
    },
    props: {
        dropdownCategories: {
            type: Array
        }
    },
    emits: ['categorySearch'],
    methods: {
        addSelectedCategories(event) {
            // Create an array of selected option values
            const selectedOptions = Array.from(event.target.selectedOptions).map(option => option.value)

            if (this.isMultiSelect) {
                // For multiselect, we can only select columns of the same type
                const mappedOptions = selectedOptions.map(option => {
                    const category = this.dropdownCategories.find(cat => cat.key === option)
                    return { 
                        key: category.key, 
                        label: category.label, 
                        value: '', 
                        type: category.type,
                        optionsKey: category.optionsKey || null
                    }
                })

                // If this is the first selection, establish the type constraint
                if (this.selectedCategories.length === 0 && mappedOptions.length > 0) {
                    this.currentType = mappedOptions[0].type
                    this.selectedCategories = mappedOptions
                   
                } else {
                    // Filter out options that don't match the current type
                    const validOptions = mappedOptions.filter(option => option.type === this.currentType)
                    this.selectedCategories = validOptions

                    // If no valid options were selected, warn the user
                    if (validOptions.length !== mappedOptions.length) {
                        this.handleModeChange()
                        console.warn('Some selected columns were ignored because they have different types.')
                    }
                }
            } else {
                // For uniselect, we just take the last selected option
                if (selectedOptions.length > 0) {
                    const lastOption = selectedOptions[selectedOptions.length - 1]
                    const category = this.dropdownCategories.find(cat => cat.key === lastOption)
                    this.selectedCategories = [{
                        key: category.key,
                        label: category.label,
                        value: '',
                        type: category.type,
                        optionsKey: category.optionsKey || null
                    }]
                    this.currentType = category.type
                } else {
                    this.selectedCategories = []
                    this.currentType = null
                }
            }

            // Reset input when changing selection
            this.inputValue = ''
            this.emitSearch()
            
        },

        handleModeChange() {
            // Clear selections when switching modes
            this.selectedCategories = []
            this.inputValue = ''
            this.currentType = null
            
        },

        updateCategoryValues() {
            // Update all selected categories with the same input value
            this.selectedCategories.forEach(category => category.value = this.inputValue)
            this.emitSearch()
        },

        emitSearch() {
            if(!this.inputValue) return

            // const searchCriteria = this.selectedCategories.reduce((criteria, category) => {
            //     criteria[category.key] = category.value
            //     return criteria
            // }, {})

            const searchCriteria = {
                categories: this.selectedCategories.map(category => category.key),
                value: this.inputValue
            }
            this.$emit('categorySearch', searchCriteria)
            
        }, 

    }
}
</script>