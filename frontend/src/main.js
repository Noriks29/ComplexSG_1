import { createApp } from 'vue'
import App from './App.vue'
import AlertToastPlugin from '@/js/alert'
import LoadProcessPlugin from '@/js/load'
import GlobalDataPlugin from './js/GlobalData'

const app = createApp(App)
app.use(AlertToastPlugin)
app.use(LoadProcessPlugin)
app.use(GlobalDataPlugin)
app.mount('#app')
