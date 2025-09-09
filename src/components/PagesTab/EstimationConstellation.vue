
<template>
    <div class="main_contain RowSection">
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
            <h1 class="TitleText">Оценка орбитального построения ОГ</h1>
          </div>
          
      <div class="ContentDiv">
        
        <div class="Panel LeftPanel">
          <div>Парамертры системы</div>
            <div class="SystemInfo">
                <table><tbody>
                    <tr><td>Начальное время расчетов:</td>
                      <td><DateTime :valueUnix="systemStatus.startTime" :name="'startTime'" @valueSelect="ChangeTimeSystem"/></td>
                    </tr>
                    <tr><td>Начало горизонта моделирования:</td>
                      <td><DateTime :valueUnix="systemStatus.modelingBegin" :name="'modellingBegin'" @valueSelect="ChangeTimeSystem"/></td>
                    </tr>
                    <tr><td>Окончание горизонта моделирования:</td>
                      <td><DateTime :valueUnix="systemStatus.modelingEnd" :name="'modellingEnd'" @valueSelect="ChangeTimeSystem"/></td>
                    </tr>
                    <tr><td>Шаг моделирования:</td><td><input @change="ChangeStepSystem" type="number" min="0" :value="experimentObject.modellingStep"></td></tr>
                    <tr><td>Количество целей:</td><td>{{ purposesJson }}</td></tr>
                    <tr><td>Орбитальная группировка</td><td><SelectDiv  :dataOption="arr" :valueS="valueSS" :id="'0'"  @valueSelect="SelectChange"/></td></tr>
                    <tr><td>Количество КА:</td><td>{{ experimentObject.constellation.satellites.length }}</td></tr>
                  </tbody></table>
            </div>
            <div class="FlexColumn">
              <div><button @click="StartModelling" class="ButtonCommand">Начать эксперимент</button></div>
              <div><button @click="ShowViViewWindow(AllResponse)" v-if="TableViewWindow.length > 0" class="ButtonCommand">Отобразить все результаты</button></div>
              <div><button @click="viewmode = 1" v-if="viewmode == 2 && TableViewWindow.length > 0" class="ButtonCommand">Отобразить таблицу</button></div>
              <div><button @click="viewmode = 2" v-if="viewmode == 1 && TableViewWindow.length > 0" class="ButtonCommand">Отобразить график</button></div>
            </div>
        </div>
        <div class="Panel RightPanel">
          <div>Эксперимент</div>
          
          <div class="TableDefault" v-if="viewmode == 1">
            <table class="TableDefault"><thead>
            <tr>
              <th>Цель</th><th>Колличество окон видимости</th><th>Отображение</th>
            </tr>
           </thead>
                <tbody>
                  <tr 
                    v-for="data,index in TableViewWindow"
                    :key="index"
                    :class="(data.viewcount == 0) ? 'redtrbg' : ''"
                  >
                    <td>{{ data.name }}</td>
                    <td>{{ data.viewcount }}</td>
                    <td><button @click="ShowViViewWindow(data.data)" class="ButtonCommand small">Отобразить таблицу</button></td>
                  </tr>
                </tbody>
              </table>
          </div>  

            <div :style="viewmode == 2? 'display:block;' : 'display: none;'" id="plot_OG" style="height: 70vh;"></div>
        </div>
        
      </div>
  </template>
  
  <script>

import {UnixToDtime} from "../../js/WorkWithDTime.js";
import { PagesSettings } from './PagesSettings';

import Plotly from 'plotly.js-dist'

  export default {
    name: 'EstimationConstellation',
    mixins: [PagesSettings],
    components:{},
    data(){
      return{
        purposesJson: 0,
        ShowDefaultTable: false,
        dataLableName: {},
        dataTable: [],
        arr: [],
        valueSS: {},
        experimentObject: {
          startTime: 0,
          modellingBegin: 0,
          modellingEnd: 0,
          modellingStep: 0,
          constellation: {
            satellites: []
          },
        },
        TableViewWindow:[],
        AllResponse: [],
        viewmode: 2,
      }
    },
    methods: {
        CommandWork(){
              this.dataLableName = [
                {lable: "Цель", nameParam: "goalLabel"},
                {lable: "КА", nameParam: "scLabel"},
                {lable: "Начало", nameParam: "begin"},
                {lable: "Конец", nameParam: "end"},
              ]
        },
        ChangeTimeSystem(data){
          this.experimentObject[data.name] = data.time
        },
        ChangeStepSystem(data){
          this.experimentObject.modellingStep = Number(data.target.value)
        },
        ShowViViewWindow(data){
          this.dataTable = data
          this.ShowDefaultTable = true
        },
        async CreateViewWindow(){
          this.TableViewWindow = []
          let fill = false
          let result = await this.$FetchGet('/api/v1/satrequest/request/get/all') || []

          for (let index = 0; index < this.dataTable.length; index++) {
            const element = this.dataTable[index];
            for (let index_child = 0; index_child < this.TableViewWindow.length; index_child++) {
              const element_child = this.TableViewWindow[index_child];
              if(element_child.name == element.goalLabel)
                {
                  this.TableViewWindow[index_child].viewcount += 1
                  this.TableViewWindow[index_child].data.push(element)
                  fill = true
                  break;
                }
            }
            if (fill == false) {
              this.TableViewWindow.push({name: element.goalLabel, viewcount: 1, data: [element]})
            }
            fill = false
          }
          console.log(this.TableViewWindow, result)
          for (let index = 0; index < result.length; index++) {
            const element = result[index];
            let flag_add = false
            for (let id = 0; id < this.TableViewWindow.length; id++) {
              const e = this.TableViewWindow[id];
              if(element.catalog.goalName == e.name){
                flag_add = true
                break
              }
            }
            if(!flag_add){
              this.TableViewWindow.push({name: element.catalog.goalName, viewcount: 0, data: [{begin: null, end: null, goalLabel: element.catalog.goalName, scLabel: null}]})
            }
          }
        },
        async StartModelling(){
          this.$showLoad(true)
          this.CommandWork()
          let response = await this.$FetchPost("/api/v1/pro42/view/request", this.experimentObject) || []
          
          try {
            for (let index = 0; index < response.length; index++) {
              response[index].end = this.CreateDateTime(response[index].end)
              response[index].begin = this.CreateDateTime(response[index].begin)
            }
          } catch (error) {
            console.log(error)
          }
          this.dataTable = await response
          this.AllResponse = await response
          this.CreateViewWindow()

          const divel = document.getElementById("plot_OG")
          let y_Axis = []
          let x_Axis = []
          let base = []
          let text = []
          for (let index = 0; index < response.length; index++) {
            const element = response[index];
            y_Axis.push(element.goalLabel)
            x_Axis.push(this.CreateDateTime((Date.parse(element.end) - Date.parse(element.begin))/1000  - 10800))
            base.push(element.begin)
            text.push(UnixToDtime(Date.parse(element.begin)/1000).time+" - "+UnixToDtime(Date.parse(element.end)/1000).time)
          }
          console.log(y_Axis, x_Axis, base)
          Plotly.newPlot(divel, [{
            type: 'bar',
            y: y_Axis,
            x: x_Axis,
            orientation: 'h',
            base: base,
            text: text
          },],
          {
            title: 'Окна видимости',
          }
        )

          this.$showLoad(false)

        },
        SelectChange(target){
          this.experimentObject.constellation = target.value
        },
    },
    
    async mounted() {
        this.$showLoad(true)
        let result = await this.$FetchGet('/api/v1/satrequest/request/get/all') || []
        this.purposesJson = result.length || 0
        let OGList = await this.$OGList()
        for (let i = 0; i < OGList.length; i++) {
          const element = OGList[i];
          this.arr.push({value: element, lable: element.constellationName })
        }
        this.valueSS = {lable: this.arr[0].lable, value: this.arr[0].value}

        this.experimentObject.constellation = this.arr[0].value
        this.experimentObject.startTime = this.systemStatus.startTime
        this.experimentObject.modellingEnd = this.systemStatus.modelingEnd
        this.experimentObject.modellingBegin = this.systemStatus.modelingBegin
        this.experimentObject.modellingStep = this.systemStatus.step
        console.log(this.systemStatus)
        this.$showLoad(false)


    }
  }
  </script>

<style lang="scss" scoped>

td{
  text-align: left;

}
th{
  border-bottom: 2px solid white;

}


input{
  padding: 10px 10px 10px 0px;
    text-align: left;
    border: none;
    background: none;
    color: white;
}
.redtrbg{
  background-color: #88010162;
}
</style>
