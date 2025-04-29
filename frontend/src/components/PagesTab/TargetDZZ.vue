<template>
    <div class="main_contain RowSection">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
            <div class="TitleText">Заявки</div>
          </div>
    <div class="ContentDiv">
        <div class="Panel LeftPanel">
            <div>Парамертры системы</div>
            <div class="SystemInfo">
              <table><tbody>
                <tr><th>Начальное время расчетов:</th></tr>
                      <tr><td v-html="CreateDateTime(systemStatus.startTime)"></td></tr>
                  <tr><th>Начало горизонта моделирования:</th></tr>
                      <tr><td v-html="CreateDateTime(systemStatus.modelingBegin)"></td></tr>
                  <tr><th>Окончание горизонта моделирования:</th></tr>
                      <tr><td v-html="CreateDateTime(systemStatus.modelingEnd)"></td></tr>
                </tbody></table>
            </div>
            <div class="FlexColumn">
              <div v-if="!(systemStatus.typeWorkplace in {4:null,5:null})"><button @click="viewmode=0" class="ButtonCommand">Заявки ДЗЗ</button></div>
              <div v-if="!(systemStatus.typeWorkplace in {4:null,5:null})"><button @click="viewmode=1" class="ButtonCommand">Каталог целей</button></div>
              <div v-if="(systemStatus.typeWorkplace in {4:null,5:null})"><button @click="viewmode=2" class="ButtonCommand">Данные по заявкам</button></div>
              <div><button @click="CreateMap" class="ButtonCommand">Карта</button></div>
            </div>
        </div>
        <div class="Panel RightPanel" >
          <div v-if="viewmode == 0">
            <table class="TableDefault">
              <thead><tr><th>Цель</th><th>Широта</th><th>Долгота</th><th>Высота</th><th>НП</th><th>Критерий</th><th>Приоритет</th><th>Время появления</th><th>Срок выполнения</th><th v-if="systemStatus.typeWorkplace in {3:null,4:null}">Признак</th><th></th></tr></thead>
              <tbody><tr
              v-for="data, index in requestJson"
                :key="index"
              >
              <td><SelectDiv  :dataOption="arr" :valueS="{value:data.catalog, lable:data.catalog.goalName}" :id="String(index)" @valueSelect="SelectChange($event, 'catalog')"/></td>
              <td>{{ data.catalog.lat }}</td>
              <td>{{ data.catalog.lon }}</td><td>{{ data.catalog.alt }}</td>
              <td><SelectDiv  :dataOption="arrNP" :valueS="{value:data.earthPoint, lable:data.earthPoint.nameEarthPoint}" :id="String(index)" @valueSelect="SelectChange($event, 'earthPoint')"/></td>
              <td><SelectDiv  :dataOption="choiceCriteriaArr" :valueS="choiceCriteriaArr[data.choiceCriteria-1]" :id="String(index)" @valueSelect="SelectChange($event, 'choiceCriteria')"/></td>
              <td><input type="number" v-model="data.priory" @change="ChangeParamRequest"></td>
              <td><DateTime :valueUnix="data.time" :id="String(index)" :name="'time'" @valueSelect="ChangeTime"/></td>
              <td><DateTime :valueUnix="data.term" :id="String(index)" :name="'term'"  @valueSelect="ChangeTime"/></td>
              <td v-if="systemStatus.typeWorkplace in {3:null}"><SelectDiv  :dataOption="TypeRequest" :valueS="TypeRequest[data.type]" :id="String(index)" @valueSelect="SelectChange($event, 'type')"/></td>
              <td :id="index" @click="DeleteRowRequest(index)" class="delete"><img class="iconDelete" src="../../assets/delete.svg" alt="-"></td>
              </tr>
              <tr class="addRowButton">
                <td colspan="9"><button @click="AddRowRequest(catalogJson[0])"><img src="../../assets/add.png" alt="" class="addButtonIcon">Добавить заявку</button></td>
                <td v-if="systemStatus.typeWorkplace in {3:null,4:null}"></td>
                <td v-if="requestJson.length > 0"><button @click="LoadXLSX('request')" class="LoadExel"><img src="../../assets/excel.png"><span>&#8203;</span></button></td>
              </tr>   
            </tbody></table>
          </div>

          <div v-if="viewmode == 1">
          <table class="TableDefault">
          <thead><tr><th>Цель</th><th>Заявки</th><th>Широта</th><th>Долгота</th><th>Высота</th><th></th></tr></thead>
          <tbody><tr v-for="data, index in catalogJson"
              :key="index"
              @change="ChangeParam"
              v-show="!(data.deleted==true)">
              <td><input type="text" v-model="data.goalName"></td>
              <td style="display: flex;align-items: center;justify-content: space-around;"><span>{{data.countRequest}}</span><img @click="AddRowRequest(data)" src="../../assets/add.png" alt="" class="addButtonIcon"></td>
              <td><input type="number" v-model="data.lat"></td>
              <td><input type="number" v-model="data.lon"></td>
              <td><input type="number" v-model="data.alt"></td>
              <td :id="index" @click="DeleteRow(index)" class="delete"><img class="iconDelete" src="../../assets/delete.svg" alt="-"></td>
            </tr>
            <tr class="addRowButton">
              <td colspan="6"><button @click="AddRow"><img src="../../assets/add.png" alt="" class="addButtonIcon">Добавить</button></td>
            </tr> 
          </tbody></table>
        </div>


        <div v-if="viewmode == 2">
          <table class="TableDefault">
            <thead><tr><th>Имя</th><th>МКА</th><th>Объём, Мбайт</th><th>Приоритет</th><th>Время появления</th><th></th></tr></thead>
            <tbody><tr v-for="data, index in datarequest"
              :key="index"
              @change="ChangeParamdatarequest"
              v-show="!(data.deleted==true)"
            >
              <td><input type="text" v-model="data.name"></td>
              <td><SelectDiv  :dataOption="datarequestКАList" :valueS="{lable: data.satellite.name, value: data.satellite.nodeId}" :id="index" @valueSelect="ChangeKadatarequest"/></td>
              <td><input type="number" v-model="data.capacity"></td>
              <td><input type="number" v-model="data.priority"></td>
              <td><DateTime :valueUnix="data.time" :id="String(index)" :name="'timedatarequest'" @valueSelect="ChangeTimedatarequest"/></td>
              <td :id="index" @click="DeleteRowdatarequest(index)" class="delete"><img class="iconDelete" src="../../assets/delete.svg" alt="-"></td>
            </tr></tbody>
            <tbody><tr class="addRowButton">
              <td colspan="5"><button @click="CreateNewdatarequest"><img src="../../assets/add.png" alt="" class="addButtonIcon">Добавить</button></td>
              <td v-if="datarequest.length > 0"><button @click="LoadXLSX('datarequest')" class="LoadExel"><img src="../../assets/excel.png"><span>&#8203;</span></button></td>
            </tr> 
            </tbody></table>
        </div>

        <div v-if="viewmode == 3">
          <div id="DrawKARoad">
            <SelectDiv  :dataOption="KAArray" :valueS="SelectKa" :id="'KA'+String(0)" @valueSelect="ChangeKaDraw"/>
            <input type="color" id="inputColorKa" value="#5900ff"><button class="ButtonCommand" @click="GetKARoad">Отрисовать маршрут</button>
            <label class="input-file">
              <input type="file" name="file" id="file" @change="LoadFileKARoad" enctype="multipart/form-data">		
              <span>Отрисовать из файла</span>
            </label>
            <button class="ButtonCommand" @click="ReloadMapContainer">Обновить карту</button>
          </div>
          <div id="map"></div>
        </div>
        </div>  
    </div>
  </div>
</template>
  
  <script>

import {DisplayLoad, FetchGet, FetchPost} from '../../js/LoadDisplayMetod.js'
import { PagesSettings } from './PagesSettings';
import { OGList, NPList } from '@/js/GlobalData.js';
import SelectDiv from '../SelectDiv.vue'
import DateTime from '../DateTime.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import XLSX from 'xlsx-js-style';

  export default {
    name: 'TargetDZZ',
    mixins: [PagesSettings],
    components:{
      SelectDiv,
      DateTime
    },
    data(){
      return{
        viewmode: 0,
        catalogJson: [],
        selectCatalog: null,

        datarequest: [],
        datarequestКАList: [],
        requestJson: [],
        KAArray: [],
        SelectKa: {},
        KatoDraw: {},
        choiceCriteriaArr: [{value: 1, lable: 'Время'},{value: 2, lable: 'Разворот'},{value: 3, lable: 'Качество'}],
        TypeRequest: [{value: 0, lable: 'в НП'},{value: 1, lable: 'Лидером'}],
        arr: [],
        arrNP: [],
        map: {},
      }
    },
    methods: {
      ChangeTime(obgtime){
        this.requestJson[obgtime.id][obgtime.name] = obgtime.time
        this.SatartSave('request')
      },
      SelectChange(e, param){
        this.requestJson[e.id][param] = e.value
        this.SatartSave('request')
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
        if(this.systemStatus.typeWorkplace in {3:null,4:null}){
          addedRow.type = 0
        }
            this.requestJson.push(addedRow);   
            this.SatartSave('request')
      },
      DeleteRowRequest(index){
              this.requestJson[index].deleted = true
              this.SatartSave('request')
          },
      ChangeParamRequest(){
        this.SatartSave('request')
      },
      ChangeTimedatarequest(e){  // изменение времени в данных по заявкам
        this.datarequest[e.id].time = e.time
        this.SatartSave('datarequest')
      },
      ChangeKadatarequest(e){ // изменение выбранного ка в данных по заявкам
        this.datarequest[e.id].satellite.id = e.value
        this.SatartSave('datarequest')
      },
      CreateNewdatarequest(){ // Данные по заявкам добавление
        var addedRow = {
                    "capacity": 100,
                    "priority": 3,
                    "time" : this.systemStatus.modelingBegin,
                    "satellite":  {id: this.datarequestКАList[0].value},
                    "deleted": null
                };
        this.datarequest.push(addedRow)
        this.SatartSave('datarequest')
        console.log(addedRow)
      },
      DeleteRowdatarequest(index){ //удаление из данные по заявкам
        this.datarequest[index].deleted = true
        this.SatartSave('datarequest')
      },
      ChangeParamdatarequest(){ // this.datarequest изменении параметров данных по заявкам
          this.SatartSave('datarequest')
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
      ChangeParam(){
        this.SatartSave('catalog')
      },
      DeleteRow(index){
              this.catalogJson[index].deleted = true
              this.SatartSave('catalog')
          },
      async SatartSave(target){
        if(target == 'catalog'){await FetchPost("/api/v1/satrequest/catalog/update", this.catalogJson)}
        if(target == 'request'){await FetchPost("/api/v1/satrequest/request/update", this.requestJson)}
        if(target == 'datarequest'){await FetchPost("/api/v1/satrequest/data/update", this.datarequest)}
        await this.ReFetch()
      },
      
      async LoadFileKARoad(data){
        const reader = new FileReader();
        if (data.target.files[0]) {
          var file = data.target.files[0];
          reader.readAsText(file);
          reader.addEventListener('load', () => {
            let dataFile = reader.result.split("\n")
            let dataFormat = [[]]
            let line_index = 0
            for (let index = 1; index < dataFile.length; index++) {
              const element = dataFile[index].split(" ");
              let lat = Number(element[0])
              let lng = Number(element[1])
              if (!isNaN(lat) && !isNaN(lng)) {
                if (dataFormat[line_index].length > 0) {
                  if(dataFormat[line_index][dataFormat[line_index].length-1].lng * lng < -6){
                    line_index++
                    dataFormat.push([])
                  }
                }
                dataFormat[line_index].push({lat: lat*180/Math.PI, lng: lng*180/Math.PI}) 
              }
            }
            const color = document.getElementById("inputColorKa").value
            dataFormat.forEach(dataRoad =>{
              L.polyline(dataRoad, {color: color + "d4", weight: 2}).addTo(this.map);
            })
            
          });
          reader.addEventListener('error', () => {
            console.error(`Произошла ошибка при чтении файла`);
          });
        }
      },
      async ReFetch(){
        this.datarequest = await FetchGet('/api/v1/satrequest/data/get/all') || []
        this.catalogJson = await FetchGet('/api/v1/satrequest/catalog/get/all') || []
        for (let index = 0; index < this.catalogJson.length; index++) {
          this.catalogJson[index].countRequest = 0;
        }
        this.requestJson = await FetchGet('/api/v1/satrequest/request/get/all') || []
        for (let index = 0; index < this.requestJson.length; index++) {
          const element = this.requestJson[index].catalog.goalId
          for (let indexii = 0; indexii < this.catalogJson.length; indexii++) {
            if(element == this.catalogJson[indexii].goalId){
              this.catalogJson[indexii].countRequest++;
              break
            }
          }
        }
        this.CreateSelectArr()
        },
        async CreateMap(){
          this.viewmode = 3
          this.map = {}
          console.log(await document.getElementById("map"))
          this.map = L.map('map').setView(new L.LatLng(59.932936, 30.311349), 2);
          L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', 
          {
            minZoom: 2, 
            maxZoom: 5,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(this.map);
          let DefaultIcon = new L.icon({
                iconUrl: icon,
                shadowUrl: shadow,
                iconRetinaUrl: icon2x
          });
          L.Marker.prototype.options.icon = DefaultIcon;
          for (let i = 0; i < this.requestJson.length; i++) {
              const element = this.requestJson[i].catalog;
              L.circle([element.lat, element.lon], 21000, {
                color: 'blue',
                fillColor: '#f03',
                fillOpacity: 0.4
              }).addTo(this.map)
          }
          
          this.arrNP.forEach(element => {
              L.circle([element.value.latitude, element.value.longitude], 17000, {
                color: 'green',
                fillColor: '#121100',
                fillOpacity: 0.4
              }).addTo(this.map)
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
            let roads = await FetchGet("/api/v1/pro42/gps/all") || []
            let colorid = 0
            roads.forEach(road => {
              let arrayPoint = [[]]
              let line_index = 0
              for (let index = 0; index < road.coordinates.length; index+=1) {
                const element = road.coordinates[index];
                if (arrayPoint[line_index].length > 0) {
                  if(arrayPoint[line_index][arrayPoint[line_index].length-1].lng * element.longitude < -1000){
                    line_index++
                    arrayPoint.push([])
                  }
                }
                arrayPoint[line_index].push({lat: element.latitude, lng: element.longitude})
              }
              arrayPoint.forEach(dataRoad => {
                L.polyline(dataRoad, {color: colors[colorid] + "d4", weight: 2}).addTo(this.map);
              })
              colorid++
            });

          }
          else{
            let road = await FetchPost("/api/v1/pro42/gps/sat", {}, "satelliteId="+this.KatoDraw.satelliteId) || []
            let arrayPoint = [[]]
            let line_index = 0
            for (let index = 0; index < road.length; index+=1) {
              const element = road[index];
              if (arrayPoint[line_index].length > 0) {
                  if(arrayPoint[line_index][arrayPoint[line_index].length-1].lng * element.longitude < -1000){
                    line_index++
                    arrayPoint.push([])
                  }
                }
              arrayPoint[line_index].push({lat: element.latitude, lng: element.longitude})
            }
            L.polyline(arrayPoint, {color: color.value + "d4", weight: 2}).addTo(this.map);
          }
          DisplayLoad(false)
        },
        LoadXLSX(mode='request'){
          const workbook = XLSX.utils.book_new();
          let data = []
          if(mode == 'request')
          {
            data = [["Цель","Широта","Долгота","Высота","НП","Критерий","Приоритет","Время появления","Срок выполнения"]]
            if(this.systemStatus.typeWorkplace in {3:null,4:null}){
              data[0].push("Признак")
            }
            this.requestJson.forEach(element => {
              let crit = "Время"
              if(element.choiceCriteria == 2) crit = "Разворот"
              if(element.choiceCriteria == 3) crit = "Качество"
              let row = [element.catalog.goalName, element.catalog.lat, element.catalog.lon, element.catalog.alt,
                element.earthPoint.nameEarthPoint, crit, element.priory, this.CreateDateTime(element.time), this.CreateDateTime(element.term)
              ]
              if(this.systemStatus.typeWorkplace in {3:null,4:null}){
                row.push(this.TypeRequest[element.type].lable)
              }
              data.push(row)
            });
          }
          else{
            data = [["Имя","МКА","Объём, Мбайт","Приоритет","Время появления"]]
            this.datarequest.forEach(element => {
              data.push([element.name,element.satellite.name,element.capacity,element.priority,this.CreateDateTime(element.time)])
            });
          }
          console.log(data)
          let worksheet = XLSX.utils.aoa_to_sheet(data); // Создаем таблицу в файле с данными из массива
          workbook.SheetNames.push('Data'); // Добавляем лист с названием First list
          let style = {
            font: {
              name: 'Calibri',
              sz: 12,
              bold: true,
                  color: {rgb: '000000'} // red font
            },
            border: {
              bottom: { style: 'thin', color: { rgb: '000000' } }
            }}
          let keylist = Object.keys(worksheet)
          for (let keyid = 0; keyid < keylist.length; keyid++) {
            const key = keylist[keyid];
            console.log(worksheet[key].v, keylist, data[0])
            try {
              if (data[0].indexOf(worksheet[key].v) != -1) {
                worksheet[key].s = style
              }
            } catch (error) {
              console.log(error)
            }
          }
          console.log(worksheet)
          workbook.Sheets['Data'] = worksheet;
          XLSX.writeFile(workbook, 'dataRequest.xlsx');
        },
        ReloadMapContainer(){
          this.map.off();
          this.map.remove();
          this.CreateMap()
        }
      
    },
    
    async mounted() {
      DisplayLoad(true)
      if(this.systemStatus.typeWorkplace in {4:null, 5:null}){
        this.viewmode = 2
      }
      NPList.forEach(element => {
        this.arrNP.push({value: element, lable: element.nameEarthPoint })
      })
      await this.ReFetch()
      //далее всё для карты
      this.KAArray.push({value: undefined, lable: "Все КА" })
      this.datarequestКАList = []
      OGList.forEach(OG => {
        OG.satellites.forEach(element =>{
          this.KAArray.push({value: element, lable: OG.constellationName + "-" + element.name })
          this.datarequestКАList.push({value: element.satelliteId, lable: element.name })
        })
      });
      this.SelectKa = this.KAArray[0]
      this.KatoDraw = this.SelectKa.value
      DisplayLoad(false)
    },
  }
  </script>

<style lang="scss" scoped>

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
#map{
  background-color: #2b2b2b;
  position: relative;
    outline-style: none;
    height: 75vh;
  margin: 10px;
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

.LoadExel{
  padding: 0px !important;
  width: fit-content !important;
  height: fit-content !important;
  img{
    width: 30px;
  }
}

</style>
