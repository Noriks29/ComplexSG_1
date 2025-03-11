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
                  <tr><td>КА для моделлирования:</td><td><input type="checkbox" :checked="KAModellingRoleMode" @change="KAModellingRoleMode = $event.target.checked">{{ KAModellingRoleMode ? 'Только Лидеры' : 'Все КА' }}</td></tr>
                </table>
            </div>
        </div>
    <div class="Panel MaxWidth">
      <div class="FlexColumn">
          <div><button @click="CommandWork(1)" class="ButtonCommand">Рассчитать окна видимости</button></div>
          <div><button @click="CommandWork(2)" class="ButtonCommand">Показать окна видимости / плана контактов</button></div>
          <div><button @click="CommandWork(3)" class="ButtonCommand disable"  v-if="false">Проверка ограничений</button></div>
          <div><button @click="CommandWork(4)" class="ButtonCommand disable"  v-if="false">Визуальный анализ окон видимости / плана контактов</button></div>
          <div><button @click="CommandWork(5)" class="ButtonCommand">Расчёт плана контактов</button></div>
          <div><button @click="CommandWork(6)" class="ButtonCommand">Графическое представление плана контактов</button></div>
        </div>
      </div>
    </div>
    <div id="PlotlyDiv" v-if="ShowPlotlyContain">
      <div class="ContainerDiv">
        <div class="closebutton"><button @click="ShowPlotlyContain = false">
        <img src="../../assets/close.svg"><span>&#8203;</span>
      </button></div>

      <div id="plotlymapContain1" style="height: 79vh;"></div>
      </div>
    </div>
    </div>
  </template>
  
  <script>

import {DisplayLoad, FetchGet} from '../../js/LoadDisplayMetod.js'
import { PagesSettings } from './PagesSettings';
import DefaultTable from '../DefaultTable.vue';
import Plotly from 'plotly.js-dist'

  export default {
    name: 'TargetDZZ',
    mixins: [PagesSettings],
    components:{
      DefaultTable
    },
    data(){
      return{
        ConstellationJson: [],
        earthSize: 0,
        ShowDefaultTable: false,
        ShowPlotlyContain: false,
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
        KAModellingRoleMode: false
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
              let response = await FetchGet('/api/v1/modelling/data/earth-sat/all') || []
              this.dataTable = await response
              this.dataTable =this.dataTable.sort((a, b) => parseFloat(a.begin) - parseFloat(b.begin))
              
              for (let index = 0; index < this.dataTable.length; index++) {
                this.dataTable[index].begin = this.CreateDateTime(this.dataTable[index].begin)
                this.dataTable[index].end = this.CreateDateTime(this.dataTable[index].end)
                
              }
            }
            if(commandId == 5){
              DisplayLoad(true)
              await FetchGet("/api/v1/contact-plan/earth")
              DisplayLoad(false)
            }
            if(commandId == 1){
              DisplayLoad(true)
              await FetchGet('/api/v1/pro42/view/earth')
              DisplayLoad(false)
            }
            if(commandId == 6){
              console.log("Уааа график")
              this.ShowPlotlyContain = true
              let response = await FetchGet('/api/v1/modelling/data/earth-sat/all') || []
              console.log(response)
              let dataGrapf = {
                type: 'bar',
                y: [],
                x: [],
                orientation: 'h',
                base: [],
                text: [],
                marker: {
                  opacity: 0.7,
                  line: {
                    width: 2
                  }
                }
              }
              response.forEach(element => {
                console.log(this.CreateDateTime(element.end - element.begin, 2))
                dataGrapf.y.push(element.earthName)
                dataGrapf.text.push(element.satelliteId)
                dataGrapf.x.push(this.CreateDateTime(element.end - element.begin, 2))
                dataGrapf.base.push(this.CreateDateTime(element.begin, 1))
              });


              Plotly.newPlot("plotlymapContain1", [dataGrapf],
                {
                  title: 'Окна видимости',
                }
              )
            }
        }
    },
    
    async mounted() {
        DisplayLoad(true)


        let result = await FetchGet('/api/v1/earth/get/list') || []
        this.earthSize = result.length || 0

        result = await FetchGet('/api/v1/constellation/get/list') || []
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

        console.log(this.systemStatus)
        if(this.systemStatus.WorkMode in {3:null,4:null}){
          this.KAModellingRoleMode = true
        }
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



#PlotlyDiv{
  width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0px;
    top: 0px;
    background-color: #000000d4;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;

  .ContainerDiv{
    min-width: 90vw;
    margin-top: 100px;
    flex: 1;
    margin-bottom: 20px;
    background-color: #111111c7;
    border: 2px solid #4c4b4b;
    backdrop-filter: blur(10px);
    border-radius: 15px;

    .closebutton{
      display: flex;
      margin: 20px;
      flex-direction: row-reverse;
      button{
        background: none;
        border: none;
        img{
          width: 25px;
        }
      }
    }
  }
  
}
</style>
