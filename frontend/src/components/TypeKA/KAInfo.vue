<template>
    <div class="Panel_flex_column">
        <div class="Column_contain">
            <div class="Description">
                <p> Описание </p>
                <div class="KaIMG"><img src="./KA_A.png" alt="Картинка"></div>
                <div>
                    <div v-html="dataJson[0].Description"></div>
                </div>
            </div>
            <div class="PanelInfo">
                <p @click="ShowData"> Целевая аппаратура </p>
                <div>
                    <table class="TableDefault PanelDefault">
                        <tr>
                            <th>Название</th><th>Вт</th><th>Коэф-нт</th>
                        </tr>
                        <tr
                            v-for="data, index in SortData(dataJson[0].Equipment,1)"
                            :key="index"
                        >
                            <td>{{ data.name }}</td>
                            <td>{{ data.value }}</td>
                            <td>test</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="PanelInfo">
                <p> Бортовые устройства </p>
                <div>
                    <table class="TableDefault PanelDefault">
                        <tr>
                            <th>Название</th><th>Вт</th><th>Солнце</th><th>Земля</th><th>Цель</th>
                        </tr>
                        <tr
                            v-for="data, index in SortData(dataJson[0].Equipment,0)"
                            :key="index"
                        >
                            <td>{{ data.name }}</td>
                            <td>{{ data.value }}</td>
                            <td>{{ data.R1 }}</td>
                            <td>{{ data.R2 }}</td>
                            <td>{{ data.R3 }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="Column_contain">
            <div class="PanelInfo">
                <p> Бортовые устройства с постоянным потреблением энергии </p>
                <div>
                    <table class="TableDefault PanelDefault">
                        <tr>
                            <th>Название</th><th>Вт</th><th>Солнце</th><th>Земля</th><th>Цель</th>
                        </tr>
                        <tr
                            v-for="data, index in SortData(dataJson[0].Equipment,2)"
                            :key="index"
                        >
                            <td>{{ data.name }}</td>
                            <td>{{ data.value }}</td>
                            <td>{{ data.R1 }}</td>
                            <td>{{ data.R2 }}</td>
                            <td>{{ data.R3 }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="PanelInfo">
                <p> Бортовые устройства с переменным потреблением </p>
                <div>
                    <table class="TableDefault PanelDefault">
                        <tr>
                            <th>Название</th><th>Вт</th><th>Солнце</th><th>Земля</th><th>Цель</th>
                        </tr>
                        <tr
                            v-for="data, index in SortData(dataJson[0].Equipment,2)"
                            :key="index"
                        >
                            <td>{{ data.name }}</td>
                            <td>{{ data.value }}</td>
                            <td>{{ data.R1 }}</td>
                            <td>{{ data.R2 }}</td>
                            <td>{{ data.R3 }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="PanelInfo">
                <p>Параметры функционирования</p>
                <div>
                    <table class="TableDefault PanelDefault">
                        <tr><th colspan="3">Параметры разворота</th></tr>
                            <tr><td>Ускорение / замедление КА</td><td>гр/с<sup>2</sup></td>
                                <td>{{ dataJson[0].prm[0].value }}</td></tr>
                            <tr><td>Максимальная скорость вращения КА</td><td>гр/с</td>
                                <td>{{ dataJson[0].prm[1].value }}</td></tr>
                            <tr><td>Время стабилизации</td><td>с</td>
                                <td>{{ dataJson[0].prm[2].value }}</td></tr>
                        <tr><th colspan="3">Скорость передачи данных</th></tr>
                            <tr><td>Скорость передачи данных КА - КА</td><td>Мб/с</td>
                                <td>{{ dataJson[0].prm[3].value }}</td></tr>
                            <tr><td>Скорость передачи данных КА - НП</td><td>Мб/с</td>
                                <td>{{ dataJson[0].prm[4].value }}</td></tr>
                        <tr><th colspan="3">Максимальные углы съемки</th></tr>
                            <tr><td>Крен</td><td>Гр.</td>
                                <td>{{ dataJson[0].prm[5].value }}</td></tr>
                            <tr><td>Тангаж</td><td>Гр.</td>
                                <td>{{ dataJson[0].prm[6].value }}</td></tr>
                        <tr><th colspan="3">Аккумуляторная батарея</th></tr>
                            <tr><td>Емкость</td><td>Вт-ч</td>
                                <td>{{ dataJson[0].prm[7].value }}</td></tr>
                            <tr><td>Минимальный уровень заряда</td><td>Вт-ч</td>
                                <td>{{ dataJson[0].prm[8].value }}</td></tr>
                        <tr><th colspan="3">Память</th></tr>
                            <tr><td>Объем памяти</td><td>ГБ</td>
                                <td>{{ dataJson[0].prm[9].value }}</td></tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>

import jsons from "../../res/testAK1.json"

export default {
    name: 'KAInfo',
    data(){
        return{
            dataJson: jsons,
        }
    },
    methods:{
        ShowData(){
            console.log(this.dataJson[0].Name)
        },
        SortData(data, type){
            return data.filter(data => data.Type == type)
        }
    }
  }
</script>

<style lang="scss" scoped>

.Panel_flex_column{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 10px;

    .Column_contain{
        flex: 1;
        padding: 20px;
        min-width: 40%;
        display: inline-table;
    }

    .PanelInfo{
        p{
            color: white;
            white-space: nowrap;
            font-weight: bold;
            font-size: 22px;
        }
        table{
            width: 100%;
            padding: 12px;
            td{
                min-width: 80px;
                padding: 5px;
                &:first-child{
                    text-align: left;
                }
                color: white;
            }
        }
    }


}

.Description{
    text-align: left;
    font-size: 19px;
    color: white;
    p{
        font-size: 22px;
        font-weight: bold;
    }
    .KaIMG{
        text-align: center;
        img{
            width: 200px;
        }
    }
}

</style>
  
