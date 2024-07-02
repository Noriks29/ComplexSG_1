<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
          <div>
            <button class="ChangeViewMode Right" v-if='viewmode < 1' @click="viewmode++">
              <img src="../../assets/arrow2.png">
            </button>
            <button class="ChangeViewMode Left" v-if='viewmode > 0' @click="viewmode--">
              <img src="../../assets/arrow1.png">
            </button>
          </div>  
          <h1 class="titleText">Эксперимент</h1>
    <div class="DataTable" v-if="viewmode == 0">
        <p class="titleText">Заявки</p>
      <div class="PanelDefault">
        
        <table class="TableDefault">
          <tr>
            <th>№</th><th>Цель</th><th>Широта</th><th>Долгота</th><th>Высота</th><th>НП</th><th>Приоритет</th><th>Время появления</th><th>Срок выполнения</th><th></th>
          </tr>
          <tr
          v-for="data, index in requestJson"
            :key="index"
            :class="!requestApproved ? 'active' :''"
            @change="ChangeParamRequest"
            v-show="!(data.deleted==true)"
          >
          <td>{{ index }}</td>
          <td><SelectDiv  :dataOption="arr" :valueS="{value:data.catalog, lable:data.catalog.goalName}" :id="index" @valueSelect="SelectChange"/></td>
          
          <td>{{ data.catalog.lat }}</td>
          <td>{{ data.catalog.lon }}</td><td>{{ data.catalog.alt }}</td>
          <td><SelectDiv  :dataOption="arrNP" :valueS="{value:data.earthPoint, lable:data.earthPoint.nameEarthPoint}" :id="index" @valueSelect="SelectChangeNP"/></td>
          <td><input :id="index" name="priory" type="text" :value="data.priory"></td>
          <td><DateTime :valueUnix="data.time" :id="index" :name="'time'" @valueSelect="ChangeTime"/></td>
          <td><DateTime :valueUnix="data.term" :id="index" :name="'term'"  @valueSelect="ChangeTime"/></td>
          
          <td :id="index" @click="DeleteRowRequest(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
            <tr class="addRowButton">
            <td colspan="9"><button @click="AddRowRequest(catalogJson[0])">Добавить заявку</button></td>
          </tr>   
        </table>
        </div>
    </div>
     <div class="DataTable"  v-if="viewmode == 1">
    <h1 class="titleText">Каталог</h1>
      <div class="PanelDefault">
        
        <table class="TableDefault">
          <tr>
            <th></th><th>Цель</th><th>Широта</th><th>Долгота</th><th>Высота</th><th></th>
          </tr>
          <tr v-for="data, index in catalogJson"
            :key="index"
            :class="!catalogApproved ? 'active' :''"
            @change="ChangeParam"
            v-show="!(data.deleted==true)"
          >
            <td><button @click="AddRowRequest(data)">+</button></td>  
            <td><input :id="index" name="goalName" type="text" :value="data.goalName"></td>
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
    props:{
    systemStatus:{
          type: Object
        },
    },
    data(){
      return{
        viewmode: 0,
        catalogJson: [],
        selectCatalog: null,

        requestJson: [],

        arr: [],
        arrNP: []
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
        this.SatartSave('request')
      },
      SelectChange(e){
        this.requestJson[e.id].catalog = e.value
        this.SatartSave('request')
      },
      SelectChangeNP(e){
        this.requestJson[e.id].catalog = e.value
        this.SatartSave('request')
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
            this.SatartSave('catalog')
          },
      AddRowRequest(catalog){
        if(this.catalogJson.length < 1){
          alert("Нет целей в каталоге, пожалуйста создайте")
          return;
        }
        var addedRow = {
                      "requestId": undefined,
                      "catalog": catalog,
                      "orderId": this.catalogJson.length + 1,
                      "priory": 3,
                      "term": this.systemStatus.modelingBegin,
                      "time": this.systemStatus.modelingEnd,
                      "earthPoint": this.arrNP[0].value,
                      "filter": false,
                      "deleted": null, 'role': "newRow"
                };
            this.requestJson.push(addedRow);   
            this.SatartSave('request')
      },
      DeleteRow(index){
              this.catalogJson[index].deleted = true
              this.SatartSave('catalog')
          },
      DeleteRowRequest(index){
              this.requestJson[index].deleted = true
              this.SatartSave('request')
          },
      async SatartSave(target){
        if(target == 'catalog')
        {
          await FetchPost("/api/v1/satrequest/catalog/update", this.catalogJson)
          await this.ReFetch()
        }
        if(target == 'request')
        {
          let response = await FetchPost("/api/v1/satrequest/request/update", this.requestJson)
          await this.ReFetch()
          console.log(response)
        }
      },
      ChangeParam(target){
        this.catalogJson[target.target.id][target.target.name] = target.target.value
        this.CreateSelectArr()
        this.SatartSave('catalog')
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
        this.SatartSave('request')
      },
      async ReFetch(){
        let result = await FetchGet('/api/v1/satrequest/catalog/get/all')
        this.catalogJson = result || {}
        result = await FetchGet('/api/v1/satrequest/request/get/all')
        this.requestJson = result || {}
        this.CreateSelectArr()
      }
      
    },
    
    async mounted() {
      console.log(this.systemStatus)
      DisplayLoad(true)
      let result = await FetchGet('/api/v1/satrequest/catalog/get/all')
      this.catalogJson = result || {}
      result = await FetchGet('/api/v1/satrequest/request/get/all')
      this.requestJson = result || {}
      result = await FetchGet('/api/v1/earth/get/list')
      console.log(result)
      for (let i = 0; i < result.length; i++) {
          const element = result[i];
          this.arrNP.push({value: element, lable: element.nameEarthPoint })
        }
        console.log(this.requestJson, this.catalogJson)
      this.CreateSelectArr()
      DisplayLoad(false)
    }
  }
  </script>

<style lang="scss" scoped>
.main_contain{
  display: inline-flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 90%;
}
td{
  text-align: left;

}
th{
  border-bottom: 2px solid white;

}

.ChangeViewMode{
  position: fixed;
  padding: 0px;
  border: none;
  background: none;
  
  top: 50%;

  &.Left{
    left: 20px;
  }
  &.Right{
    right: 20px;
  }
  img{
    width: 30px;
  }
}
</style>
