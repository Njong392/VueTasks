<template>
    <BaseTable :columns="columns" :paginatedCommands="customerTypes">
        <template #rows="{ paginatedCommands}">
            <tr v-for="(customerType, index) in paginatedCommands" :key="customerType.id">
                <template v-for="column in columns">
                    <td>
                        {{ customerType[column.key] }}
                    </td>
                </template>
            </tr>
        </template>
    </BaseTable>

</template>

<script setup>
import { ref } from 'vue';
import customerTypeTable from '@/config/customerTypes';
import config from '@/config/config';
import BaseTable from './base/BaseTable.vue';

const customerTypes = ref(customerTypeTable);
const columns = ref(config.customerTypeTable.columns)

</script>