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
            <button class="ChangeViewMode Left" v-if='viewmode > 0' @click="CreateMap">
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
              <button @click="CreateMap" class="ButtonCommand">Заявки ДЗЗ</button>
              <button @click="viewmode=1" class="ButtonCommand">Каталог целей</button>
            </div>
        </div>
        <p v-if="viewmode == 0">Заявки</p>
        <div class="Panel" v-if="viewmode == 0">
            <table class="TableDefault">
              <tr>
                <th>№</th><th>Цель</th><th>Широта</th><th>Долгота</th><th>Высота</th><th>НП</th><th>Критерий</th><th>Приоритет</th><th>Время появления</th><th>Срок выполнения</th><th></th>
              </tr>
              <tr
              v-for="data, index in requestJson"
                :key="index"
                @change="ChangeParamRequest"
                v-show="!(data.deleted==true)"
              >
              <td>{{ index }}</td>
              <td><SelectDiv  :dataOption="arr" :valueS="{value:data.catalog, lable:data.catalog.goalName}" :id="String(index)" @valueSelect="SelectChange"/></td>
              <td>{{ data.catalog.lat }}</td>
              <td>{{ data.catalog.lon }}</td><td>{{ data.catalog.alt }}</td>
              <td><SelectDiv  :dataOption="arrNP" :valueS="{value:data.earthPoint, lable:data.earthPoint.nameEarthPoint}" :id="String(index)" @valueSelect="SelectChangeNP"/></td>
              <td><SelectDiv  :dataOption="choiceCriteriaArr" :valueS="choiceCriteriaArr[data.choiceCriteria-1]" :id="String(index)" @valueSelect="SelectChangeCriteria"/></td>
              <td><input :id="index" name="priory" type="number" :value="data.priory"></td>
              <td><DateTime :valueUnix="data.time" :id="String(index)" :name="'time'" @valueSelect="ChangeTime"/></td>
              <td><DateTime :valueUnix="data.term" :id="String(index)" :name="'term'"  @valueSelect="ChangeTime"/></td>
              
              <td :id="index" @click="DeleteRowRequest(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
              </tr>
                <tr class="addRowButton">
                <td colspan="9"><button @click="AddRowRequest(catalogJson[0])"><img src="../../assets/add.png" alt="" class="addButtonIcon">Добавить заявку</button></td>
              </tr>   
            </table>
            <div>
              <div id="DrawKARoad">
                <SelectDiv  :dataOption="KAArray" :valueS="SelectKa" :id="'KA'+String(0)" @valueSelect="ChangeKaDraw"/>
                <input type="color" id="inputColorKa" value="#5900ff"><button class="ButtonCommand" @click="GetKARoad">Отрисовать маршрут</button></div>
              <div id="map"></div>
            </div> 
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
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

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

        KAArray: [],
        SelectKa: {},
        KatoDraw: {},

        choiceCriteriaArr: [{value: 1, lable: 'Время'},{value: 2, lable: 'Разворот'},{value: 3, lable: 'Качество'}],

        arr: [],
        arrNP: [],
        map: {},
        mapPoint: []
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
          return Dtime.date + " " + Dtime.time + " МСК"
        },
      ChangeTime(obgtime){
        this.requestJson[obgtime.id][obgtime.name] = obgtime.time
        this.SatartSave('request')
      },
      SelectChange(e){
        console.log(e,  this.requestJson)
        this.requestJson[e.id].catalog = e.value
        this.SatartSave('request')
      },
      SelectChangeNP(e){
        console.log(e,  this.requestJson)
        this.requestJson[e.id].earthPoint = e.value
        this.SatartSave('request')
      },
      SelectChangeCriteria(e){
        console.log(e,  this.requestJson)
        this.requestJson[e.id].choiceCriteria = e.value
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
                      "choiceCriteria": 1,
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
          await FetchPost("/api/v1/satrequest/request/update", this.requestJson)
          await this.ReFetch()
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
        this.arrNP = []
        let result = await FetchGet('/api/v1/satrequest/catalog/get/all') || []
        this.catalogJson = result || {}
        for (let index = 0; index < this.catalogJson.length; index++) {
          this.catalogJson[index].countRequest = 0;
        }
        result = await FetchGet('/api/v1/satrequest/request/get/all') || []
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
        result = await FetchGet('/api/v1/earth/get/list') || []
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            this.arrNP.push({value: element, lable: element.nameEarthPoint })
          }
          console.log(this.requestJson, this.catalogJson)
        this.CreateSelectArr()
        },
        async CreateMap(){
          this.viewmode = 0
          this.map = {}
          console.log(await document.getElementById("map"))

          this.map = L.map('map').setView(new L.LatLng(59.932936, 30.311349), 4);
          L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', 
          {
            minZoom: 2, 
            maxZoom: 15,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(this.map);
          let DefaultIcon = new L.icon({
                iconUrl: icon,
                shadowUrl: shadow,
                iconRetinaUrl: icon2x
          });
          L.Marker.prototype.options.icon = DefaultIcon;
          this.mapPoint = []
          for (let i = 0; i < this.requestJson.length; i++) {
              const element = this.requestJson[i].catalog;
              console.log(element)
              this.mapPoint.push(L.circle([element.lat, element.lon], 21000, {
                color: 'blue',
                fillColor: '#f03',
                fillOpacity: 0.1
              }).addTo(this.map))
          }
          
          this.arrNP.forEach(element => {
            console.log(element.value)
            console.log(element)
              this.mapPoint.push(L.circle([element.value.latitude, element.value.longitude], 17000, {
                color: 'green',
                fillColor: '#121100',
                fillOpacity: 0.4
              }).addTo(this.map))
          });
        },
        ChangeKaDraw(e){
          this.KatoDraw = e.value
        },
        async GetKARoad(){
          DisplayLoad(true)
          let color = document.getElementById("inputColorKa")
          let colors = ['#ff0000','#00ff00','#0000ff','#ffff00','#00ffff','#990000','#009900','#999900','#000099','#ffcc00','#00ffcc','#cc0000','#00cc00','#cccc00','#0000cc','#ee0000','#00ee00','#eeee00','#00eeee','#aaaa00']
          if (this.KatoDraw == undefined) {
            let roads = await FetchGet("/api/v1/modelling/gps/coordinates") || []
            console.log(roads)
            let colorid = 0
            roads.forEach(road => {
              let arrayPoint = []
              for (let index = 0; index < road.coordinates.length; index+=1) {
                const element = road.coordinates[index];
                arrayPoint.push({lat: element.latitude, lng: element.longitude})
              }
              L.polyline(arrayPoint, {color: colors[colorid] + "d4", weight: 2}).addTo(this.map);
              colorid++
            });

          }
          else{
            //console.log(this.KatoDraw, color.value)
            let road = await FetchPost("/api/v1/modelling/gps/sat/coordinates", {}, "satelliteId="+this.KatoDraw.satelliteId) || []
            //console.log(road, this.map, new L.LatLng(59.932936, 30.311349))
            let arrayPoint = []
            for (let index = 0; index < road.length; index+=1) {
              const element = road[index];
              arrayPoint.push({lat: element.latitude, lng: element.longitude})
            }
            L.polyline(arrayPoint, {color: color.value + "d4", weight: 2}).addTo(this.map);
          }
          DisplayLoad(false)
        }
      
    },
    
    async mounted() {
      //console.log(this.systemStatus)
      DisplayLoad(true)

      let Ka = await FetchGet('/api/v1/constellation/get/list') || []
      this.KAArray.push({value: undefined, lable: "Все КА" })
      Ka.forEach(OG => {
        OG.satellites.forEach(element =>{
          this.KAArray.push({value: element, lable: OG.constellationName + "-" + element.idNode })
        })
      });
      this.SelectKa = this.KAArray[0]
      this.KatoDraw = this.SelectKa.value
      //console.log(this.KAArray)

      let result = await FetchGet('/api/v1/satrequest/catalog/get/all') || []
      this.catalogJson = result || {}
      for (let index = 0; index < this.catalogJson.length; index++) {
        this.catalogJson[index].countRequest = 0;
      }
      result = await FetchGet('/api/v1/satrequest/request/get/all') || []
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
      result = await FetchGet('/api/v1/earth/get/list') || []
      for (let i = 0; i < result.length; i++) {
          const element = result[i];
          this.arrNP.push({value: element, lable: element.nameEarthPoint })
        }
        //console.log(this.requestJson, this.catalogJson)
      this.CreateSelectArr()
      DisplayLoad(false)
      this.CreateMap()
    },
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
#map{
  background-color: #2b2b2b;
  position: relative;
    outline-style: none;
    height: 80vh;
    width: 94%;
    left: 3%;
    right: 3%;
  .leaflet-map-pane{
            pointer-events: none;
        }
}

#DrawKARoad{
  display: flex;
  align-items: center;
  padding: 5px 20px;
  margin: 0px 40px;

  #inputColorKa{
  height: 50px;
  width: 100px;
  padding: 0px;
  margin: 5px 40px;
  }
  .ButtonCommand{
    margin: 5px 40px;
  }

  
  
}
</style>
