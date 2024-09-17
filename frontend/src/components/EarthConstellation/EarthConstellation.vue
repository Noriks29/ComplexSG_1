<template>
    <div class="main_contain">
          <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false"/>
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
          
          
    <div class="ContentDiv">
      <div class="TitleText">План контактов НП – ОГ</div>
      <div class="Panel">
          <div>Парамертры системы</div>
            <div class="SystemInfo">
              <table>
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
                  <tr><td>Орбитальная группировка КА ДЗЗ:</td><td><SelectDiv  :dataOption="arr" :valueS="valueSS" :id="'0'"  @valueSelect="SelectChange"/></td></tr>
                </table>
            </div>
        </div>
    <div class="Panel MaxWidth">
      <p>Эксперимент</p>
      <div class="FlexColumn">
          <div><button @click="CommandWork(1)" class="ButtonCommand">C1 - рассчитать окна видимости</button></div>
          <div><button @click="CommandWork(2)" class="ButtonCommand">C2 - показать окна видимости / плана контактов</button></div>
          <div><button @click="CommandWork(3)" class="ButtonCommand">C3 - проверка ограничений</button></div>
          <div><button @click="CommandWork(4)" class="ButtonCommand">C4 - визуальный анализ окон видимости / плана контактов</button></div>
          <div><button @click="CommandWork(5)" class="ButtonCommand">C5 - расчёт плана контактов</button></div>
          <div><button @click="CommandWork(6)" class="ButtonCommand">C6 - графическое представление плана контактов</button></div>
        </div>
      </div>
      <div class="TableInfo Panel MaxWidth">
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
       async CommandWork(commandId){
            console.log(commandId)
            if(commandId == 2){

              this.ShowDefaultTable = true
              this.dataLableName = [
                {lable: "НП", nameParam: "earthName"},
                {lable: "КА", nameParam: "satelliteId"},
                {lable: "Начало", nameParam: "begin"},
                {lable: "Конец", nameParam: "end"},
              ]
              //дальше мы типо запрашиваем данные
              let response = await FetchGet('/api/v1/modelling/data/earth-sat/all')
              console.log(response)
              this.dataTable = await response
              this.dataTable =this.dataTable.sort((a, b) => parseFloat(a.begin) - parseFloat(b.begin))
              console.log(this.dataTable, "tttt")
              
              for (let index = 0; index < this.dataTable.length; index++) {
                this.dataTable[index].begin = this.CreateDateTime(this.dataTable[index].begin)
                this.dataTable[index].end = this.CreateDateTime(this.dataTable[index].end)
                
              }
            }
            if(commandId == 5){
              DisplayLoad(true)
              let result = await FetchGet("/api/v1/modelling/contact-plan/sat-earth")
              console.log(result)
              DisplayLoad(false)
            }
            if(commandId == 1){
              DisplayLoad(true)
              let response = await FetchGet('/api/v1/modelling/view/earth')
              console.log(response)
              DisplayLoad(false)
            }
        },
        CreateDateTime(time){
          let Dtime = UnixToDtime(time)
          return Dtime.date + " " + Dtime.time + " МСК"
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
        this.arr.push({value: {}, lable: "Все ОГ ДЗЗ" })
        this.valueSS = {value: {}, lable: "Все ОГ ДЗЗ" }

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

.FlexColumn{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  div{
    width: 100%;
    button{
      width: 96%;
      text-align: start;
    }
  }
}
</style>
