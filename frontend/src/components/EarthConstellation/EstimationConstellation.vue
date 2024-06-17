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
        <div class="PanelDefault" style="width: auto;">
            <div>Парамертры системы</div>
            <div class="SystemInfo">
                <table>
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
                  </table>
            </div>
        </div>

    </div>
    <div class="DataTable">
        <h1>Эксперимент</h1>
      <div class="PanelDefault Width80">
        <button @click="StartModelling" class="ButtonCommand">Начать эксперимент</button>
        <button @click="ShowViViewWindow(AllResponse)" class="ButtonCommand">Отобразить все результаты</button>
        <div class="scroll-table">
          <table class="TableDefault"><thead>
          <tr>
            <th>Цель</th><th>Колличество окон видимости</th><th>Отображение</th>
          </tr>
        </thead>
      </table>
      <div class="scroll-table-body">
      <table class="TableDefault">
        <tbody>
          <tr 
            v-for="data,index in TableViewWindow"
            :key="index"
          >
          <td>{{ data.name }}</td>
          <td>{{ data.viewcount }}</td>
          <td><button @click="ShowViViewWindow(data.data)" class="ButtonCommand small">Отобразить таблицу</button></td>
        </tr>
      </tbody>
        </table>
        </div></div>
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
import DateTime from '../DateTime.vue';

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
      SelectDiv,
      DateTime
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
            satellites: []
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
        console.log(this.ConstellationJson)
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
.Width80{
  width: 80%;
}
.PanelDefault{
    
    .SystemInfo{
        display: inline-flex;
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
.CommandButtons{
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    div{
        padding: 5px;
    }
}
input{
  padding: 10px;
    text-align: center;
    border: none;
    background: none;
    font-size: 18px;
    color: white;
}
</style>
