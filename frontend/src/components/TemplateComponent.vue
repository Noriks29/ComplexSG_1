<template>
  <div class="SectionMenu">
      <div class="HeadersSction">
        <div class="PanelMenu">
          <SystemWindow :modellingStatus="false" @updateParentComponent="ChangeComponents" :systemStatus="system" />
        </div>
        <transition mode="out-in">
          <div class="ModellingDiv PanelMenu">
            моделирование
            <!--<component :is="ComponentModellingList[system.typeWorkplace]" :systemStatus="system" :ExperimentStatus="false"></component> --> 
            <!--<component :is="ComponentModellingList[system.typeWorkplace]" :systemStatus="system" :reload="reload" :ExperimentStatus="ExperimentStatus" @ChangeExperimentStatus="ChangeExperimentStatus"></component> -->
          </div>
        </transition> 
      </div>
      <div class="FooterSection">
        <div class="workpage">
          <transition name="translate" mode="out-in" v-if="activeComponent != ''">
            <div class="ComponentSelect">
              <component :is="activeComponent" :modellingStatus="false" @updateParentComponent="ChangeComponents" :systemStatus="system" ></component> 
            </div>
          </transition>
        </div>
        <div class="FlexMenuSection">
        <div class="ButtonSection">
          <div class="ButtonList PanelMenu">
            <button class="ButtonCommand GetData"  @click="SelectComponent('LogEventList')"><span>Логи событий</span></button>
            <button class="ButtonCommand GetData"  @click="SaveWorkplace"><span>Сохранить проект</span></button>
            <label class="input-file">
              <input type="file" name="file" id="file-Json" @change="LoadFile" accept="application/json" enctype="multipart/form-data">		
              <span>Открыть файл</span>
            </label>
          </div>
        </div>
        <div class="ButtonSection">
            <div class="ButtonList">
              <h1>КС</h1>
              <button class="buttonType1" :class="activeComponent=='NP'? 'select':''" @click="SelectComponent('NP')"><div :class="system.earthStatus ? 'approved' : 'Notapproved'"></div><span>НП</span></button>
              <button class="buttonType1" :class="activeComponent=='OG'? 'select':''" @click="SelectComponent('OG')"><div :class="system.constellationStatus ? 'approved' : 'Notapproved'"></div><span>КА и ОГ</span></button>
              <button class="buttonType1" :class="(activeComponent=='TypeKA'? 'select':'')" @click="SelectComponent('TypeKA')"><span>Модели КА</span></button>
            </div>   
          </div>
          <div class="ButtonSection">
            <div class="ButtonList">
              <h1>Исходные данные</h1>
              <button class="buttonType1" :class="activeComponent=='TargetDZZ'? 'select':''" @click="SelectComponent('TargetDZZ')"><span>Заявки</span></button>
            </div>
          </div>
          <div class="ButtonSection">
            <div class="ButtonList">
              <h1>Связь</h1>
              <button class="buttonType1" :class="(activeComponent=='EarthConstellation'? 'select':'')" @click="SelectComponent('EarthConstellation')"><span>КА - НП</span></button>
              <button class="buttonType1" v-if="system.typeWorkplace in {4:null, 3:null}" :class="(activeComponent=='LeaderConstellationConstellation'? 'select':'')"  @click="SelectComponent('LeaderConstellationConstellation')"><span>КА - КА Лидеры</span></button>
              <button class="buttonType1" v-else-if="!(system.typeWorkplace in {1:null})" :class="(activeComponent=='LeaderConstellationConstellation'? 'select':'')"  @click="SelectComponent('LeaderConstellationConstellation')"><span>КА - КА</span></button>
            </div>
          </div> 
          <div class="ButtonSection" v-if="!(system.typeWorkplace in {2:null,4:null})">
            <div class="ButtonList">
              <h1>Инструменты</h1>
              <button class="buttonType1" :class="(activeComponent=='TargetRoad'? 'select':'')" @click="SelectComponent('TargetRoad')">Обход целей</button>
              <button class="buttonType1" :class="(activeComponent=='EstimationConstellation'? 'select':'')" @click="SelectComponent('EstimationConstellation')">Видимость целей</button>
            </div>
          </div>       
        </div>
      </div>
    </div>
</template>

<script>
//import { saveAs } from 'file-saver';



import KA1 from './KA/KA1.vue';
import KARealTime from "./KA/KARealTime.vue";

import NP from "./PagesTab/NP.vue";
import OG from './PagesTab/OG.vue'
import TypeKA from './PagesTab/TypeKA.vue';
import LogEventList from "./LogEventList/LogEventList.vue";
import SystemWindow from './PagesTab/SystemWindow.vue';
import TargetDZZ from './PagesTab/TargetDZZ.vue'
import EarthConstellation from './PagesTab/EarthConstellation.vue'
import EstimationConstellation from './PagesTab/EstimationConstellation.vue'
import TargetRoad from './PagesTab/TargetRoad.vue';
import LeaderConstellationConstellation from './PagesTab/LeaderConstellationConstellation.vue';

import MapContainer from './MapContainer.vue';


export default {
  name: 'TemplateComponent',
  //emits: ['changeExperimentStatus'],
  components: {
    NP,
    OG,
    TypeKA,
    SystemWindow,
    TargetDZZ,
    EarthConstellation,
    EstimationConstellation,
    TargetRoad,
    LeaderConstellationConstellation,
    LogEventList,

    KA1,
    KARealTime,
    MapContainer
  },
  data(){
      return{
        activeComponent: "MapContainer",
        system: {typeWorkplace: -1},
        ComponentModellingList: [null,"KA1","KA1","KA1","KA1","KARealTime",null,null]
    }
  },
  methods: {
    SelectComponent(nameComponent) {
        this.activeComponent = nameComponent
      },
      async ChangeComponents() {
        this.system = await this.$SystemObject()
        this.activeComponent = 'MapContainer'
      },
      async SaveWorkplace(){
        /*
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
        DisplayLoad(false)*/
      },
      async LoadFile(data){
        console.log(data)
        /*
        if (data.target.files[0]) {
          var file = data.target.files[0];
          const formData = new FormData();
          formData.append('file', file);
          await FetchPostFile("/api/v1/workplace/upload/file", formData)
        }*/
      },
    },
    
    created(){
      this.ChangeComponents()
    },
}

</script>

<style lang="scss" scoped>
.PanelMenu{
  margin-left: 0px !important;
  .GetData{
    margin-right: 5px !important;
  }
}
.SectionMenu{
    width: 99%;
    display: flex;
    flex-direction: column;
    margin: 0% 0% 0% 1%;
    flex-wrap: nowrap;
    overflow: auto;
    position: absolute;
    align-items: normal;
    top: 40px;
    height: calc(100% - 40px);

    .HeadersSction{
      display: flex;
      .ModellingDiv{ // далее смотри в глабольных стялях
        width: 100%;
        height: calc(100% - 46px);
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
    .FooterSection{
      display: flex;
      flex: 1;
      flex-direction: row-reverse;
      overflow: hidden;
      .workpage{
        flex: 1;
        background-color: var(--color-bg-panel);
        border: 3px solid var(--color-border1);
        display: flex;
        border-top-left-radius: 10px;
        border-bottom: none;
        border-right: none;
        .ComponentSelect{
          display: flex;
          overflow-x: hidden;
          position: relative;
          flex: 1;
          z-index: 1;
          height: auto;
          background: none;
        }
      }
      .FlexMenuSection{
        flex-direction: column;
        height: auto ;
        width: fit-content ;
        align-items: normal ;
        display: flex;
        .ButtonSection{
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          transition: all 0.5s ease-out;
          position: relative;

          h1{
            margin: 5px;
            font-size: 18px;
            text-align: left;
            color: #777777;
          }
          .ButtonList{
            flex: 1;
            display: flex;
            justify-content: space-evenly;
            flex-direction: column;
            &.PanelMenu{
              margin: 0px 10px 0px 0px;
              padding: 5px;
            }
          }
          button{
            flex: 1;
            margin: 3px 0px 3px 0px;
            padding: 10px 0px 10px 5px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            z-index: 2;
            span{
              padding-left: 8px;
            }
          }
        }
      }
  } 
  }
</style>
