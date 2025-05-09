import { computed, onMounted, ref, watch } from "vue";
import config from "@/config/config";
import { useRoute, useRouter } from "vue-router";
import clientCommands from '@/config/commands.json'

export function usePagination(commands){
    const route = useRoute();
    const router = useRouter();
    const currentPage = ref(Number(route.query.currentPage));
    //const commands = ref(clientCommands);
    const rowsPerPage = ref(config.table.rowsPerPage);


    const totalNumberOfPages = computed(() => {
        return Math.max(1, Math.ceil(commands.value.length / rowsPerPage.value))
    })

    const nextPage = () => {
        if(currentPage.value < totalNumberOfPages.value){
            currentPage.value += 1
            updateRoute()
        }
    }

    const prevPage = () => {
        if(currentPage.value > 1){
            currentPage.value -= 1
            updateRoute()
        }
    }

    const lastPage = () => {
        currentPage.value = totalNumberOfPages.value
        updateRoute()

    }

    const firstPage = () => {
        currentPage.value = 1
        updateRoute()
    }

    // update route whenever currentPage changes
    const updateRoute = () => {
        if(currentPage.value < 1){
            currentPage.value = 1
        } else if(currentPage.value > totalNumberOfPages.value){
            currentPage.value = totalNumberOfPages.value
        }

        router.push({
            name: route.name,
            query: {...route.query, currentPage: currentPage.value}
        })
    }

    // watch for changes in currentPage param and update current page value. 1st argument is getter
    watch(() => route.query.currentPage, (newPage) => {
        currentPage.value = Number(newPage) || 1
    })

    // watch for changes in the rows per page and empty pages
    watch(() => commands.value.length, () =>  {
       const startIndex = (currentPage.value - 1) * rowsPerPage.value

       if(startIndex >= commands.value.length && currentPage.value > 1){
           currentPage.value -= 1
           updateRoute()
       }
    })

    // When page first loads, set query param
    onMounted(() => {
        if(!route.query.currentPage){
            router.replace({query: {...route.query, currentPage: 1}})
        }
    })

    return{
        totalNumberOfPages,
        currentPage,
        rowsPerPage,
        nextPage,
        prevPage,
        lastPage,
        firstPage
    }

}
