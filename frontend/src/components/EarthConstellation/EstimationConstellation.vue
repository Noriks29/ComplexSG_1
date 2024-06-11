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
                <table>
                    <tr><td>Начальное время расчетов:</td>           <td v-html=" CreateDateTime(systemStatus.startTime)"></td></tr>
                    <tr><td>Начало горизонта моделирования:</td>    <td v-html=" CreateDateTime(systemStatus.modelingBegin)"></td></tr>
                    <tr><td>Окончание горизонта моделирования:</td>  <td v-html=" CreateDateTime(systemStatus.modelingEnd)"></td></tr>
                    <tr><td>Шаг моделирования:</td><td>{{ experimentObject.modellingStep }}</td></tr>
                    <tr><td>Количество целей:</td><td>{{ purposesJson }}</td></tr>
                    <tr><td>Орбитальная группировка</td><td><SelectDiv  :dataOption="arr" :valueS="valueSS" :id="'0'"  @valueSelect="SelectChange"/></td></tr>
                    <tr><td>Количество КА:</td><td>{{ experimentObject.constellation.arbitraryConstructions.length }}</td></tr>
                  </table>
            </div>
        </div>

    </div>
    <div class="DataTable">
        <h1>Эксперимент</h1>
      <div class="PanelDefault">
        <button @click="StartModelling">Начать эксперимент</button>
        <button @click="ShowViViewWindow(AllResponse)">Отобразить таблицу</button>
        <table class="TableDefault">
          <tr>
            <th>Цель</th><th>Колличество окон видимости</th><th></th>
          </tr>
          <tr 
            v-for="data,index in TableViewWindow"
            :key="index"
          >
          <td>{{ data.name }}</td>
          <td>{{ data.viewcount }}</td>
          <td><button @click="ShowViViewWindow(data.data)">Отобразить таблицу</button></td>
        </tr>
        </table>
        </div>
    </div>
    </div>
  </template>
  
  <script>

import {DisplayLoad, FetchGet, FetchPost} from '../../js/LoadDisplayMetod.js'
import {UnixToDtime} from "../../js/WorkWithDTime.js";
import MainStyle from '../../style/component.scss'
import DefaultTable from '../DefaultTable.vue';
import SelectDiv from '../SelectDiv.vue';

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
      DefaultTable,
      SelectDiv
    },
    data(){
      return{
        ConstellationJson: [],
        purposesJson: 0,
        numberVisibilityWindows: 0,
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
            arbitraryConstructions: []
          },
        },
        TableViewWindow:[],
        AllResponse:[],
      }
    },
    methods: {
        CommandWork(){
              this.dataLableName = [
                {lable: "Отправитель", nameParam: "goalLabel"},
                {lable: "Получатель", nameParam: "scLabel"},
                {lable: "Начало", nameParam: "begin"},
                {lable: "Конец", nameParam: "end"},
              ]
        },
        ShowViViewWindow(data){
          this.dataTable = data
          this.ShowDefaultTable = true
        },
        CreateViewWindow(){
          this.TableViewWindow = []
          let fill = false
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
          console.log(this.TableViewWindow)
        },
        async StartModelling(){
          this.CommandWork()
          console.log(this.experimentObject, JSON.stringify(this.experimentObject))
          let response = await FetchPost("/api/v1/modelling/view/request", this.experimentObject)
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
        },
        CreateDateTime(time){
          let Dtime = UnixToDtime(time)
          return Dtime.date + " " + Dtime.time
        },
        SelectChange(target){
          this.experimentObject.constellation = target.value
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
        this.ConstellationJson = await result
        for (let i = 0; i < this.ConstellationJson.length; i++) {
          const element = this.ConstellationJson[i];
          this.arr.push({value: element, lable: element.constellationName })
        }
        this.valueSS = {lable: this.arr[0].lable, value: this.arr[0].value}

        this.experimentObject.constellation = this.arr[0].value
        this.experimentObject.startTime = this.systemStatus.startTime
        this.experimentObject.modellingEnd = this.systemStatus.modelingEnd
        this.experimentObject.modellingBegin = this.systemStatus.modelingBegin
        this.experimentObject.modellingStep = this.systemStatus.step
        /*
        "startTime": 1716595200,
    "modellingStart": 1716615754,
    "modellingEnd": 1716615754,
    "modellingStep": 2,*/
        console.log(this.systemStatus)
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
