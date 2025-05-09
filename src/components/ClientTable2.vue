<script setup>
// Imports
import { ref, computed, watch } from 'vue'
import Modal from './Modal.vue'
import { format } from 'date-fns'
import config from '@/config/config'
import { usePagination } from '@/utils/pagination'
import ExcelExport from './ExcelExport.vue'
import { useFormValidation } from '@/utils/formValidation'
import { useRouter } from 'vue-router'

// Props and variable definitions
const props = defineProps({
    commands: Array,
    columns: Array
})
let selectedRow = ref(-1)
const router = useRouter()
const hiddenColumns = ref([])
const selectedColumn = ref(null)
const isModalActive = ref(false)
const isColumnMissing = ref(false)
const unhideableCols = ref(config.table.unhideableColumns)
const { totalNumberOfPages, rowsPerPage, nextPage, prevPage, lastPage, firstPage, currentPage } = usePagination()
const { addNewRow, cancelRow, newRow, isOrderNoDuplicate, isFieldEmpty } = useFormValidation(props.columns, props.commands)

// Returns number of rows per page
const paginatedCommands = computed(() => {
    const startIndex = (currentPage.value - 1) * rowsPerPage.value
    const endIndex = startIndex + rowsPerPage.value
    return props.commands.slice(startIndex, endIndex)
})

// Row operations
const selectRow = (index) => {
    selectedRow.value = selectedRow.value === index ? -1 : index
}

const isSelected = (index) => {
    return selectedRow.value === index
}

const isHideRowBtnEnabled = () => {
    return selectedRow.value > -1
}

const deleteRow = (index) => {
    props.commands.splice(index, 1)
}

const initNewRow = () => {
    newRow.value = props.columns.reduce((acc, column) => {
        if (!column.visibility) {
            isColumnMissing.value = true
        }
        else {
            //isColumnMissing.value = false
            acc[column.key] = column.defaultValue
            return acc
        }
    }, {})
}

// Column operations
const selectColumn = (column) => {
    selectedColumn.value = column
    console.log(selectedColumn.value)

}

const isHideColumnBtnEnabled = () => {
    return !(selectedColumn.value === null || unhideableCols.value.includes(selectedColumn.value.key))

}

const hideColumn = () => {
    if (selectedColumn.value) {

        const column = props.columns.find(col => col === selectedColumn.value)
        if (column) {
            column.visibility = false
            hiddenColumns.value.push(selectedColumn.value)
            selectedColumn.value = null
        }
    }

}

const showColumns = (checkedValues) => {
    checkedValues.forEach(checkedValue => {

        // For each checked value, finds index of checked element in the hidden columns array. 
        const columnIndex = hiddenColumns.value.findIndex(col => col === checkedValue)

        if (columnIndex !== -1) {
            // If the index is not -1 (which means it exists), it then finds the checked  element in columns array and sets its visibility to true
            const column = props.columns.find(col => col === checkedValue)
            if (column) {
                column.visibility = true
                // Remove from hidden columns array using index
                hiddenColumns.value.splice(columnIndex, 1)
            }
        }
    })
}

// filtered commands with only visible columns and rows passed to export component
const filteredCommands = computed(() => {
    return props.commands.filter((index) => index !== selectedRow.value).map(command => {
        const filteredCommand = {}
        props.columns.forEach(column => {
            if (column.visibility) {
                filteredCommand[column.key] = command[column.key]
            }
        })
        return filteredCommand
    })
})

// Modal controllers
const showModal = () => {
    isModalActive.value = true
}

const closeModal = () => {
    isModalActive.value = false
}

watch(() => props.commands, () => {
    currentPage.value = 1; // Reset to first page when search updates commands

    router.push({
        name: 'home',
        query: { currentPage: 1 }
    })
});


</script>

<template>
    <div class="container field is-grouped">
        <button class="button is-primary m-4" @click="hideColumn" :disabled="!isHideColumnBtnEnabled()">Hide
            Column</button>
        <button class="button is-primary m-4" @click="showModal">Show Hidden Columns</button>
        <button :disabled="!isHideRowBtnEnabled()" class="button is-primary m-4" @click="deleteRow">Hide Row</button>
        
        <Modal :hiddenArray="hiddenColumns" :modalState="isModalActive" @close-modal="closeModal"
            @show-columns="showColumns" />

        <input type="number" class="input m-4" placeholder="Number of entries per page" v-model="rowsPerPage" />

    </div>

    <ExcelExport :commands="filteredCommands" :columns="columns" />

    <div class="table-container">

        <table class="table container is-bordered mt-2">
            <thead>
                <tr>
                    <template v-for="column in columns" :key="column.key">
                        <th v-if="column.visibility" @click="selectColumn(column)"
                            :class="{ 'is-selected': selectedColumn === column }">
                            {{ column.label }}
                        </th>
                    </template>

                </tr>
            </thead>

            <tbody>
                <tr v-for="(command, index) in paginatedCommands" :key="command.orderNo" @click="selectRow(index)"
                    :class="{ 'is-selected': isSelected(index) }">
                    <template v-for="column in columns" :key="column.key">
                        <td v-if="column.visibility" :class="{ 'is-selected': selectedColumn === column }">

                            <!-- Render the column based on the type. Status and date have different rendering -->
                            <span v-if="column.type === 'select'"
                                :class="[column.options[command[column.key]]?.class || '']">
                                {{ column.options[command[column.key]]?.label || 'Unknown' }}
                            </span>

                            <span v-else-if="column.key === 'orderDate'">
                                {{ format(new Date(command[column.key]), 'yyyy-MM-dd') }}
                            </span>



                            <span v-else>
                                {{ command[column.key] }}
                            </span>
                        </td>

                    </template>
                </tr>


                <tr v-if="currentPage == totalNumberOfPages && newRow">
                    <td v-for="column in columns" :key="column.key">
                        <span v-if="column.type === 'select'">
                            <div class="select">
                                <select v-model="newRow[column.key]">
                                    <option disabled selected>Select an option</option>
                                    <option v-for="[key, option] in Object.entries(column.options)" :key="key"
                                        :value="key">
                                        {{ option.label }}
                                    </option>
                                </select>

                            </div>
                        </span>

                        <span v-else>
                            <input :type="column.type" v-model="newRow[column.key]" class="input"
                                @input="isOrderNoDuplicate = false" />
                        </span>
                    </td>

                    <div class="field is-grouped m-1">
                        <button class="button is-success is-small" @click="addNewRow()">Add</button>
                        <button class="button is-small" @click="cancelRow()">Cancel</button>
                    </div>
                </tr>


            </tbody>
        </table>
    </div>


    <div>
        <p class="has-text-danger is-small" v-if="isOrderNoDuplicate">Numero commandes already exists</p>
        <p class="has-text-danger is-small" v-if="isFieldEmpty">Cannot submit with empty field</p>
        <p class="has-text-danger is-small" v-if="isColumnMissing">Cannot add row when column is missing</p>
        <button class="button is-primary is-fullwidth" v-if="currentPage == totalNumberOfPages" @click="initNewRow">Add
            Row</button>
    </div>

    <div class="field is-grouped">
        <button class="button is-primary m-2 is-small" @click="firstPage" :disabled="currentPage == 1">First</button>
        <button class="button is-primary m-2 is-small" @click="prevPage" :disabled="currentPage == 1">Prev</button>
        <button class="button is-primary m-2 is-small" @click="nextPage"
            :disabled="currentPage == totalNumberOfPages">Next</button>
        <button class="button is-primary m-2 is-small" @click="lastPage" :disabled="currentPage == totalNumberOfPages">
            Last</button>
    </div>


</template>