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
    <div class="ContentDiv">
        <h1 class="TitleText">Эксперимент</h1>
        <div class="Panel">
            <div>Парамертры системы</div>
            <div class="SystemInfo">
                <table>
                  <tr><td>Начальное время расчетов:</td>
                      <td v-html="CreateDateTime(systemStatus.startTime)"></td>
                    </tr>
                    <tr><td>Начало горизонта моделирования:</td>
                      <td v-html="CreateDateTime(systemStatus.modelingBegin)"></td>
                    </tr>
                    <tr><td>Окончание горизонта моделирования:</td>
                      <td v-html="CreateDateTime(systemStatus.modelingEnd)"></td>
                    </tr>
                  </table>
            </div>
            <div>
              <button @click="viewmode=0" class="ButtonCommand">Заявки ДЗЗ</button>
              <button @click="viewmode=1" class="ButtonCommand">Каталог целей</button>
            </div>
        </div>
        <p v-if="viewmode == 0">Заявки</p>
        <div class="Panel" v-if="viewmode == 0">
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
              <td><SelectDiv  :dataOption="arrNP" :valueS="{value:data.earthPoint, lable:data.earthPoint.nameEarthPoint}" :id="String(index)" @valueSelect="SelectChangeNP"/></td>
              <td><input :id="index" name="priory" type="number" :value="data.priory"></td>
              <td><DateTime :valueUnix="data.time" :id="index" :name="'time'" @valueSelect="ChangeTime"/></td>
              <td><DateTime :valueUnix="data.term" :id="index" :name="'term'"  @valueSelect="ChangeTime"/></td>
              
              
              
              <td :id="index" @click="DeleteRowRequest(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
              </tr>
                <tr class="addRowButton">
                <td colspan="9"><button @click="AddRowRequest(catalogJson[0])"><img src="../../assets/add.png" alt="" class="addButtonIcon">Добавить заявку</button></td>
              </tr>   
            </table>
        </div>

        <p v-if="viewmode == 1">Каталог</p>
        <div class="Panel" v-if="viewmode == 1">
          <table class="TableDefault">
            <tr>
              <th>Цель</th><th>Заявки</th><th></th><th>Широта</th><th>Долгота</th><th>Высота</th><th></th>
            </tr>
            <tr v-for="data, index in catalogJson"
              :key="index"
              @change="ChangeParam"
              v-show="!(data.deleted==true)"
            >
              <td><input :id="index" name="goalName" type="text" :value="data.goalName"></td>
              <td style="text-align: center;">{{data.countRequest}}</td>
              <td><img @click="AddRowRequest(data)" src="../../assets/add.png" alt="" class="addButtonIcon"></td>  
              <td><input :id="index" name="lat" type="number" :value="data.lat"></td>
              <td><input :id="index" name="lon" type="number" :value="data.lon"></td>
              <td><input :id="index" name="alt" type="number" :value="data.alt"></td>
              <td :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
            </tr>
            <tr class="addRowButton">
              <td colspan="7"><button @click="AddRow"><img src="../../assets/add.png" alt="" class="addButtonIcon">Добавить</button></td>
            </tr> 
          </table>
        </div>
    </div>

    </div>
  </template>
  
  <script>

import {DisplayLoad, FetchGet, FetchPost} from '../../js/LoadDisplayMetod.js'
import { UnixToDtime } from '@/js/WorkWithDTime.js';
import SelectDiv from '../SelectDiv.vue'
import DateTime from '../DateTime.vue';

  export default {
    name: 'TargetDZZ',
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
      CreateDateTime(time){
          let Dtime = UnixToDtime(time)
          return Dtime.date + " " + Dtime.time
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
                      "orderId": this.requestJson.length + 1,
                      "priory": 3,
                      "term": this.systemStatus.modelingEnd,
                      "time": this.systemStatus.modelingBegin,
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
        for (let index = 0; index < this.catalogJson.length; index++) {
          this.catalogJson[index].countRequest = 0;
        }
        result = await FetchGet('/api/v1/satrequest/request/get/all')
        this.requestJson = result || {}
        for (let index = 0; index < this.requestJson.length; index++) {
          const element = this.requestJson[index].catalog.goalId
          for (let indexii = 0; indexii < this.catalogJson.length; indexii++) {
            if(element == this.catalogJson[indexii].goalId){
              this.catalogJson[indexii].countRequest++;
              break
            }
          }
        }
        result = await FetchGet('/api/v1/earth/get/list')
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            this.arrNP.push({value: element, lable: element.nameEarthPoint })
          }
          console.log(this.requestJson, this.catalogJson)
        this.CreateSelectArr()
        }
      
    },
    
    async mounted() {
      console.log(this.systemStatus)
      DisplayLoad(true)
      let result = await FetchGet('/api/v1/satrequest/catalog/get/all')
      this.catalogJson = result || {}
      for (let index = 0; index < this.catalogJson.length; index++) {
        this.catalogJson[index].countRequest = 0;
      }
      result = await FetchGet('/api/v1/satrequest/request/get/all')
      this.requestJson = result || {}
      for (let index = 0; index < this.requestJson.length; index++) {
        const element = this.requestJson[index].catalog.goalId
        for (let indexii = 0; indexii < this.catalogJson.length; indexii++) {
          if(element == this.catalogJson[indexii].goalId){
            this.catalogJson[indexii].countRequest++;
            break
          }
        }
      }
      result = await FetchGet('/api/v1/earth/get/list')
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
  
  .ContentDiv{
    height: 100%;
    overflow-y: unset; 
    overflow-x: unset;
  }
}
td{
  text-align: left;
  input[type=number]{
    width: 100%;
  }

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
.SystemInfo{
  display: flex;
  justify-content: center;
}
</style>
