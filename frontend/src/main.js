import { createApp } from 'vue'
import App from './App.vue'
import AlertToastPlugin from '@/js/alert'
import LoadProcessPlugin from '@/js/load'
import GlobalDataPlugin from './js/GlobalData'
import ModellingProcess from '@/js/ModellingController'

const app = createApp(App)
app.use(AlertToastPlugin)
app.use(LoadProcessPlugin)
app.use(GlobalDataPlugin)
app.use(ModellingProcess)
app.mount('#app')
