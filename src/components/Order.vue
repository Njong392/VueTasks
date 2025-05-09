<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import BaseTable from './base/BaseTable.vue'
import ExcelExport from './ExcelExport.vue'
import config from '@/config/config'
import { usePagination } from '@/utils/pagination'
import BaseInput from './base/BaseInput.vue'
import BaseSelect from './base/BaseSelect.vue'
import Ribbon from './Ribbon.vue'
import Filter from './Filter.vue'
import SearchBar from './SearchBar.vue'
import DropDownSearch from './DropDownSearch.vue'
import clientCommands from '@/config/commands'
import clients from '@/config/clients'
import { useSearch } from '@/utils/search'
import { useRowOperations } from '@/utils/rowOperations'
import namingSeriesTable from '@/config/namingSeries'
import customerTypes from '@/config/customerTypes'

const reactiveCommands = ref(clientCommands)
const clientList = ref(clients)
const columns = ref(config.table.columns)
const searchableCols = ref(config.table.searchableColumns)
const selectedColumn = ref(null)
const dropdownOpts = ref(config.table.options)
const booleanOpts = ref(config.table.booleanOptions)
const defaultSort = ref(config.table.defaultSort)
const clientColumns = ref(config.clientTable.columns)
const searchQuery = ref('')
const filterSearchQuery = ref('')
const categorySearchQuery = ref('')
const { filteredCommands } = useSearch(reactiveCommands, searchQuery, filterSearchQuery, categorySearchQuery, searchableCols, columns)
const { totalNumberOfPages, currentPage, nextPage, prevPage, firstPage, lastPage, rowsPerPage } = usePagination(filteredCommands)
const currentSort = ref({})
let newOrder = null
let row = ref(null)
const selectedRowOnClientTable = ref(-1)
const isOrderMaxedOut = ref(false)
const { selectedRow, selectRow, isSelected } = useRowOperations()
const namingSeries = ref(namingSeriesTable)


// adding number of days to date
const addDays = (date, days) => {
    date = new Date(date)
    date.setDate(date.getDate() + days)
    return date
}

const getOrderCount = (customerNo) => {
    return filteredCommands.value.reduce((count, command) => {
        if (command.customerNo === customerNo) {
            return count + 1
        } else {
            return count
        }
    }, 0)
}

// get true index of rows
const getTrueIndex = (index) => {
    return (currentPage.value - 1) * rowsPerPage.value + index
}

const emitSearch = (query) => {
    searchQuery.value = query
}

const emitFilterSearch = (query) => {
    filterSearchQuery.value = query

}

const emitCategorySearch = (query) => {
    categorySearchQuery.value = query
}

// Filtered commands for export
const expCommands = computed(() => {
    return filteredCommands.value.map((command) => {
        const filteredCommandObj = {}
        columns.value.forEach((column) => {
            if (column.visibility) {
                filteredCommandObj[column.key] = command[column.key]
            }
        })
        return filteredCommandObj
    })
})

// Paginated rows
const paginatedCommands = computed(() => {
    const startIndex = (currentPage.value - 1) * rowsPerPage.value
    const endIndex = startIndex + rowsPerPage.value
    return filteredCommands.value.slice(startIndex, endIndex)
})


const isClientTableRowSelected = (index) => {
    row.value = filteredCommands.value[selectedRow.value]
    selectedRowOnClientTable.value = index
    const rowToFill = clientList.value[selectedRowOnClientTable.value]

    const orderCount = getOrderCount(rowToFill.customerNo)
    console.log(orderCount)

    if (rowToFill['maxCommandNo'] === orderCount) {
        isOrderMaxedOut.value = true
        return
    }
    if (row.value && rowToFill) {
        isOrderMaxedOut.value = false
        row.value['customerNo'] = rowToFill['customerNo']
        row.value['customerName'] = rowToFill['customerName']

        // keep track of original delivery date. if it does not, init it to delivery date
        if (!row.value.originalDeliveryDate) {
            row.value.originalDeliveryDate = row.value['deliveryDate']
        }

        // add delivery days to delivery date
        row.value['deliveryDate'] = addDays(row.value.originalDeliveryDate, rowToFill['deliveryDays'])

    }


}

const initNewRow = () => {
    // Get the default naming series
    const defaultSeries = namingSeries.value.find(series => series.isDefault)

    if(!defaultSeries){
        console.log('No default naming series found')
        return
    }

    // Get the last number used or start from startNo
    let nextOrderNo = ""
    if(!defaultSeries.lastUsedNo){
        nextOrderNo = defaultSeries.startNo
    } else{
        // check if lastUsedNo is within range of startNo and endNo
       if(defaultSeries.lastUsedNo <= defaultSeries.endNo){
           // get prefix and number from lastUsedNo and increment
           const match = defaultSeries.lastUsedNo.match(/^([A-Z]+-)(\d+)$/)
           if (match) {
               const prefix = match[1]
               const number = parseInt(match[2]) + 1
               const padded = number.toString().padStart(match[2].length, '0')
               nextOrderNo = `${prefix}${padded}`
           } else {
               console.log('Invalid last used number format')
               return
           }
       }
    }


    // set up new order
    newOrder = columns.value.reduce((acc, column) => {
        acc[column.key] = column.key === 'orderNo' ? nextOrderNo : column.defaultValue
        return acc

    }, {})

    // push to table
    filteredCommands.value.push(newOrder)

    // update lastUsedNo in naming series table
    defaultSeries.lastUsedNo = nextOrderNo

    newOrder = null
}

const editRow = (columnKey, newValue) => {
    // row.value is inited when you start typing to edit
    row.value = filteredCommands.value[selectedRow.value]

    if (row.value) {
        row.value[columnKey] = newValue
    }

}

// Column operations
const selectColumn = (column) => {
    selectedColumn.value = column

}

const sortColumn = (order, activeColumn) => {
    // activeColumn now becomes an object 
    activeColumn = columns.value.find(col => col.key === activeColumn)

    // keep track of sorted column
    //currentSort.value = { columnKey: activeColumn.key, order: order }

    if (activeColumn) {
        filteredCommands.value.sort((a, b) => {
            const valueA = a[activeColumn.key]
            const valueB = b[activeColumn.key]

            if (activeColumn.type === 'number') {
                return order === 'asc' ? valueA - valueB : valueB - valueA
            } else if (activeColumn.type === 'date') {
                return order === 'asc' ? new Date(valueA) - new Date(valueB) : new Date(valueB) - new Date(valueA)
            } else {
                return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
            }
        })
    }

}

const isColumnSorted = (activeColumn) => {
    return currentSort.value.columnKey === activeColumn
}


onMounted(() => {
    // initialize sort for the first column 
    sortColumn(defaultSort.value, columns.value[0].key)
    currentSort.value = { columnKey: columns.value[0].key, order: defaultSort.value }

})

watch(() => filteredCommands, () => {
    currentPage.value = 1; // Reset to first page when search updates commands

    router.push({
        name: 'home',
        query: { currentPage: 1 }
    })
});


</script>

<template>
    <div class="fixed-grid container has-6-cols">
        <div class="grid">
            <div class="cell is-col-span-1">
                <Filter @filter-search="emitFilterSearch" :buttons="columns" />

            </div>

            <div class="cell is-col-span-5">
                <SearchBar @search="emitSearch" />
                <DropDownSearch @category-search="emitCategorySearch" :dropdownCategories="columns" />
                <div>
                    <Ribbon :columns="columns" :commands="filteredCommands" :selectedRow="selectedRow"
                        :selectedColumn="selectedColumn" @update-selected-column="selectedColumn = $event" />

                    <ExcelExport :commands="expCommands" :columns="columns" />

                    <p class="has-text-danger is-small" v-if="isOrderMaxedOut">You can no longer create a new command
                        for this customer because they have reached a limit for orders. If you want to create another
                        order for this customer, delete an order</p>
                    <BaseTable :columns="columns" @column-selected="selectColumn" :paginatedCommands="paginatedCommands"
                        :isColumnSorted="isColumnSorted" @order-selected="sortColumn">
                        <template #rows="{ paginatedCommands }">

                            <tr v-for="(command, index) in paginatedCommands" :key="command.orderNo"
                                @click="selectRow(getTrueIndex(index))"
                                :class="{ 'is-selected': isSelected(getTrueIndex(index)) }">
                                <template v-for="column in columns" :key="column.key">
                                    <td v-if="column.visibility" :class="{ 'is-selected': selectedColumn === column }">


                                        <!-- Render the column based on the type. Status and date have different rendering -->
                                        <div v-if="['select', 'boolean'].includes(column.type)">
                                            <span v-show="!isSelected(getTrueIndex(index))"
                                                @click.stop="selectedRow = getTrueIndex(index)"
                                                :class="[dropdownOpts[column.optionsKey]?.[command[column.optionsKey]]?.class || '']">
                                                {{ column.type === 'select' ?
                                                    dropdownOpts[column.optionsKey]?.[command[column.optionsKey]]?.label ||
                                                    'Unknown' : booleanOpts[command[column.key]]?.label }}
                                            </span>
                                            <span v-show="isSelected(getTrueIndex(index))">
                                                <BaseSelect
                                                    :selectOptions="column.type === 'select' ? dropdownOpts[column.optionsKey] : booleanOpts"
                                                    v-model:inputValue="command[column.key]" @click.stop>
                                                    <template #options="{ selectOptions }">
                                                        <option v-for="[key, option] in Object.entries(selectOptions)"
                                                            :key="key" :value="key">
                                                            {{ option.label }}
                                                        </option>
                                                    </template>
                                                </BaseSelect>
                                            </span>
                                        </div>



                                        <div v-else-if="['date', 'number', 'text'].includes(column.type)">
                                            <span v-show="!isSelected(getTrueIndex(index))"
                                                @click.stop="selectedRow = getTrueIndex(index)">
                                                {{ column.type === 'date' ? new
                                                    Date(command[column.key]).toLocaleDateString('en-GB') :
                                                command[column.key] }}
                                            </span>

                                            <span v-show="isSelected(getTrueIndex(index))" class="container">
                                                <BaseInput :inputType="column.type" inputClass="input"
                                                    v-model:inputValue="command[column.key]" @click.stop
                                                    :readonly="column.editable == false"
                                                    @input="editRow(column.key, command[column.key])"
                                                    @blur="selectedRow = -1"></BaseInput>

                                                <div class="box" @click.stop v-if="['customerNo'].includes(column.key)">
                                                    <table class="table is-hoverable is-narrow">
                                                        <tbody>
                                                            <tr v-for="(client, index) in clientList"
                                                                class="is-clickable"
                                                                @click.stop="isClientTableRowSelected(index)">
                                                                <template
                                                                    v-for="clientColumn in clientColumns.slice(0, 2)">
                                                                    <td>{{ client[clientColumn.key] }}</td>
                                                                </template>
                                                            </tr>
                                                        </tbody>

                                                    </table>
                                                </div>

                                            </span>
                                        </div>

                                    </td>
                                </template>
                            </tr>
                        </template>

                        <template #newRowButton>
                            <button class="button is-primary is-fullwidth" v-if="currentPage == totalNumberOfPages"
                                @click="initNewRow">Add
                                Row</button>
                        </template>

                        <template #pagination>
                            <div class="field is-grouped">
                                <button class="button is-primary m-2 is-small" @click="firstPage"
                                    :disabled="currentPage == 1">First</button>
                                <button class="button is-primary m-2 is-small" @click="prevPage"
                                    :disabled="currentPage == 1">Prev</button>
                                <button class="button is-primary m-2 is-small" @click="nextPage"
                                    :disabled="currentPage == totalNumberOfPages">Next</button>
                                <button class="button is-primary m-2 is-small" @click="lastPage"
                                    :disabled="currentPage == totalNumberOfPages">
                                    Last</button>
                            </div>

                        </template>
                    </BaseTable>
                </div>

            </div>

        </div>

    </div>

</template>

<style scoped>
td {
    position: inherit;
    padding: 0.5rem;

}

td.editable-cell {
    padding: 0;
}

td>.select,
td>input {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: none;
    font-size: inherit;
    text-align: inheri;

}

td>.select:hover,
td>input:hover {
    outline: 1px solid #ccc;
}

.container {
    position: relative;
}

.box {
    position: absolute;
    right: 0;
    z-index: 10;

}
</style>