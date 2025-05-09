import { ref } from "vue";

export function useRowOperations(){
    const selectedRow = ref(-1)

    const selectRow = (index) => {
        selectedRow.value = selectedRow.value === index ? -1 : index
    }

    const isSelected = (index) => {
        return selectedRow.value === index
    }

    return{
        selectedRow,
        selectRow,
        isSelected
    }
}