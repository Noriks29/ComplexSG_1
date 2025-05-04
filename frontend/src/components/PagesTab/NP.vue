<template>
    <div class="main_contain RowSection">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
            <h1 class="TitleText">Список наземных пунктов</h1>
          </div>
    <div class="ContentDiv">
    <div class="Panel RightPanel">
      <div class="ButtonApprovedDiv" v-if="!modellingStatus">
          <button @click="ChangeApproved(!approved)" class="ButtonCommand" :class="approved? 'green' : 'red'">
          <span v-if="approved"><img src="../../assets/edit.svg"></span>
          <span v-else><img src="../../assets/approve.svg"></span>
          <span>{{ approved ?  'Редактировать' : 'Утвердить'}}</span>
        </button>
      </div>
      <div class="TableDiv" style="max-height: 75%;">
      <table class="TableDefault">
        <thead>
          <tr>
            <th></th>
            <th>Название</th>
            <th>Широта</th>
            <th>Долгота</th>
            <th v-if="!approved && !modellingStatus" class="delete"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(data, index) in dataJson"
            :key="index"
            :class="approved || modellingStatus ? 'disable' :''"
            @change="ChangeParam(index)"
          >
            <td>{{ index+1 }}</td>
            <td><input v-model="data.nameEarthPoint"></td>
            <td><input type="number"  v-model="data.latitude"></td>
            <td><input type="number"  v-model="data.longitude" ></td>
            <td v-if="!approved && !modellingStatus" @click="DeleteRow(index)" class="delete"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
        </tbody>
        <tfoot>
          <tr v-if="!approved && !modellingStatus" class="addRowButton">
            <td colspan="5"><button @click="AddRow">
              <img src="../../assets/add.png" alt="" class="addButtonIcon">
              Добавить наземный пункт
            </button></td>
          </tr> 
        </tfoot>
      </table>
    </div>
   </div> 
  </div>
  </div>
</template>
  
<script>
import {DisplayLoad} from '../../js/LoadDisplayMetod.js'
import { NPList, ChangeNP, SystemObject, ChangeSystemObject} from '@/js/GlobalData.js'; 
import { PagesSettings } from './PagesSettings.js';

  export default {
    name: 'NP',
    mixins: [PagesSettings],
    data(){
      return{
        dataJson: [], // локальное хранилище нп
        approved: true,
      }
    },
    methods: {
        async AddRow(){
          this.dataJson.push({'nameEarthPoint' : "", 'longitude' : 0, 'latitude' : 0, 'deleted': false});   
          this.dataJson = await ChangeNP(this.dataJson)
        },
        async ChangeParam(id){
          this.dataJson[id]
          let longitudecorrect = Number(this.dataJson[id].latitude)
            if(longitudecorrect < -90) longitudecorrect = -90
            if(longitudecorrect > 90) longitudecorrect = 90
            this.dataJson[id].latitude = longitudecorrect

          let latitudecorrect = Number(this.dataJson[id].longitude)
              if(latitudecorrect < -180) latitudecorrect = -180
              if(latitudecorrect > 180) latitudecorrect = 180
              this.dataJson[id].longitude = latitudecorrect

          await ChangeNP(this.dataJson, false)
        },
        async DeleteRow(index){
            this.dataJson[index].deleted = true
            this.dataJson = await ChangeNP(this.dataJson)
        },
        async ChangeApproved(status){
          await ChangeSystemObject('earthStatus', status)
          this.approved = status
        }
    },
    async mounted() {
      DisplayLoad(true)
      this.dataJson = await NPList
      this.approved = SystemObject.earthStatus
      DisplayLoad(false)
    }
  }
  </script>
