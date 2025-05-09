import { ref } from "vue";

export function useFormValidation(columns, commands){
    const newRow= ref(null)
    const isOrderNoDuplicate = ref(false)
    const isFieldEmpty = ref(false)

    // add new row to the table
    const addNewRow = () => {
        // check for duplicate order number
        // const isDuplicate = commands.some(command => {
        //     return command.orderNo === newRow.value.orderNo
        // })

        // // check for empty fields
        // const hasEmptyField = Object.values(newRow.value).some(value => {
        //     return value === '' || value === null || value === undefined
        // })

        // if(isDuplicate){
        //     isOrderNoDuplicate.value = true
        //     return
        // }

        // if(hasEmptyField){
        //     isFieldEmpty.value = true
        //     return
        // }

    
        commands.push(newRow.value)
        newRow.value = null
        // isOrderNoDuplicate.value = false
        // isFieldEmpty.value = false

        return true
    }

    // cancel addition of row 
    const cancelRow = () => {
        newRow.value = null
    }

    // initialise row values
    const initNewRow = (placeholder) => {
        newRow.value = columns.reduce((acc, column) => {
            if(column.visibility){
                acc[column.key] = placeholder
            }
            return acc
        }, {})
    }

    return{
        newRow,
        isOrderNoDuplicate,
        isFieldEmpty,
        addNewRow,
        cancelRow,
        initNewRow
    }
}