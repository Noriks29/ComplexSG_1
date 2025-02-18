<template>
    <transition name="translate" mode="out-in" v-if="activeComponent != ''">
      <div class="ComponentSelect">
        <component :is="activeComponent" :ActiveComponent="ActiveComponents" :modellingStatus="ExperimentStatus" @updateParentComponent="ChangeComponents" :systemStatus="systemStatus" @ChangeSystemStatus="ChangeSystemStatus"></component> 
      </div>
    </transition> 
    <div class="SectionMenu" :class="systemStatus.WorkMode == -1 ? 'hide' : 'show'">
      <div v-if="systemStatus.WorkMode == -1" class="ModellingDiv"></div>
      <div v-if="systemStatus.WorkMode == 6" class="ModellingDiv">
        <div class="ContentDiv">
          <button class="ButtonCommand" @click="SavePavlov">Получить балистику</button><a id="downloadButtonPavlov" href=""></a>
        </div>
      </div>
      <div v-if="systemStatus.WorkMode == 1" class="ModellingDiv">
        <KA1 :systemStatus="systemStatus" :reload="reload" :ExperimentStatus="ExperimentStatus" @ChangeExperimentStatus="ChangeExperimentStatus"/>
      </div>
      <div v-if="systemStatus.WorkMode == 2" class="ModellingDiv">
        <KA2 :systemStatus="systemStatus" :reload="reload" :ExperimentStatus="ExperimentStatus" @ChangeExperimentStatus="ChangeExperimentStatus"/>
      </div>
      <div v-if="systemStatus.WorkMode == 3" class="ModellingDiv">
        <KAControl_In :systemStatus="systemStatus" :reload="reload" :ExperimentStatus="ExperimentStatus" @ChangeExperimentStatus="ChangeExperimentStatus"/>
      </div>
      <div v-if="systemStatus.WorkMode == 4" class="ModellingDiv">
        <KAControl_Out :systemStatus="systemStatus" :reload="reload" :ExperimentStatus="ExperimentStatus" @ChangeExperimentStatus="ChangeExperimentStatus"/>
      </div>
      <div v-if="systemStatus.WorkMode == 5" class="ModellingDiv">
        <KA4 :systemStatus="systemStatus" :reload="reload" :ExperimentStatus="ExperimentStatus" @ChangeExperimentStatus="ChangeExperimentStatus"/>
      </div>
      <div v-if="systemStatus.WorkMode == 10" class="ModellingDiv">
        <KA3 :systemStatus="systemStatus" :reload="reload" :ExperimentStatus="ExperimentStatus" @ChangeExperimentStatus="ChangeExperimentStatus"/>
      </div>
      
      <div class="FlexMenuSection">
        <div class="ButtonSection first">
          <h1>КС</h1>
          <div class="ButtonList">
            <button class="active" @click="SelectComponent('NP')"><div :class="systemStatus.earthStatus ? 'approved' : 'Notapproved'"></div>НП</button>
            <button class="active" @click="SelectComponent('OG')"><div :class="systemStatus.constellationStatus ? 'approved' : 'Notapproved'"></div>КА и ОГ</button>
            <button :class="!ExperimentStatus > 0 ? 'active' : ''" @click="SelectComponent('TypeKA')">Модели КА</button>
          </div>   
        </div>
        <div class="ButtonSection second"  :class="systemStatus.WorkMode in {6:null} ? 'hide': ''">
          <h1>Связь</h1>
          <div class="ButtonList">
            <button :class="ActiveComponent && !ExperimentStatus > 0 ? 'active' : ''" @click="SelectComponent('EarthConstellation')"><div :class="systemStatus.earthSatStatus ? 'approved' : 'Notapproved'"></div>КА - НП</button>
            <button :class="systemStatus.WorkMode in {2:null,3:null,4:null}? (ActiveComponent && !ExperimentStatus > 0 ? 'active' : ''):'hideElement'"  @click="SelectComponent('ConstellationConstellation')"><div :class="systemStatus.satSatStatus ? 'approved' : 'Notapproved'"></div>КА - КА</button>
          </div>
        </div>
        <div class="ButtonSection third" >
          <h1>Исходные данные</h1>
          <div class="ButtonList">
            <button :class="systemStatus.WorkMode in {1:null,2:null,3:null,4:null}? (ActiveComponent && !ExperimentStatus > 0 ? 'active' : ''):'hideElement'" @click="SelectComponent('TargetDZZ')">Заявки</button>
            <button :class="!ExperimentStatus > 0 ? 'active' : ''" @click="SelectComponent('SystemWindow')">Система</button>
          </div>
        </div>
        <div class="ButtonSection fourth" :class="systemStatus.WorkMode in {2:null,4:null,6:null} ? 'hide': ''">
          <h1>Инструменты</h1>
          <div class="ButtonList">
            <button :class="ActiveComponent > 0 ? 'active' : ''" @click="SelectComponent('TargetRoad')">Обход целей</button>
            <button :class="ActiveComponent > 0 ? 'active' : ''" @click="SelectComponent('EstimationConstellation')">Видимость целей (Оценка ОГ)</button>
          </div>
        </div>
      </div>
      <div class="ContainerSystem">
          <div class="PanelSystemData" :class="systemStatus.WorkMode == -1 ? 'hide' : 'show'">
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
import { adress  } from "../js/config_server";
import { saveAs } from 'file-saver';
import {FetchGet, FetchPostFile, DisplayLoad} from '../js/LoadDisplayMetod'
import NP from "./NP/NP.vue";
import OG from './OG/OG.vue'
import TypeKA from './TypeKA/TypeKA.vue';
import LogEventList from "./LogEventList/LogEventList.vue";
import KA1 from './KA/KA1.vue';

import KA2 from './KA/KA2.vue';
import KA3 from './KA3/KA3.vue';
import KA4 from './KA4/KA2.vue';

import KAControl_In from './KAControl/KAControl_In.vue'
import KAControl_Out from './KAControl/KAControl_Out.vue'

import SystemWindow from './System/SystemWindow.vue';
import TargetDZZ from './TargetDZZ/TargetDZZ.vue'
import EarthConstellation from './EarthConstellation/EarthConstellation.vue'
import EstimationConstellation from './EarthConstellation/EstimationConstellation.vue'
import TargetRoad from './TargetRoad/TargetRoad.vue';
import ConstellationConstellation from './EarthConstellation/ConstellationConstellation.vue';

export default {
  name: 'TemplateComponent',
  props:{
    systemStatus:{
          type: Object
        },
    ActiveComponent:{
          type: Number
        },
    
  },
  components: {
    NP,
    OG,
    TypeKA,
    KA1,
    KA2,
    KA3,
    KA4,
    SystemWindow,
    TargetDZZ,
    EarthConstellation,
    EstimationConstellation,
    TargetRoad,
    ConstellationConstellation,
    LogEventList,

    KAControl_In,
    KAControl_Out
  },
  data(){
      return{
        button_mode: "standart",
        activeComponent: "",
        reload: 0,
        ExperimentStatus: false
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
      async SavePavlov(){
        let AcsessKey = localStorage.data
        const el = document.getElementById("downloadButtonPavlov")
        el.href = 'http://'+adress+"/api/v1/modelling/ballistic?accessKey="+AcsessKey
        el.click()
      },
      ChangeComponents() {
        this.activeComponent = ''
        if(!this.ExperimentStatus){
          this.reload++
        }
      },
      ChangeSystemStatus(status){
        this.$emit('ChangeSystemStatus', status)
      },
      async SaveWorkplace(){
        DisplayLoad(true)
        let dataLoad = {}
        let result = await FetchGet('/api/v1/modelsat/all')
        dataLoad.modelSat = result
        result = await FetchGet('/api/v1/earth/get/list') || []
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

      
        result = await FetchGet('/api/v1/constellation/get/list') || []
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

        result = await FetchGet('/api/v1/satrequest/data/get/all') || []
        dataLoad.satRequestData = result

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
      }
    },
  mounted(){
    /*
    if (localStorage.nameUser == "pavlov") {
      this.button_mode = "pavlov"
    }*/
  }
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
