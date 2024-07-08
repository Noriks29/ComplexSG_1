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
        >
          <td>{{ data.idNode }}</td>
          <td><input :id="index" name="nameEarthPoint"
             :value="data.nameEarthPoint"></td>
          <td><input :id="index" name="longitude" class="small" 
            :value="data.longitude"></td>
          <td><input :id="index" name="latitude" class="small" 
              :value="data.latitude"></td>
          <td v-if="!approved" :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
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
          <button v-if="approved" @click="ChangeSystemStatus(false)" class="ButtonDefault"> <img src="../../assets/edit.svg">Редактировать</button> 
          <button v-if="approved" class="ButtonDefaultShadow"></button>  
        </div>
        <div class="ButtonApproved"> 
          <button v-if="!approved" @click="ChangeSystemStatus(true)" class="ButtonDefault"> <img src="../../assets/approve.svg">Утвердить</button>
          <button v-if="!approved" class="ButtonDefaultShadow"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {DisplayLoad, FetchGet, FetchPost} from '../../js/LoadDisplayMetod.js'

  export default {
    name: 'TableData',
    data() {
      return {
        dataJson: [],
        approved: true,
      }
    },
    props:{
    systemStatus:{
          type: Object
        },
    },
    methods:
      {
        async setPost() {
          await FetchPost("/api/v1/earth/update/byList", this.dataJson)
        },
        ChangeSystemStatus( stat ){
            this.approved = stat
            let dataSystem = this.systemStatus
            dataSystem.earthStatus = this.approved
            this.$emit('ChangeSystemStatus', dataSystem)
        },
        async AddRow(){
          var addedRow = {'idNode' : 0, 'nameEarthPoint' : "__NULL__", 'longitude' : 0, 'latitude' : 0, 'deleted': false, 'id': undefined};
          this.dataJson.push(addedRow);   
          await this.setPost()
          await this.ReFetch()
        },
        ChangeParam(event){
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
          this.setPost()
        },
        async DeleteRow(index){
            this.dataJson[index].deleted = true
            await this.setPost()
            await this.ReFetch()
        },
        async ReFetch(){
          let result = await FetchGet('/api/v1/earth/get/list')
          this.dataJson = result
        }
    },
    async mounted() {
      alert( document.cookie);
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