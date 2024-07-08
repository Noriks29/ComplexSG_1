<template>
    <div class="main_contain">
          <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false"/>
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
          
    <div class="ContentDiv">
        <h1 class="TitleText">Моделирование КА</h1>
        <div class="Panel">
          <table  style="border-bottom: 1px solid white;">
              <tr><td>Начальное время расчетов:</td><td v-html="CreateDateTime(systemStatus.startTime)"></td></tr>
              <tr><td>Начало горизонта моделирования:</td><td v-html="CreateDateTime(systemStatus.modelingBegin)"></td></tr>
              <tr><td>Окончание горизонта моделирования:</td><td v-html="CreateDateTime(systemStatus.modelingEnd)"></td></tr>
          </table>
          <p>Цели</p>
          <table style="width: 100%;">
            <tr
                v-for="data, index in purposesJson"
                :key="index"
            >
                <td> {{ index }}</td>
                <td> {{ data.catalog.goalName }}</td>
                <td> {{ data.catalog.lat }}</td>
                <td> {{ data.catalog.lon }}</td>
                <td> {{ data.catalog.alt }}</td>
            </tr>
          </table>
        </div>
        <div class="Panel MaxWidth">
            <div class="flexrow">
            <button class="ButtonCommand">Найти маршруты</button>
            <div>Маршрут 1 из N</div>
            <button class="ButtonCommand">Показать на карте</button>
        </div>
        </div>

    </div>

    </div>
  </template>
  
  <script>

import {DisplayLoad, FetchGet, FetchPost} from '../../js/LoadDisplayMetod.js'
import {UnixToDtime} from "../../js/WorkWithDTime.js";
import MainStyle from '../../style/component.scss'
import DefaultTable from '../DefaultTable.vue';

  export default {
    name: 'TargetRoad',
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
        this.purposesJson = result
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
.flexrow{
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: nowrap;
}
</style>