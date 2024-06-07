<template>
    <div class="main_contain">
          <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false"/>
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
          
          <div class="titleText">
            Оценка орбитального построения ОГ
          </div>
    <div class="DataTable"> <!-- Основной контейнер-->
        <div class="PanelDefault">
            <div>Парамертры системы</div>
            <div class="SystemInfo">
                <div>
                    <div>Начальное время расчетов:          {{ systemStatus.startTime }}</div>
                    <div>Начало горизонта моделирования:    {{ systemStatus.modelingBegin }}</div>
                    <div>Окончание горизонта моделирования: {{ systemStatus.modelingEnd }}</div>
                </div>
            </div>
            Количество целей: {{ purposesJson }}
        </div>

    </div>
    <div class="DataTable">
        <h1>Эксперимент</h1>
        <p>Заявки</p>
      <div class="PanelDefault">
        
        <table class="TableDefault">
          <tr>
            <th>ОГ</th><th>Имя</th><th>Использование</th>
          </tr>
          <tr
          v-for="data, index in ConstellationJson"
            :key="index"
            :class="!requestApproved ? 'active' :''"
            @change="ChangeParamRequest"
          >
            <td>{{ index }}</td>
            <td>{{data.constellationName}}</td>
            <td>{{"выбор"}}</td>
          </tr>
        </table>
        <div class="CommandButtons"> 
            <div>Количество окон видимости: {{ numberVisibilityWindows }}</div>
            <div @click="CommandWork({}, 1)">C1</div>
            <div @click="CommandWork({}, 2)">C2</div>
        </div>
        </div>
    </div>
    </div>
  </template>
  
  <script>

import {DisplayLoad, FetchGet} from '../../js/LoadDisplayMetod.js'
import MainStyle from '../../style/component.scss'
import DefaultTable from '../DefaultTable.vue';

  export default {
    name: 'EstimationConstellation',
    css:{
      MainStyle
    },
    props:{
        systemStatus:{
            type: Object
        },
    },
    components:{
      DefaultTable
    },
    data(){
      return{
        ConstellationJson: [],
        purposesJson: 0,
        numberVisibilityWindows: 0,
        ShowDefaultTable: false,
        dataLableName: {},
        dataTable: [],
      }
    },
    methods: {
        CommandWork(data, commandId){
            console.log(commandId, data)
            if(commandId == 2){
              this.ShowDefaultTable = true
              this.dataLableName = [
                {lable: "Отправитель", nameParam: "goalLabel"},
                {lable: "Получатель", nameParam: "scLabel"},
                {lable: "Начало", nameParam: "begin"},
                {lable: "Конец", nameParam: "end"},
              ]
              //дальше мы типо запрашиваем данные
              this.dataTable = [{
                  "goalLabel": "GSFC",
                  "scLabel": "8805",
                  "begin": 123256216223,
                  "end": 123256216223
                }, {
                  "goalLabel": "GSFC",
                  "scLabel": "8803",
                  "begin": 123256216323,
                  "end": 123256216323
              }]
            }
        },
        SelectComponent(nameComponent) {
          this.$emit('updateParentComponent', {
              nameComponent: nameComponent
          })
        },
    },
    
    async mounted() {
        DisplayLoad(true)
        let result = await FetchGet('/api/v1/satrequest/request/get/all')
        this.purposesJson = result.length || 0
        result = await FetchGet('/api/v1/constellation/get/list')
        this.ConstellationJson = result || {}
        DisplayLoad(false)

    }
  }
  </script>

<style lang="scss" scoped>
.main_contain{
  display: inline-flex;
  flex-direction: column;
  flex-wrap: nowrap;
  color: white;
}
td{
  text-align: left;

}
th{
  border-bottom: 2px solid white;

}
.PanelDefault{
    
    .SystemInfo{
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        align-items: center;
        color: white;
        text-align: left;
        padding: 10px;
        justify-content: space-around;

        .paddl{
            padding-left: 15px;
        }
    }
}
.CommandButtons{
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    div{
        padding: 5px;
    }
}
</style>
