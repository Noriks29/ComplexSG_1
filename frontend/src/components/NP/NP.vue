<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
          
          
    <div class="ContentDiv">
      <div class="TitleText">Список наземных пунктов</div>
    
    <div class="Panel MaxWidth">
      <table>
        <tr v-if="dataJson.length > 0">
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
          <td><input :id="index" name="nameEarthPoint" :class="approved ? 'disable' : ''"
             :value="data.nameEarthPoint"></td>
          <td><input :id="index" type="number" name="latitude" class="small" :class="approved ? 'disable' : ''"
            :value="data.latitude"></td>
          <td><input :id="index" type="number" name="longitude" class="small" :class="approved ? 'disable' : ''" 
              :value="data.longitude"></td>
          <td v-if="!approved" :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
        </tr>
        <tr v-if="!approved" class="addRowButton">
          <td colspan="5"><button @click="AddRow">
            <img src="../../assets/add.png" alt="" class="addButtonIcon">
            Добавить наземный пункт
          </button></td>
        </tr> 
      </table>
    </div>
    <div class="Panel TableInfo MaxWidth">
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
    name: 'NP',
    data(){
      return{
        dataJson: [],
        approved: true,
      }
    },
    props:{
    systemStatus:{
          type: Object
        },
    },
    methods: {
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
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
          var addedRow = {'idNode' : 0, 'nameEarthPoint' : "", 'longitude' : 0, 'latitude' : 0, 'deleted': false};
          this.dataJson.push(addedRow);   
          await this.setPost()
          await this.ReFetch()
        },
        ChangeParam(event){
          switch(event.target.name){
            case "nameEarthPoint":
              this.dataJson[event.target.id].nameEarthPoint = event.target.value
              break;
            case "latitude":{
              let longitudecorrect = Number(event.target.value)
              if(longitudecorrect < -90) longitudecorrect = -90
              if(longitudecorrect > 90) longitudecorrect = 90
              this.dataJson[event.target.id].latitude = longitudecorrect
              break;
            }
            case "longitude":
            {
              let latitudecorrect = Number(event.target.value)
              if(latitudecorrect < -180) latitudecorrect = -180
              if(latitudecorrect > 180) latitudecorrect = 180
              this.dataJson[event.target.id].longitude = latitudecorrect
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
          this.dataJson = result || []
        }
      
    },
    async mounted() {
      DisplayLoad(true)
      this.approved = this.systemStatus.earthStatus
      let result = await FetchGet('/api/v1/earth/get/list')
      this.dataJson = result || []
      DisplayLoad(false)
    }
  }
  </script>
