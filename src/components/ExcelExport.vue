<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { format } from 'date-fns'
import config from '@/config/config'
import { ref } from 'vue'

const props = defineProps({
    commands: Array,
    columns: Array
})
const fileName = "exported_data.xlsx"
const dropdownOpts = ref(config.table.options)

// format status and printed status to take their labels
const formatCommands = () => {
    return props.commands.map(command => {
        // props are read only, store in new varibale
        const formattedCommands = {}

        props.columns.forEach(column => {
           if(column.visibility){
               if (column.type === 'date') {
                   formattedCommands[column.label] = format(new Date(command[column.key]), 'dd/MM/yyyy')
               }
               else if (column.type === 'select') {
                   formattedCommands[column.label] = dropdownOpts[column.optionsKey]?.[command[column.optionsKey]]?.label
               } else if(column.type === 'boolean'){
                   formattedCommands[column.label] = command[column.key] ? 'Yes' : 'No'
               }
               else {
                   formattedCommands[column.label] = command[column.key]
               }
           }
        })

        return formattedCommands
    })
}

const exportToExcel = () => {
    // creating a worksheet from state
    const worksheet = utils.json_to_sheet(formatCommands())

    // creating a workbook and append worksheet
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // export to xlsx
    writeFileXLSX(workbook, fileName )
    
}
</script>

<template>
    <div>
        <button class="button is-primary mb-5" @click="exportToExcel">Export to Excel</button>
    </div>
</template>