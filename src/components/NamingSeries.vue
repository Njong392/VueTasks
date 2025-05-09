<template>
    <BaseTable :columns="columns" :paginatedCommands="namingSeries">
        <template #rows="{ paginatedCommands }">
            <tr v-for="(namingSerie, index) in paginatedCommands" :key="namingSerie.id">
                <template v-for="column in columns">
                    <td>
                        <div v-if="column.type === 'boolean'">
                            <BaseCheckbox v-model:vModelValue="namingSerie[column.key]" @change="handleCheckboxChange(index, column.key)">
                            </BaseCheckbox>
                        </div>

                        <div v-else>
                             {{ namingSerie[column.key] }}
                        </div>
                    </td>
                </template>
            </tr>
        </template>
    </BaseTable>
</template>

<script setup>
import { ref } from 'vue';
import namingSeriesTable from '@/config/namingSeries';
import config from '@/config/config';
import BaseTable from './base/BaseTable.vue';
import BaseCheckbox from './base/BaseCheckbox.vue';

const namingSeries = ref(namingSeriesTable);
const columns = ref(config.namingSeriesTable.columns)

const handleCheckboxChange = (rowIndex, columnKey) => {
    namingSeries.value.forEach((namingSerie, index) => {
        if(index !== rowIndex){
            namingSerie[columnKey] = false 
        }
    })
}
</script>