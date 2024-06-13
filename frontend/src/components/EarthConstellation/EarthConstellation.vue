<template>
    <div class="main_contain">
          <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false"/>
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
          
          <div class="titleText">
            План контактов НП – ОГ
          </div>
    <div class="DataTable"> <!-- Основной контейнер-->
        <div class="PanelDefault">
            <div>Парамертры системы</div>
            <div class="SystemInfo">
                <div>
                  <tr><td>Начальное время расчетов:</td>
                      <td v-html="CreateDateTime(systemStatus.startTime)"></td>
                    </tr>
                    <tr><td>Начало горизонта моделирования:</td>
                      <td v-html="CreateDateTime(systemStatus.modelingBegin)"></td>
                    </tr>
                    <tr><td>Окончание горизонта моделирования:</td>
                      <td v-html="CreateDateTime(systemStatus.modelingEnd)"></td>
                    </tr>
                  <tr><td>Шаг моделирования:</td><td>{{ experimentObject.modellingStep }}</td></tr>
                  <tr><td>Орбитальная группировка</td><td><SelectDiv  :dataOption="arr" :valueS="valueSS" :id="'0'"  @valueSelect="SelectChange"/></td></tr>
                </div>
            </div>
        </div>

    </div>
    <div class="DataTable">
        <h1>Эксперимент</h1>
      <div class="PanelDefault FlexColumn">
          <div><button @click="CommandWork(1)" class="ButtonCommand">C1 - рассчитать окна видимости</button></div>
          <div><button @click="CommandWork(2)" class="ButtonCommand">C2 - показать окна видимости / плана контактов</button></div>
          <div><button @click="CommandWork(3)" class="ButtonCommand">C3 - проверка ограничений</button></div>
          <div><button @click="CommandWork(4)" class="ButtonCommand">C4 - визуальный анализ окон видимости / плана контактов</button></div>
          <div><button @click="CommandWork(5)" class="ButtonCommand">C5 - расчёт плана контактов</button></div>
          <div><button @click="CommandWork(6)" class="ButtonCommand">C6 - графическое представление плана контактов</button></div>
        </div>
        <div class="PanelTable">
      <div class="TableInfo PanelDefault">
        <div class="ButtonApproved">
          <button v-if="requestApproved" @click="SatartEditing('request')" class="ButtonDefault"> <img src="../../assets/edit.svg">Редактировать</button> 
          <button v-if="requestApproved" class="ButtonDefaultShadow"></button>  
        </div>
        <div class="ButtonApproved">
          <button v-if="!requestApproved" @click="SatartSave('request')" :class="!requestJsonsave ? '' :'Empty disabled'" class="ButtonDefault"> <img src="../../assets/save.svg">Сохранить</button>
          <button v-if="!requestApproved && !requestJsonsave" class="ButtonDefaultShadow"></button>
        </div>
      </div>
      </div>
    </div>
    </div>
  </template>
  
  <script>

import {DisplayLoad, FetchGet} from '../../js/LoadDisplayMetod.js'
import {UnixToDtime} from "../../js/WorkWithDTime.js";
import MainStyle from '../../style/component.scss'
import DefaultTable from '../DefaultTable.vue';
import SelectDiv from '../SelectDiv.vue';

  export default {
    name: 'TargetDZZ',
    css:{
      MainStyle
    },
    props:{
        systemStatus:{
            type: Object
        },
    },
    components:{
      DefaultTable,
      SelectDiv
    },
    data(){
      return{
        ConstellationJson: [],
        earthSize: 0,
        ShowDefaultTable: false,
        dataLableName: {},
        dataTable: [],
        experimentObject: {
          startTime: 0,
          modellingBegin: 0,
          modellingEnd: 0,
          modellingStep: 0,
        },
        arr: [],
        TableViewWindow:[],
        AllResponse:[],
        valueSS: {},
      }
    },
    methods: {
        CommandWork(commandId){
            console.log(commandId)
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
                }]
            }
        },
        CreateDateTime(time){
          let Dtime = UnixToDtime(time)
          return Dtime.date + " " + Dtime.time
        },
        SelectComponent(nameComponent) {
          this.$emit('updateParentComponent', {
              nameComponent: nameComponent
          })
        },
    },
    
    async mounted() {
        DisplayLoad(true)
        let result = await FetchGet('/api/v1/earth/get/list')
        this.earthSize = result.length || 0

        result = await FetchGet('/api/v1/constellation/get/list')
        this.ConstellationJson = await result

        for (let i = 0; i < this.ConstellationJson.length; i++) {
          const element = this.ConstellationJson[i];
          this.arr.push({value: element, lable: element.constellationName })
        }
        this.arr.push({value: {}, lable: "Все ОГ" })
        this.valueSS = {value: {}, lable: "Все ОГ" }

        this.experimentObject.startTime = this.systemStatus.startTime
        this.experimentObject.modellingEnd = this.systemStatus.modelingEnd
        this.experimentObject.modellingBegin = this.systemStatus.modelingBegin
        this.experimentObject.modellingStep = this.systemStatus.step
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
.ButtonCommand{
  background: #2b2b2b;
  color: white;
  border: 1px solid black;
  padding: 14px;
  font-size: 16px;
  border-radius: 10px;
  box-shadow: -3px 3px 1px black;
  margin: 5px;
  transition: all 0.2s;

  &:hover{
    box-shadow: -1px 1px 2px black;
    background: #202020;
  }
  &:active{
    border-radius: 5px;
    background: #171717;
    box-shadow: -3px 3px 10px black;
  }
  &.small{
    padding: 5px;
    font-size: 14px;
    margin: 3px;
  }
}

.FlexColumn{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
