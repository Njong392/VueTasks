<template>
    <div class="controls">
        <button class="button is-primary m-4" @click="hideColumn" :disabled="!isHideColumnBtnEnabled()">Hide
            Column</button>
        <button class="button is-primary m-4" @click="showModal">Show Hidden Columns</button>
        <button :disabled="!isHideRowBtnEnabled()" class="button is-primary m-4" @click="deleteRow">Hide
            Row</button>

        <Modal :hiddenArray="hiddenColumns" :modalState="isModalActive" @close-modal="closeModal"
            @show-columns="showColumns" />

        <input type="number" class="input m-4" placeholder="Number of entries per page" v-model="rowsPerPage"/>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import config from '@/config/config';
import { usePagination } from '@/utils/pagination';
import Modal from './Modal.vue';

const props = defineProps({
    columns: Array,
    commands: Array,
    selectedColumn: Object,
    selectedRow: Number,
})

const emit = defineEmits(['update-selected-column'])

const hiddenColumns = ref([])
const arr = ref([])
const isModalActive = ref(false)
const unhideableCols = ref(config.table.unhideableColumns)
const { rowsPerPage } = usePagination(arr)

// Row Operations
const isHideRowBtnEnabled = () => { 
    
    return (props.selectedRow > -1 && props.commands[props.selectedRow].orderStatus == 0)
}

const deleteRow = () => {
    arr.value.splice(props.selectedRow, 1)
    
}

// Column operations
const isHideColumnBtnEnabled = () => {
    return props.selectedColumn !== null && !unhideableCols.value.includes(props.selectedColumn.key)
}

const hideColumn = () => {
    if (props.selectedColumn) {

        const column = props.columns.find(col => col === props.selectedColumn)
        if (column) {
            column.visibility = false
            hiddenColumns.value.push(props.selectedColumn)
            
            
            // emit event to make selected column null
            emit('update-selected-column', null)
        }
    }
}

const showColumns = (checkedValues) => {
    checkedValues.forEach(checkedValue => {
        // For each checked value, fimd index of checked element in the hidden columns
        const columnIndex = hiddenColumns.value.findIndex(col => col === checkedValue)

        if(columnIndex !== -1){
            // if index is not -1 (which means element exists), it then finds the checked element in colums array and sets its visibility to true
            const column = props.columns.find(col => col === checkedValue)
            if(column){
                column.visibility = true

                // remove from hidden columns array using index
                hiddenColumns.value.splice(columnIndex, 1)
            }
        }
    })
}

// Modal controllers
const showModal = () => {
    isModalActive.value = true
}

const closeModal = () => {
    isModalActive.value = false
}

onMounted(() => {
    arr.value = props.commands
})

</script>