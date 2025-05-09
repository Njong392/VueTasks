<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePagination } from '@/utils/pagination'
import { useFormValidation } from '@/utils/formValidation'
import BaseInput from './base/BaseInput.vue'
import BaseSelect from './base/BaseSelect.vue'
import config from '@/config/config'

const props = defineProps({
    returnCommands: Array,
    columns: Array
})

const reactiveCommands = computed(() => props.returnCommands)
const router = useRouter()
const { totalNumberOfPages } = usePagination(reactiveCommands)
const { newRow, isOrderNoDuplicate, isFieldEmpty, addNewRow, initNewRow } = useFormValidation(props.columns, reactiveCommands.value)
const dropdownOpts = ref(config.table.options)
const booleanOpts = ref(config.table.booleanOptions)



const addRowVal = () => {
    const isAdded= addNewRow()

    // navigate back to home 
    if(isAdded){
        router.push({
            name: 'home',
            query: { currentPage: totalNumberOfPages.value }
        })
    }

}

// initialize the newRow object
onMounted(() => {

    initNewRow('')
    
})
</script>

<template>
    <form class="container" @submit.prevent="addRowVal" v-if="newRow">
        <div class="field" v-for="column in columns" :key="column.key">
            <span v-if="column.key === 'orderNo'">
                <label class="label">{{ column.label }}</label>
                <p class="has-text-danger is-small" v-if="isOrderNoDuplicate">This order number already exists</p>
                <div class="control">

                    <BaseInput inputClass="input" :inputType="column.type" v-model="newRow[column.key]"
                        @input="isOrderNoDuplicate = false" :readOnly="true" :inputPlaceholder="column.label">
                    </BaseInput>

                </div>
            </span>

            <span v-else-if="column.type === 'select'">
                <label class="label">{{ column.label }}</label>
                <div class="control">

                    <BaseSelect :selectOptions="dropdownOpts[column.optionsKey]" v-model="newRow[column.key]">
                        <template #options="{selectOptions}">
                            <option v-for="[key, option] in Object.entries(selectOptions)" :key="key" :value="key">
                                {{ option.label }}
                            </option>
                        </template>
                    </BaseSelect>
                </div>

            </span>

            <span v-else-if="column.type === 'boolean'">
                <label class="label">{{ column.label }}</label>

                <BaseSelect :selectOptions="booleanOpts" v-model="newRow[column.key]">
                    <template #options="{selectOptions}">
                        <option v-for="[key, option] in Object.entries(selectOptions)" :key="key" :value="key"
                            :inputPlaceholder="newRow[column.label]">
                            {{ option.label }}
                        </option>
                    </template>
                </BaseSelect>


            </span>

            <span v-else>
                <label class="label">{{ column.label }}</label>
                <div class="control">

                    <BaseInput inputClass="input" :inputType="column.type" v-model="newRow[column.key]"
                        @input="isOrderNoDuplicate = false" :inputPlaceholder="column.label"></BaseInput>
                </div>
            </span>
        </div>

        <span v-if="isFieldEmpty" class="has-text-danger is-small">Enter all fields before submitting</span>
        <div class="control">
            <button class="button is-primary" type="submit">Submit</button>
        </div>
    </form>
</template>