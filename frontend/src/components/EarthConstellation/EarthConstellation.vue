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
                    <div>Начальное время расчетов:           <b v-html=" CreateDateTime(systemStatus.startTime)"></b></div>
                    <div>Начало горизонта моделирования:     <b v-html=" CreateDateTime(systemStatus.modelingBegin)"></b></div>
                    <div>Окончание горизонта моделирования:  <b v-html=" CreateDateTime(systemStatus.modelingEnd)"></b></div>
                </div>
                <div>
                    <div><div>НП:</div>
                        <div class="paddl">Статус: {{ systemStatus.earthStatus }}</div>
                        <div class="paddl">Количество: {{ earthSize }}</div>
                    </div>
                    <div><div>ОГ:</div>
                        <div class="paddl">Статус: {{ systemStatus.constellationStatus }}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div class="DataTable">
        <h1>Эксперимент</h1>
        <p>Заявки</p>
      <div class="PanelDefault">
        
        <table class="TableDefault">
          <tr>
            <th>Имя</th><th>Состав</th><th>Контакты</th><th>Связь с НП</th><th>Команды</th>
          </tr>
          <tr
          v-for="data, index in ConstellationJson"
            :key="index"
            :class="!requestApproved ? 'active' :''"
            @change="ChangeParamRequest"
            v-show="!(data.deleted==true)"
          >
            <td>{{data.constellationName}}</td>
            <td>{{data.arbitraryConstructions.length}}</td>
            <td>{{0}}</td>
            <td>{{"есть / нет"}}</td>
            <td class="CommandButtons"> 
                <div @click="CommandWork(data, 1)">C1</div>
                <div @click="CommandWork(data, 2)">C2</div>
                <div @click="CommandWork(data, 3)">C3</div>
                <div @click="CommandWork(data, 4)">C4</div>
                <div @click="CommandWork(data, 5)">C5</div>
                <div @click="CommandWork(data, 6)">C6</div>
            </td>
          </tr>
        </table>
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
      DefaultTable
    },
    data(){
      return{
        ConstellationJson: [],
        earthSize: 0,
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
