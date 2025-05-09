import 'bulma/css/bulma.css'
import router from './router'

import { createApp } from 'vue'
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { faArrowUpAZ } from '@fortawesome/free-solid-svg-icons'
import { faArrowDownZA } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faEllipsisVertical)
library.add(faArrowUpAZ)
library.add(faArrowDownZA)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(router).mount('#app')
