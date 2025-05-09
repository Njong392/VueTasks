<template>
    <BaseTable :columns="columns" :paginatedCommands="clients">
        <template #rows="{ paginatedCommands }">
            <tr v-for="(client, index) in paginatedCommands" :key="client.customerNo" @click="selectRow(index)">
                <template v-for="column in columns" :key="column.key">
                    <td>
                        <div v-if="column.type === 'select'">
                            <span v-show="!isSelected(index)" @click.stop="selectedRow = index">
                                {{ clientOpts[column.optionsKey]?.[client[column.optionsKey]]?.label }}
                            </span>

                            <span v-show="isSelected(index)">
                                <BaseSelect :selectOptions="clientOpts[column.optionsKey]"
                                    v-model:inputValue="client[column.key]" @click.stop @blur="selectedRow = -1">
                                    <template #options="{ selectOptions }">
                                        <option v-for="[key, option] in Object.entries(selectOptions)" :key="key"
                                            :value="key">{{ option.label }}</option>
                                    </template>
                                </BaseSelect>

                            </span>

                        </div>

                        <div v-else>
                            <span v-show="!isSelected(index)" @click.stop="selectedRow = index">
                                {{ client[column.key] }}
                            </span>

                            <span v-show="isSelected(index)">
                                <BaseInput :inputType="column.type" inputClass="input"
                                    :readonly="column.editable == false" @click.stop
                                    v-model:inputValue="client[column.key]"
                                    @input="editRow(column.key, client[column.key])" @blur="selectedRow = -1">
                                </BaseInput>
                            </span>

                        </div>

                    </td>
                </template>

            </tr>

        </template>

        <template #newRowButton>
            <button class="button is-primary is-fullwidth" @click="initNewRow">
                Add Row
            </button>
        </template>

    </BaseTable>
</template>

<script setup>
import { ref } from "vue";
import clientTable from "@/config/clients"
import config from "@/config/config";
import BaseTable from "./base/BaseTable.vue";
import BaseInput from "./base/BaseInput.vue";
import BaseSelect from "./base/BaseSelect.vue";
import { useRowOperations } from "@/utils/rowOperations";


const clients = ref(clientTable)
const columns = ref(config.clientTable.columns)
const clientOpts = ref(config.clientTable.options)
let newClient = null
const { selectedRow, selectRow, isSelected } = useRowOperations()
const row = ref(null)

const initNewRow = () => {
    newClient = columns.value.reduce((acc, column) => {
        acc[column.key] = column.defaultValue
        return acc
    }, {})

    clients.value.push(newClient)
    newClient = null
}

const editRow = (columnKey, newValue) => {
    row.value = clients.value[selectedRow.value]

    if (row.value) {
        row.value[columnKey] = newValue
    }
}

</script>