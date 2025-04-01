<template>
    <transition name="translate" mode="out-in" v-if="activeComponent != ''">
      <div class="ComponentSelect">
        <component :is="activeComponent" :FillingDataStatus="FillingDataStatuss" :modellingStatus="ExperimentStatus" @updateParentComponent="ChangeComponents" :systemStatus="system" ></component> 
      </div>
    </transition> 
    
    <div class="SectionMenu" :class="system.typeWorkplace == -1 ? 'hide' : 'show'">
      <div v-if="system.typeWorkplace == -1" class="ModellingDiv"></div>
      <transition name="ComponentModelling" mode="out-in" :class="system.typeWorkplace == -1 ? 'hide' : 'show'">
        <div class="ModellingDiv">
          <component :is="ComponentModellingList[system.typeWorkplace]" :systemStatus="system" :reload="reload" :ExperimentStatus="ExperimentStatus" @ChangeExperimentStatus="ChangeExperimentStatus"></component> 
        </div>
      </transition> 
      <div class="FlexMenuSection">
        <div class="ButtonSection first">
          <h1>КС</h1>
          <div class="ButtonList">
            <button class="active" @click="SelectComponent('NP')"><div :class="system.earthStatus ? 'approved' : 'Notapproved'"></div>НП</button>
            <button class="active" @click="SelectComponent('OG')"><div :class="system.constellationStatus ? 'approved' : 'Notapproved'"></div>КА и ОГ</button>
            <button :class="!ExperimentStatus > 0 ? 'active' : ''" @click="SelectComponent('TypeKA')">Модели КА</button>
          </div>   
        </div>
        <div class="ButtonSection second">
          <h1>Связь</h1>
          <div class="ButtonList">
            <button :class="FillingDataStatus && !ExperimentStatus > 0 ? 'active' : ''" @click="SelectComponent('EarthConstellation')"><div :class="system.earthSatStatus ? 'approved' : 'Notapproved'"></div>КА - НП</button>
            <button v-if="system.typeWorkplace in {4:null, 3:null}" :class="FillingDataStatus && !ExperimentStatus > 0 ? 'active' : ''"  @click="SelectComponent('LeaderConstellationConstellation')"><div :class="system.satSatStatus ? 'approved' : 'Notapproved'"></div>КА - КА Лидеры</button>
            <button v-else-if="!(system.typeWorkplace in {1:null})" :class="FillingDataStatus && !ExperimentStatus > 0 ? 'active' : ''"  @click="SelectComponent('LeaderConstellationConstellation')"><div :class="system.satSatStatus ? 'approved' : 'Notapproved'"></div>КА - КА</button>
          </div>
        </div>
        <div class="ButtonSection third" >
          <h1>Исходные данные</h1>
          <div class="ButtonList">
            <button v-if="!(system.typeWorkplace in {5:null})" :class="FillingDataStatus && !ExperimentStatus > 0 ? 'active' : ''" @click="SelectComponent('TargetDZZ')">Заявки</button>
            <button :class="!ExperimentStatus > 0 ? 'active' : ''" @click="SelectComponent('SystemWindow')">Система</button>
          </div>
        </div>
        <div class="ButtonSection fourth" v-if:="!(system.typeWorkplace in {2:null,4:null})">
          <h1>Инструменты</h1>
          <div class="ButtonList">
            <button :class="FillingDataStatus > 0 ? 'active' : ''" @click="SelectComponent('TargetRoad')">Обход целей</button>
            <button :class="FillingDataStatus > 0 ? 'active' : ''" @click="SelectComponent('EstimationConstellation')">Видимость целей (Оценка ОГ)</button>
          </div>
        </div>
      </div>
      <div class="ContainerSystem">
          <div class="PanelSystemData" :class="system.typeWorkplace == -1 ? 'hide' : 'show'">
            <button @click="SelectComponent('LogEventList')" class="ButtonCommand">Логи событий</button>
            <button @click="SaveWorkplace" class="ButtonCommand">Сохранить копию данных</button>
            <label class="input-file">
              <input type="file" name="file" id="file-Json" @change="LoadFile" accept="application/json" enctype="multipart/form-data">		
              <span>Открыть файл</span>
            </label>
        </div>
      </div>
    </div>
</template>

<script>
import { saveAs } from 'file-saver';
import {FetchGet, FetchPostFile, DisplayLoad} from '../js/LoadDisplayMetod'
import { NPList, OGList, SystemObject } from '@/js/GlobalData';



import KA1 from './KA/KA1.vue';
import KARealTime from "./KA/KARealTime.vue";
import KAControl_In from './KA/KAControl_In.vue'
import KAControl_Out from './KA/KAControl_Out.vue'
import KAGordeev from "./KA/KAGordeev.vue";

import NP from "./PagesTab/NP.vue";
import OG from './PagesTab/OG.vue'
import TypeKA from './PagesTab/TypeKA.vue';
import LogEventList from "./LogEventList/LogEventList.vue";
import SystemWindow from './PagesTab/SystemWindow.vue';
import TargetDZZ from './PagesTab/TargetDZZ.vue'
import EarthConstellation from './PagesTab/EarthConstellation.vue'
import EstimationConstellation from './PagesTab/EstimationConstellation.vue'
import TargetRoad from './PagesTab/TargetRoad.vue';
import ConstellationConstellation from './PagesTab/ConstellationConstellation.vue';
import LeaderConstellationConstellation from './PagesTab/LeaderConstellationConstellation.vue';

export default {
  name: 'TemplateComponent',
  components: {
    NP,
    OG,
    TypeKA,
    SystemWindow,
    TargetDZZ,
    EarthConstellation,
    EstimationConstellation,
    TargetRoad,
    ConstellationConstellation,
    LeaderConstellationConstellation,
    LogEventList,

    KA1,
    KARealTime,
    KAControl_In,
    KAControl_Out,
    KAGordeev
  },
  data(){
      return{
        activeComponent: "",
        FillingDataStatus: 0,
        system: {typeWorkplace: -1},
        reload: 0,
        ExperimentStatus: false,
        ComponentModellingList: [null,"KA1","KA1","KAControl_In","KAControl_Out","KARealTime","KAGordeev",null]
    }
  },
  methods: {
    SelectComponent(nameComponent) {
        this.activeComponent = nameComponent
      },
      ChangeExperimentStatus(status){
        this.ExperimentStatus = status.status
        this.$emit('ChangeExperimentStatus', this.ExperimentStatus)
        this.reload++
      },
      ChangeComponents() {
        this.activeComponent = ''
        this.system = SystemObject
        this.ChengeFillingDataStatus()
        if(!this.ExperimentStatus){
          this.reload++
        }
      },
      async SaveWorkplace(){
        DisplayLoad(true)
        let dataLoad = {}
        dataLoad.modelSat = await FetchGet('/api/v1/modelsat/all')
        let result = NPList
        for (let index = 0; index < result.length; index++) {
          let new_data = result[index];
          new_data.id = undefined
          new_data.idNode = undefined
          result[index] = new_data
        }
        dataLoad.earth = result
        result = await FetchGet('/api/v1/system/get')
        result.systemId = undefined
        dataLoad.system = result

        result = OGList
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          element.id = undefined
          for (let jindex = 0; jindex < element.satellites.length; jindex++) {
            const j_element = element.satellites[jindex];
            j_element.idNode = undefined
            j_element.satelliteId = undefined
            element.satellites[jindex] = j_element
          }
          result[index] = element 
        }
        dataLoad.constellation = result

        result = await FetchGet('/api/v1/satrequest/catalog/get/all') || []
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          element.goalId = undefined
          result[index] = element
        }
        dataLoad.catalog = result

        dataLoad.satRequestData = await FetchGet('/api/v1/satrequest/data/get/all') || []

        result = await FetchGet('/api/v1/satrequest/request/get/all') || []
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          element.orderId = undefined
          element.requestId = undefined
          element.deleted = undefined
          result[index] = element
        }
        dataLoad.request = result

        var fileName = 'myData.json';
        var fileToSave = new Blob([JSON.stringify(dataLoad, null, 2)], {
            type: 'application/json'
        });
        saveAs(fileToSave, fileName);
        DisplayLoad(false)
      },
      async LoadFile(data){
        if (data.target.files[0]) {
          var file = data.target.files[0];
          const formData = new FormData();
          formData.append('file', file);
          await FetchPostFile("/api/v1/workplace/upload/file", formData)
        }
      },
      ChengeFillingDataStatus(){
      if(this.system.constellationStatus && this.system.earthStatus){
        this.FillingDataStatus = 1
      }
      else{
        this.FillingDataStatus = 0
      }
    },
    },
    
    created(){
      this.system = SystemObject
      this.ChengeFillingDataStatus()
    },
}

</script>

<style lang="scss" scoped>

@keyframes slideInFromBottom {
  0% {
    transform: translateY(120%);
  }
  100% {
    transform: translateY(0%);
  }
}
@keyframes slideInFromTop {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0%);
  }
}

.SectionMenu{
    width: 98%;
    height: 97%;
    display: flex;
    flex-direction: column;
    margin: 1% 1%;
    flex-wrap: nowrap;
    align-items: center;
    overflow: auto;
    position: absolute;
    top: 0px;

    .ContainerSystem{
      height: 6vh;
      overflow: hidden;
    }

    &.hide{
      .ButtonSection{
        transform: translateY(150%);
        animation: 0.5s ease-out reverse 0s 1 slideInFromBottom;
      }
      .PanelSystemData{
        transform: translateY(120%);
        animation: 1.3s ease-out reverse 0s 1 slideInFromBottom;
      }
    }
    &.show{
      .ModellingDiv{
        animation: 1s ease-out 0s 1 slideInFromTop;
      }
      .ButtonSection{
        animation: 0.5s ease-out 0s 1 slideInFromBottom;
        &.hide{
          position: relative;
          top: 150%;
        }
      }
      .PanelSystemData {
        animation: 1.3s ease-out  0s 1 slideInFromBottom;
      }
    }
      .ModellingDiv{
      width: 100%;
      height: 60%;
      overflow: auto;
    }

    .FlexMenuSection{
      display: flex;
      width: 99%;
      height: 33%;
      flex-direction: row;
      align-items: flex-start;
      
      overflow: hidden;
    }

    .ButtonSection{
      background-color: var(--background-Panel);
      box-shadow: -4px 3px 1px var(--box-shadow-Panel);
      border: 2px solid var(--border-Panel);
      height: 93%;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      padding: 0px 10px;
      margin: 10px;
      transition: all 0.5s ease-out;
      position: relative;
      align-items: center;
      flex: 1;
      overflow: hidden;

      &.second, &.third, &.fourth, &.first{
        .ButtonList{
          flex-direction: column;
        }
      }

      h1{
        margin: 10px;
        font-size: 25px;
      }
      .ButtonList{
        width: 95%;
        flex: 1;
        display: flex;
        justify-content: space-evenly;
        button{
          margin: 5px;
        }
      }

      button{
        border: none;
        color: var(--color-Main);
        flex: 1;
        
        font-size: 25px;
        overflow: hidden;
        text-decoration: none;
        position: relative;

        border-top: 1px solid var(--border-button);
        border-right: 1px solid var(--border-button);
        background-color: rgba(29, 29, 29, 0.4);
        transform: translate(-1px, 1px);
        pointer-events: none;
        transition: all 0.5s ease-out;

        &.active{
          pointer-events: all;
          transform: translate(0px, 0px);
          background-color: var(--background-Button1);
          &:hover{
            background-color: var(--background-Button2);
            border: 2px solid var(--border-button);
            transform: translate(4px, -4px);
            box-shadow: -4px 4px 2px var(--box-shadow-button);
          }
          &:active{
            background-color: var(--background-Button3);
            border: 2px solid var(--border-button2);
            transform: translate(0px, 1px);
            box-shadow: 0px 0px 11px 2px var(--box-shadow-button);
          }
          &:before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: var(--backgroung-animatePanel);
            transition: all 350ms;
          }
          &:hover:before {
            left: 100%;
          }
        }
        &.hideElement{
          border: none;
          pointer-events: none;
          background: none;
          transform: translate(0px, 1000px);
        }
        div{
          position: absolute;
          width: 10px;
          height: 10px;
          top: 20%;
          left: 10px;
          border-radius: 20px;
          &.approved{
            background-color: rgb(0, 139, 0);
            box-shadow: 0px 0px 5px rgb(11, 167, 11);
          }
          &.Notapproved{
            background-color: red;
            box-shadow: 0px 0px 5px #fe1a1a;
          }
        }
      }

      &:hover{
        &.first {
            box-shadow: -4px 3px 3px rgba(12, 12, 73, 0.7);
        }
        &.second {
            box-shadow: -4px 3px 3px rgba(35, 12, 73, 0.7);
        }
        &.third {
            box-shadow: -4px 3px 3px rgba(12, 54, 73, 0.7);
        }
        &.fourth {
            box-shadow: -4px 3px 3px rgba(73, 12, 12, 0.7);
        }
        border: 2px solid rgba(71, 71, 71, 0.25);
      }
    }
  }

  .ComponentSelect{
    position: absolute;
    top: 0px;
    width: 100vw;
    height: 100vh;
    background-color: var(--background-Main);
    z-index: 5;
    overflow-x: hidden;
  }
</style>
