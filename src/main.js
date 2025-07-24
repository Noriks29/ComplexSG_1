import { createApp } from 'vue'
import App from './App.vue'
import AlertToastPlugin from './js/alert'
import LoadProcessPlugin from './js/load'
import GlobalDataPlugin from './js/GlobalData'
import ModellingProcess from './js/ModellingController'

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

/*
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: { //Основной цвет
            50: '#f3f5fd',
            100: "#c7cff3",
            200: "#9ba9ea",
            300: "#6f82e1",
            400: "#435cd8",
            500: "#1736cf",
            600: "#142eb0",
            700: "#102691",
            800: "#0d1e72",
            900: "#091653",
            950: "#060e34"
        },
        colorScheme: {
        light: {
            surface: {
                0: '#ffffff',
                50: '#f7f6f6',
                100: '#dbd3d3',
                200: '#beafaf',
                300: '#a18c8c',
                400: '#846969',
                500: '#674646',
                600: '#583c3c',
                700: '#483131',
                800: '#392727',
                900: '#291c1c',
                950: '#1a1212'
            },
            formField: {
                    hoverBorderColor: '{primary.color}'
                }
            },
        dark: {
            surface: {
                0: '#ffffff',
                50: '#f9f9f9',
                100: '#e0e1e3',
                200: '#c8c8cd',
                300: '#afb0b7',
                400: '#9798a1',
                500: '#7e808b',
                600: '#6b6d76',
                700: '#585a61',
                800: '#45464c',
                900: '#323338',
                950: '#202023'
            },
            formField: {
                    hoverBorderColor: '{primary.color}'
                }
            }
    }
    }
});

app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: '.app-dark',
            prefix: 'my',
            cssLayer: false
        }
    },
});
*/
app.mount('#app')
