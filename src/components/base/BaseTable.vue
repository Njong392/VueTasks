<script setup>
import { onMounted, ref } from 'vue'
import config from '@/config/config'

const props = defineProps({
    columns: Array,
    paginatedCommands: Array,
    isColumnSorted: Function,

})

const emit = defineEmits(['column-selected', 'order-selected'])
const activeColumn = ref(null)
const selectedColumn = ref(null)
const sortingOrders = ref(config.table.sortingOrders)
const newArray = ref([])
const sortingOrderIndex = ref(null)


// Sorting fuctions
const toggleMenu = (columnKey) => {
    activeColumn.value = activeColumn.value === columnKey ? null : columnKey
}

const toggleOrders = (index) => {
    if(newArray.value.length > 0){
        newArray.value = sortingOrders.value.splice(0,1, ...newArray.value)
    } else{
        newArray.value = sortingOrders.value.splice(index,1, ...newArray.value)
    }
    
}

const selectSortingOrder = (order, activeColumn, index) => {
    // emit event with selected order and selected column
    emit('order-selected', order, activeColumn)
    newArray.value = sortingOrders.value.splice(index, 1, ...newArray.value)
    sortingOrderIndex.value = index
    //console.log(sortingOrderIndex.value)
    
}

// Column functions
const selectColumn = (column) => {
    emit('column-selected', column)
    selectedColumn.value = column
    
}

onMounted(() => {
    // remove asc order obj from sorting orders and put in newArray
    newArray.value = sortingOrders.value.splice(0, 1, ...newArray.value)
    
})

</script>

<template>
    <div class="table-container container">
        <table class="table is-bordered is-striped">
            <thead>
                <tr>
                    <template v-for="column in columns" :key="column.key">
                        <th v-if="column.visibility" @click="selectColumn(column)" :class="{ 'is-selected': selectedColumn === column }">
                            <span class="is-flex">
                                {{ column.label }}
                                <div v-if="column.sortable" class="menu-container">
                                    <font-awesome-icon icon="ellipsis-vertical" @click.stop="toggleMenu(column.key)"
                                        class="is-clickable" />
                                    
                                    <font-awesome-icon v-if="newArray[0]" :icon="newArray[0].icon" class="is-clickable" @click.stop="toggleOrders(sortingOrderIndex)"/>

                                    <div class="box" v-if="activeColumn === column.key">

                                        <span class="is-flex" v-for="(sortingOrder, index) in sortingOrders"
                                            :key="sortingOrder.value"
                                            @click.stop="selectSortingOrder(sortingOrder.value, activeColumn, index)">
                                            <font-awesome-icon :icon="sortingOrder.icon" />
                                            <p>{{ sortingOrder.label }}</p>

                                        </span>


                                    </div>
                                </div>
                            </span>

                        </th>
                    </template>

                </tr>
            </thead>
            <tbody>
                <slot name="rows" :paginatedCommands="paginatedCommands" />
            </tbody>
        </table>

        <div>
            <slot name="newRowButton"></slot>
        </div>

        <div>
            <slot name="pagination"></slot>
        </div>

        
    </div>
</template>

<style scoped>
.menu-container {
    position: relative;
}

.box {
    position: absolute;
    flex-wrap: nowrap;
    top: 100%;
    right: 0;
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 0px;
    gap: 0.5rem;
}

.box span{
    cursor: pointer;
    padding: 0.25rem 0.5rem;
}

.box span:hover{
    background-color: #f0f0f0;
}
</style>