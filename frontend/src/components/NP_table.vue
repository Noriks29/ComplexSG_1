<template>
  <div class="DataTable">
    
    <div class="PanelDefault">
      <table class="TableDefault">
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Широта</th>
          <th>Долгота</th>
          <th v-if="!approved"></th>
        </tr>
        <tr
          v-for="(data, index) in dataJson"
          :key="index"
          :class="!approved ? 'active' :''"
          @change="ChangeParam"
          v-show="!(data.deleted==true)"
        >
          <td>{{ data.idNode }}</td>
          <td><input :id="index" name="nameEarthPoint"
             :value="data.nameEarthPoint"></td>
          <td><input :id="index" name="longitude" class="small" 
            :value="data.longitude"></td>
          <td><input :id="index" name="latitude" class="small" 
              :value="data.latitude"></td>
          <td v-if="!approved" :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../assets/delete.svg" alt="Удалить"></td>
        </tr>
        <tr v-if="!approved" class="addRowButton">
          <td colspan="5"><button @click="AddRow">Добавить наземный пункт</button></td>
        </tr> 
      </table>
    </div>
    <div class="PanelTable">
      <div class="TableInfo PanelDefault">
        <div :class="approved ? 'Yes' :'No'">
        {{ approved ? " Утверждено" : "Не Утверждено" }}
        </div>
        <div class="ButtonApproved">
          <button v-if="approved" @click="ChangeSystemStatus(false)" class="ButtonDefault"> <img src="../assets/edit.svg">Редактировать</button> 
          <button v-if="approved" class="ButtonDefaultShadow"></button>  
        </div>
        <div class="ButtonApproved">
          <button v-if="!approved" @click="SatartSave" :class="!datasave ? '' :'Empty disabled'" class="ButtonDefault"> <img src="../assets/save.svg">Сохранить</button>
          <button v-if="!approved && !datasave" class="ButtonDefaultShadow"></button>
        </div>
        <div class="ButtonApproved"> 
          <button v-if="!approved" @click="ChangeSystemStatus(true)" :class="datasave ? '' :'Empty disabled'" class="ButtonDefault"> <img src="../assets/approve.svg">Утвердить</button>
          <button v-if="!approved && datasave" class="ButtonDefaultShadow"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {DisplayLoad, FetchGet, FetchPost} from '../js/LoadDisplayMetod.js'

  export default {
    name: 'TableData',
    data() {
      return {
        dataJson: [],
        approved: true,
        datasave: true
      }
    },
    props:{
    systemStatus:{
          type: Object
        },
    },
    methods:
      {
        setPost() {
          FetchPost("/api/v1/earth/update/byList", this.dataJson)
        },
        SatartSave(){
          this.setPost();
          this.datasave = true
        },
        ChangeSystemStatus( stat ){
          if(this.datasave){
            this.approved = stat
            let dataSystem = this.systemStatus
            dataSystem.earthStatus = this.approved
            this.$emit('ChangeSystemStatus', dataSystem)
          }
        },
        AddRow(){
          var addedRow = {'idNode' : 0, 'nameEarthPoint' : "__NULL__", 'longitude' : 0, 'latitude' : 0, 'deleted': false, 'id': undefined};
          this.dataJson.push(addedRow);   
          this.datasave = false
        },
        ChangeParam(event){
          this.datasave = false
          switch(event.target.name){
            case "nameEarthPoint":
              this.dataJson[event.target.id].nameEarthPoint = event.target.value
              break;
            case "longitude":{
              let longitudecorrect = Number(event.target.value)
              if(longitudecorrect < -90) longitudecorrect = -90
              if(longitudecorrect > 90) longitudecorrect = 90
              this.dataJson[event.target.id].longitude = longitudecorrect
              break;
            }
            case "latitude":
            {
              let latitudecorrect = Number(event.target.value)
              if(latitudecorrect < -180) latitudecorrect = -180
              if(latitudecorrect > 180) latitudecorrect = 180
              this.dataJson[event.target.id].latitude = latitudecorrect
              break;
            }
            default:
              alert( "Ошибка!" );
          }
        },
        DeleteRow(index){
            if (this.dataJson[index].id !== undefined) {
              this.dataJson[index].deleted = true
            }
            else{
              this.dataJson.splice(index,1)
            }
            this.datasave = false
        }
    },
    async mounted() {
      
      DisplayLoad(true)
      this.approved = this.systemStatus.earthStatus
      let result = await FetchGet('/api/v1/earth/get/list')
      this.dataJson = result || {}
      DisplayLoad(false)
}

  }
</script>


<style lang="scss" scoped>

</style>