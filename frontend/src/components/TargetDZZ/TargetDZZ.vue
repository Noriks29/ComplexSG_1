<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
          
          <div class="titleText">
            Информация системы
          </div>
          <div>
            <!--<SelectDiv  :dataOption="arr"/>-->
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
          <td><SelectDiv  :dataOption="arr" :valueS="data.catalog" :id="index" @valueSelect="SelectChange"/></td>
          <td>{{ data.catalog.lat }}</td>
          <td>{{ data.catalog.lon }}</td><td>{{ data.catalog.alt }}</td>
          <td><input :id="index" name="priory" type="text" :value="data.priory"></td>
          <td><DateTime :valueUnix="data.term" :id="index" :name="'term'"  @valueSelect="ChangeTime"/></td>
          <td><DateTime :valueUnix="data.time" :id="index" :name="'time'" @valueSelect="ChangeTime"/></td>
          <td :id="index" @click="DeleteRowRequest(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
            <tr class="addRowButton">
            <td colspan="9"><button @click="AddRowRequest">Добавить заявку</button></td>
          </tr>   
        </table>
        </div>
        <div class="PanelTable">
      <div class="TableInfo PanelDefault">
        <div class="ButtonApproved">
          <button  @click="SatartSave('request')" :class="!requestJsonsave ? '' :'Empty disabled'" class="ButtonDefault"> <img src="../../assets/save.svg">Сохранить</button>
          <button v-if="!requestJsonsave" class="ButtonDefaultShadow"></button>
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
            <td :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
          <tr class="addRowButton">
            <td colspan="5"><button @click="AddRow">Добавить</button></td>
          </tr> 
        </table>
        </div>
        <div class="PanelTable">
      <div class="TableInfo PanelDefault">
        <div class="ButtonApproved">
          <button @click="SatartSave('catalog')" :class="!catalogJsonsave ? '' :'Empty disabled'" class="ButtonDefault"> <img src="../../assets/save.svg">Сохранить</button>
          <button v-if="!catalogJsonsave" class="ButtonDefaultShadow"></button>
        </div>
      </div>
    </div>
      </div>
    </div>
  </template>
  
  <script>

import {DisplayLoad, FetchGet, FetchPost} from '../../js/LoadDisplayMetod.js'
import MainStyle from '../../style/component.scss'
import SelectDiv from '../SelectDiv.vue'
import DateTime from '../DateTime.vue';

  export default {
    name: 'TargetDZZ',
    css:{
      MainStyle
    },
    components:{
      SelectDiv,
      DateTime
    },
    data(){
      return{
        catalogJson: [],
        catalogJsonsave: true,
        selectCatalog: null,

        requestJson: [],
        requestJsonsave: true,

        arr: []
      }
    },
    methods: {
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
      ChangeTime(obgtime){
        this.requestJson[obgtime.id][obgtime.name] = obgtime.time
        this.requestJsonsave = false
      },
      SelectChange(e){
        this.requestJson[e.id].catalog = e.value
        this.requestJsonsave = false
      },
      CreateSelectArr(){
        this.arr = []
        for (let i = 0; i < this.catalogJson.length; i++) {
          const element = this.catalogJson[i];
          this.arr.push({value: element, lable: element.goalName })
        }

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
      AddRowRequest(){
        if(this.catalogJson.length < 1){
          alert("Нет целей в каталоге, пожалуйста создайте")
          return;
        }
        var addedRow = {
                      "requestId": undefined,
                      "catalog": this.catalogJson[0],
                      "orderId": this.catalogJson.length + 1,
                      "priory": 3,
                      "term": Math.floor(Date.now()/1000),
                      "time": Math.floor(Date.now()/1000),
                      "idNode": {
                          "entryId": 452,
                          "idNode": 1,
                      }, // тестово неизвестно где брать
                      "filter": false,
                      "deleted": null, 'role': "newRow"
                };
            this.requestJson.push(addedRow);   
            this.requestJsonsave = false
      },
      DeleteRow(index){
              this.catalogJsonsave = false
              if (this.catalogJson[index].role === "newRow") {
                this.catalogJson.splice(index,1)
              }
              else{
                this.catalogJson[index].deleted = true
              }
          },
      DeleteRowRequest(index){
              this.requestJsonsave = false
              if (this.requestJson[index].role === "newRow") {
                this.requestJson.splice(index,1)
              }
              else{
                this.requestJson[index].deleted = true
              }
          },
      SatartSave(target){
        if(target == 'catalog')
        {
          FetchPost("/api/v1/satrequest/catalog/update", this.catalogJson)
          this.catalogJsonsave = true
        }
        if(target == 'request')
        {
          FetchPost("/api/v1/satrequest/request/update", this.requestJson)
          this.requestJsonsave = true
        }
      },
      ChangeParam(target){
        this.catalogJson[target.target.id][target.target.name] = target.target.value
        this.catalogJsonsave = false
        this.CreateSelectArr()
      },
      ChangeParamRequest(target){
        
        if(target.target.name == "catalog")
        {
          this.requestJson[target.target.id][target.target.name] = this.selectCatalog
        }
        else if(target.target.name == "date" || target.target.name == "time"){
          //обработка через событие компонента
        }
        else{
          this.requestJson[target.target.id][target.target.name] = target.target.value
        }
        this.requestJsonsave = false
      }
      
    },
    
    async mounted() {
      DisplayLoad(true)
      let result = await FetchGet('/api/v1/satrequest/catalog/get/all')
      this.catalogJson = result || {}
      result = await FetchGet('/api/v1/satrequest/request/get/all')
      this.requestJson = result || {}
      DisplayLoad(false)
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
