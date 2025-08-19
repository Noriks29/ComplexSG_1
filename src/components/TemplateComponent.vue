<template>
  <div class="SectionMenu">
      <div class="HeadersSction">
        <SystemWindow :modellingStatus="ExperimentStatus" @updateParentComponent="ChangeComponents" :systemStatus="system" />
        <ModellingComponent v-if="system.typeWorkplace != -1" :ExperimentStatus="ExperimentStatus" @ChangeExperimentStatus="ChangeExperimentStatus"  @showSettings="ChangeExperimentEddit($event)"/>
      </div>
      <div class="FooterSection" v-if="system.typeWorkplace != -1">
        <ModelingRezult :systemStatus="system" @showRezult="ShowModellingPanel"/>
        <Panel class="workpage" :pt="{ header: { style: 'display: none' }, content:{style:'display: flex;padding: 0px;height:100%'},toggleablecontent:{style:'height: 100%;'} }" :style="'overflow: hidden;'">
            <transition name="translate" mode="out-in" v-if="activeComponent != ''">
              <div class="ComponentSelect">
                <component :is="activeComponent" :modellingStatus="ExperimentStatus" @updateParentComponent="ChangeComponents" :systemStatus="system" :ModelingRezultMode="ModelingRezultMode"></component> 
              </div>
            </transition>
        </Panel>
        <Menu :class="{ 'p-collapsed-menu': animation.menuhide}" :style="'margin: 5px;min-width: fit-content;overflow-y:auto;overflow-x:hidden;'" :model="[
          {
            items: [
              { label: 'Логи событий', command: () => SelectComponent('LogEventList'), active: activeComponent=='LogEventList'},
            ]
          },
          {
            label: 'КС',
            items: [
              { label: 'НП', command: () => SelectComponent('NP'), active: activeComponent=='NP'},
              { label: 'КА и ОГ', command: () => SelectComponent('OG'), active: activeComponent=='OG'},
              { label: 'Модели КА', command: () => SelectComponent('TypeKA'), active: activeComponent=='TypeKA'}
            ]
          },
          {
            label: 'Исходные данные',
            items: [
              {label: 'Заявки', command: () => SelectComponent('TargetDZZ'), active: activeComponent=='TargetDZZ'}
            ]
          },
          {
            label: 'Связь',
            items: [
              { label: 'КА - НП', command: () => SelectComponent('EarthConstellation'), active: activeComponent=='EarthConstellation'},
              { label: 'КА - КА', command: () => SelectComponent('LeaderConstellationConstellation'), active: activeComponent=='LeaderConstellationConstellation'}
            ]
          },
          /*
          {
            label: 'Инструменты',
            visible: ![2, 4].includes(system.typeWorkplace),
            items: [
              { label: 'Обход целей', command: () => SelectComponent('TargetRoad'), active: activeComponent=='TargetRoad'},
              { label: 'Видимость целей', command: () => SelectComponent('EstimationConstellation'), active: activeComponent=='EstimationConstellation'}
            ]
          }*/
        ]">
          <template #start>
            <span class="ButtonStartMenu">
              <Button icon="pi pi-th-large" severity="info" text :style="'height: 35px;width: 35px;'" @click="animation.menuhide = !animation.menuhide"/>
              <div class="ImportExport">
                <Button icon="pi pi-upload"   severity="success" text outlined :style="'height: 35px;width: 35px;'"/>
                <Button icon="pi pi-download" severity="danger" text outlined :style="'height: 35px;width: 35px;'"/>
              </div>
            </span>
          </template>
          <template #item="{ item }">
            <a class="flex align-items-center p-menuitem-link" :class="{ 'p-menuitem-active': item.active }">
              <span>{{ item.label }}</span>
              <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
                {{ item.shortcut }}
              </span>
            </a>
          </template>
        </Menu>
        <!--
        <div class="MenuButton">
          <img src="@/assets/exportIcon.png" id="export" alt="" @click="SaveWorkplace">
          <label class="input-fileMenu">
              <input type="file" name="file" id="file-Json" @change="LoadFile" accept="application/json" enctype="multipart/form-data">		
              <img src="@/assets/importIcon.png" id="import" alt="">
          </label>
        </div>  
        -->
      </div>
    </div>
</template>

<script>
//import { saveAs } from 'file-saver';
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

import ModellingComponent from './KA/ModellingComponent.vue';
import ModelingRezult from './KA/ModelingRezult.vue';
import ModelingPanel from './KA/ModelingPanel.vue';

import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Panel from 'primevue/panel';
export default {
  name: 'TemplateComponent',
  emits: ['changeExperimentStatus'],
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

    KARealTime,
    MapContainer,

    ModellingComponent,
    ModelingPanel,
    ModelingRezult,

    Menu,Button,Panel
  },
  data(){
      return{
        activeComponent: "MapContainer",
        system: {typeWorkplace: -1},
        ExperimentStatus: false,
        experimentEddit: false,
        ModelingRezultMode: 'Settings',
        animation:{
          menuButton: false,
          menuhide: false
        }
    }
  },
  methods: {
    SelectComponent(nameComponent) {
        this.activeComponent = nameComponent
        this.experimentEddit = false
      },
      async ChangeComponents() {
        this.system = await this.$SystemObject()
        this.SelectComponent('MapContainer')
        
      },
      async ShowModellingPanel(mode){
        if(!(this.ModelingRezultMode == 'Settings' && mode == null)){
          if(mode == null){
            await this.SelectComponent('')
          }
          else{
            this.ModelingRezultMode = mode || 'Settings'
          }
          this.SelectComponent('ModelingPanel')
        } 
      },
      ChangeExperimentStatus(emit){
        this.ExperimentStatus = emit.status
        this.animation.menuButton = emit.status
        this.ChangeComponents()
      },
      ChangeExperimentEddit(status){
        this.experimentEddit = status
        this.activeComponent = status?'ModelingPanel':'MapContainer'
        this.ModelingRezultMode = 'Settings'
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
.p-menu{
  .hide{
    display: none;
  }
}
.p-menuitem-active {
  background-color: var(--primary-color) !important;
  color: white !important;
}
.ButtonStartMenu{
  display: flex;
  justify-content: space-between;
  div{
    button{
      margin: 0px 5px;
    }
  }
}
:deep(.p-menu.p-collapsed-menu) {
  width: calc(35px + 0.5rem) !important;
  overflow: hidden;
  transition: width 1.3s ease;
  min-width: unset;
  .p-menu-list, .ImportExport {
    display: none;
  }
}

.PanelMenu{
  margin-left: 0px !important;
  .GetData{
    margin-right: 5px !important;
  }
}
.SectionMenu{
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0px;
    flex-wrap: nowrap;
    overflow: auto;
    align-items: normal;
    position: relative;
    flex: 1;
    .HeadersSction{
      display: flex;
      margin: 0px 5px;
      .ModellingDiv{ // далее смотри в глабольных стялях
        width: 100%;
        height: 100px;
        min-height: calc(100% - -4px);
        flex: 1;
        overflow-y: auto;
        margin: 0px;
      }
    }
    .FooterSection{
      display: flex;
      flex: 1;
      flex-direction: row-reverse;
      overflow: hidden;
      .workpage{
        flex: 1;
        z-index: 21;
        margin: 5px 5px 5px 0px;
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
  } 
  }

  .MenuButton{
    display: flex;
    margin: 0px 5px 0px 0px;
    justify-content: space-between;
    padding: 5px 5px 5px 5px;
    img{
      transition: all 0.5s linear;
    }
    
  }
</style>
