<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/left-arrow.png">
            </button>
          </div>
          
          <div class="titleText">
            Информация системы
          </div>
    <div class="DataTable">
        <h1>Эксперимент</h1>
        <p>Заявки</p>
      <div class="PanelDefault">
        
        <table class="TableDefault">
          <tr>
            <th>№</th><th>Цель</th><th>Широта</th><th>Долгота</th><th>Высота</th><th>Приоритет</th><th>Срок</th><th>Появление</th><th></th>
          </tr>
          <tr
          v-for="data, index in requestJson"
            :key="index"
            :class="!requestApproved ? 'active' :''"
            @change="ChangeParamRequest"
            v-show="!(data.deleted==true)"
          >
          <td>{{ index }}</td>
          <td> {{data.catalog.goalName}} <select v-if="!requestApproved"  :id="index" name="catalog" class="select-css" v-model="selectCatalog">
            <option v-for="data_catalog, index_catalog in catalogJson" 
              :key="index_catalog"
              :selected="data.catalog.goalName == data_catalog.goalName"
              :value="data_catalog">{{ data_catalog.goalName }}</option>
          </select></td>
          <td>{{ data.catalog.lat }}</td>
          <td>{{ data.catalog.lon }}</td><td>{{ data.catalog.alt }}</td>
          <td><input :id="index" name="priory" type="text" :value="data.priory"></td>
          <td><input :id="index" name="term" type="text" :value="data.term"></td>
          <td><input :id="index" name="time" type="text" :value="data.time"></td>
          <td v-if="!requestApproved" :id="index" @click="DeleteRowRequest(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
            <tr v-if="!requestApproved" class="addRowButton">
            <td colspan="9"><button @click="AddRowRequest">Добавить заявку</button></td>
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
     <div class="DataTable">
    <h1>Каталог</h1>
      <div class="PanelDefault">
        
        <table class="TableDefault">
          <tr>
            <th>Цель</th><th>Широта</th><th>Долгота</th><th>Высота</th><th></th>
          </tr>
          <tr v-for="data, index in catalogJson"
            :key="index"
            :class="!catalogApproved ? 'active' :''"
            @change="ChangeParam"
            v-show="!(data.deleted==true)"
          ><td><input :id="index" name="goalName" type="text" :value="data.goalName"></td>
            <td><input :id="index" name="lat" type="text" :value="data.lat"></td>
            <td><input :id="index" name="lon" type="text" :value="data.lon"></td>
            <td><input :id="index" name="alt" type="text" :value="data.alt"></td>
            <td v-if="!catalogApproved" :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
          <tr v-if="!catalogApproved" class="addRowButton">
            <td colspan="5"><button @click="AddRow">Добавить КА</button></td>
          </tr> 
        </table>
        </div>
        <div class="PanelTable">
      <div class="TableInfo PanelDefault">
        <div class="ButtonApproved">
          <button v-if="catalogApproved" @click="SatartEditing('catalog')" class="ButtonDefault"> <img src="../../assets/edit.svg">Редактировать</button> 
          <button v-if="catalogApproved" class="ButtonDefaultShadow"></button>  
        </div>
        <div class="ButtonApproved">
          <button v-if="!catalogApproved" @click="SatartSave('catalog')" :class="!catalogJsonsave ? '' :'Empty disabled'" class="ButtonDefault"> <img src="../../assets/save.svg">Сохранить</button>
          <button v-if="!catalogApproved && !catalogJsonsave" class="ButtonDefaultShadow"></button>
        </div>
      </div>
    </div>
      </div>
    </div>
  </template>
  
  <script>

import {adress} from '../../js/config_server.js'
import MainStyle from '../../style/component.scss'

  export default {
    name: 'TargetDZZ',
    css:{
      MainStyle
    },
    data(){
      return{
        modalwindowDisplay: false,
        catalogJson: [],
        catalogApproved: true,
        catalogJsonsave: true,
        selectCatalog: null,

        requestJson: [],
        requestApproved: true,
        requestJsonsave: true,

      }
    },
    methods: {
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
      AddRow(){
            var addedRow = {
                    'goalId' : 0,
                    'goalName' : "", 'lat' : 0,
                    'lon' : 0, 'alt' : 0,
                    'deleted': false, 'role': "newRow"
                };
            this.catalogJson.push(addedRow);   
            this.catalogJsonsave = false
          },
      AddRowRequest(Catalog_id){
        console.log(Catalog_id)
        if(this.catalogJson.length < 1){
          alert("Нет целей в каталоге, пожалуйста создайте")
          return;
        }
        var addedRow = {
                      "requestId": undefined,
                      "catalog": this.catalogJson[0],
                      "orderId": this.catalogJson.length + 1,
                      "priory": 3,
                      "term": "2024-01-01T00:00:00",
                      "time": "2024-01-01T00:01:00",
                      "idNode": {
                          "entryId": 402,
                          "idNode": 1
                      }, // тестово неизвестно где брать
                      "filter": false,
                      "deleted": null, 'role': "newRow"
                };
            this.requestJson.push(addedRow);   
            this.requestJsonsave = false
      },
      DeleteRow(index){
              console.log("Удаление - ",index)
              this.catalogJsonsave = false
              if (this.catalogJson[index].role === "newRow") {
                console.log(index)
                this.catalogJson.splice(index,1)
              }
              else{
                this.catalogJson[index].deleted = true
              }
          },
      DeleteRowRequest(index){
              console.log("Удаление - ",index)
              this.requestJsonsave = false
              if (this.requestJson[index].role === "newRow") {
                console.log(index)
                this.requestJson.splice(index,1)
              }
              else{
                this.requestJson[index].deleted = true
              }
          },
      SatartSave(target){
        if(target == 'catalog')
        {
          console.log(JSON.stringify(this.catalogJson))
          try {
            fetch('http://'+adress+'/api/v1/satrequest/catalog/update',{
              method:  'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(this.catalogJson)
            })
              .then(response => response.json())
              .then(data => console.log(data))
              this.catalogJsonsave = true
            } catch (error) {
                console.error('Error save:', error);
            }
            
        }
        if(target == 'request')
        {
          console.log(JSON.stringify(this.requestJson))
          try {
            fetch('http://'+adress+'/api/v1/satrequest/request/update',{
              method:  'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(this.requestJson)
            })
              .then(response => response.json())
              .then(data => console.log(data))
              this.requestJsonsave = true
            } catch (error) {
                console.error('Error save:', error);
            }
        }
      },
      SatartEditing (target){
        if(target == 'catalog')
          this.catalogApproved = false
        if(target == 'request')
          this.requestApproved = false
      },
      ChangeParam(target){
        console.log(target.target.id)
        this.catalogJson[target.target.id][target.target.name] = target.target.value
        this.catalogJsonsave = false
      },
      ChangeParamRequest(target){
        console.log(target)
        
        if(target.target.name == "catalog")
        {
          console.log(target.target.name, this.requestJson[target.target.id][target.target.name])
          this.requestJson[target.target.id][target.target.name] = this.selectCatalog
        }
        else{
          this.requestJson[target.target.id][target.target.name] = target.target.value
        }
        this.requestJsonsave = false
        console.log(this.requestJson, this.selectCatalog)
      }
      
    },
    
    async mounted() {
    try {
        const response = await fetch('http://'+adress+'/api/v1/satrequest/catalog/get/all');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        else{
          const result = await response.json();
          console.log(result)
          this.catalogJson = result;
        }
    } catch (error) {
        this.timefetch = "Error";
        console.error('Error during fetch:', error);
    }
    try {
        const response = await fetch('http://'+adress+'/api/v1/satrequest/request/get/all');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        else{
          const result = await response.json();
          console.log("REZ- ", result)
          this.requestJson = result;
        }
    } catch (error) {
        this.timefetch = "Error";
        console.error('Error during fetch:', error);
    }
    }
  }
  </script>

<style lang="scss" scoped>
.main_contain{
  display: inline-flex;
  flex-direction: column;
  flex-wrap: nowrap;
}
td{
  text-align: left;

}
th{
  border-bottom: 2px solid white;

}
</style>
