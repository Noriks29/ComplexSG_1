import { createApp } from 'vue'
import App from './App.vue'
import LoadProcessPlugin from './js/load'
import GlobalDataPlugin from './js/GlobalData'
import ModellingProcess from './js/ModellingController'
import 'core-js/stable'

const app = createApp(App)
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
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import SelectButton from 'primevue/selectbutton';
import Dropdown from 'primevue/dropdown';
import FloatLabel from 'primevue/floatlabel';
import FileUpload from 'primevue/fileupload';
import Calendar from 'primevue/calendar';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row'; 
import TabMenu from 'primevue/tabmenu';
import Password from 'primevue/password';
import Card from 'primevue/card';
import Menubar from 'primevue/menubar';
import Panel from 'primevue/panel';
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
import Menu from 'primevue/menu';

import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
app.component('Toast', Toast);
app.use(ToastService);

import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
app.component('ConfirmDialog', ConfirmDialog)
app.use(ConfirmationService);

app.component('Button', Button);
app.component('Toolbar', Toolbar);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('InputNumber', InputNumber);
app.component('InputText', InputText);
app.component('SelectButton', SelectButton);
app.component('Dropdown', Dropdown);
app.component('FloatLabel', FloatLabel);
app.component('FileUpload', FileUpload);
app.component('Calendar', Calendar);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('TabMenu', TabMenu);
app.component('Password', Password);
app.component('Card', Card);
app.component('Menubar', Menubar);
app.component('Panel', Panel);
app.component('RadioButton', RadioButton);
app.component('Checkbox', Checkbox);
app.component('Menu', Menu);

app.mount('#app')


