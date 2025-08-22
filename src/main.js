import { createApp } from 'vue'
import App from './App.vue'
import AlertToastPlugin from './js/alert'
import LoadProcessPlugin from './js/load'
import GlobalDataPlugin from './js/GlobalData'
import ModellingProcess from './js/ModellingController'
import 'core-js/stable'

const app = createApp(App)
app.use(AlertToastPlugin)
app.use(LoadProcessPlugin)
app.use(GlobalDataPlugin)
app.use(ModellingProcess)


import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css'
// Импортируем русскую локаль
app.use(PrimeVue, {
    locale: {
        firstDayOfWeek: 1,
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: [
        'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
        'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
        ],
        monthNamesShort: [
        'янв', 'фев', 'мар', 'апр', 'май', 'июн',
        'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
        ],
        today: 'Сегодня',
        clear: 'Очистить'
    }
});
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
app.component('Button', Button);
app.component('Toolbar', Toolbar);
app.component('DataTable', DataTable);
app.component('Column', Column);

app.mount('#app')
