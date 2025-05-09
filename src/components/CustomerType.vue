<template>
    <BaseTable :columns="columns" :paginatedCommands="customerTypes">
        <template #rows="{ paginatedCommands}">
            <tr v-for="(customerType, index) in paginatedCommands" :key="customerType.id">
                <template v-for="column in columns">
                    <td>
                        <div v-if="column.type === 'select'">
                            <span v-show="!isSelected(index)" @click.stop="selectedRow = index">
                                {{ serieOpts[column.optionsKey]?.[customerType[column.optionsKey]]?.label }}
                            </span>

                            <span v-show="isSelected(index)">
                                <BaseSelect :selectOptions="serieOpts[column.optionsKey]"
                                    v-model:inputValue="customerType[column.key]" @click.stop @blur="selectedRow = -1">
                                    <template #options="{ selectOptions}">
                                        <option v-for="[key, option] in Object.entries(selectOptions)" :key="key"
                                            :value="key">
                                            {{ option.label }}
                                        </option>
                                    </template>
                                </BaseSelect>

                            </span>
                        </div>

                        <div v-else>
                            {{ customerType[column.key] }}
                        </div>
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
import BaseSelect from './base/BaseSelect.vue';
import { useRowOperations } from '@/utils/rowOperations';

const customerTypes = ref(customerTypeTable);
const columns = ref(config.customerTypeTable.columns)
const serieOpts = ref(config.customerTypeTable.options)
const { isSelected, selectedRow } = useRowOperations()

</script>