<template>
  <div class="MapContain">
   <div id="DrawKARoad" class="PanelMenu">
            <SelectDiv  :dataOption="KAArray" :valueS="KatoDraw" :id="'KA'+String(0)" @valueSelect="ChangeKaDraw"/>
            <input type="color" id="inputColorKa" value="#5900ff"><button class="ButtonCommand" @click="GetKARoad">Отрисовать маршрут</button>
            <div class="LatLng"><span>Точка: {{ AddPoint.lat+', '+AddPoint.lng }}</span><button class="ButtonCommand" @click="StartAddPoint">Добавить</button></div>
            <button class="ButtonCommand reload" @click="ReloadMapContainer"><img src="@/assets/reload.png" alt="Сброс"></button>
    </div>
    <div id="Legend" class="PanelMenu">
            <div><table>
              <tbody>
                <tr><td><span class="circle NP"></span></td><td>Наземный пункт</td></tr>
                <tr><td><span class="circle Catalog"></span></td><td>Каталог</td></tr>
                <tr><td><span class="circle Request"></span></td><td>Заявка</td></tr>
                <tr><td><span class="circle Sat"></span></td><td>КА</td></tr>
              </tbody>
            </table></div>
      <div class="SatList">
        <div v-for="data, index in RoadKaList" :key="index" 
        >
          <span :style="'border-bottom: 1px solid ' + (data.color || 'black') +';'">{{ data.name }}</span>
          <span class="delete"><img src="@/assets/delete.svg" alt=" - " @click="DeleteRoad(data, index)"></span>
        </div>
      </div>
    </div>
    <div id="map"></div>
    <div class="AddPointDiv" v-if="AddPoint.showadd">
    <div class="PanelMenu" style="position: relative;">
      <div class="closeButton" @click="AddPoint.showadd=false"><img src="@/assets/close.svg" alt="закрыть"></div>
      <h1>Добавление точки</h1>
      <div>
        <table>
          <thead><tr><th>Название</th><th>Широта</th><th>Долгота</th></tr></thead>
          <tbody><tr>
            <td><input class="inputType1" type="text" placeholder="Введите название" v-model="AddPoint.name"></td>
            <td><input class="inputType1" type="number" placeholder="Введите широту" v-model="AddPoint.lat"></td>
            <td><input class="inputType1" type="number" placeholder="Введите долготу" v-model="AddPoint.lng"></td>
            <td></td>
          </tr></tbody>
        </table>
      </div>
      <div>
        <button class="ButtonCommand" @click="AddNP">Добавить НП</button>
        <button class="ButtonCommand" @click="AddRequest" :class="system.typeWorkplace == 3? 'disable':''" :disabled="system.typeWorkplace == 3">Добавить в каталог</button>
      </div>
      
    </div>
  </div>
  </div>
  
</template>

<script>
import SelectDiv from './SelectDiv.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';


export default {
  name: 'MapContain',

  data(){
      return{
        map: {},
        KatoDraw: {},
        KAArray: [],
        requestJson: [],
        NPList: [],OGList:[],catalogJson: [],system:{},
        AddPoint:{
          showadd: false,
          lat: 0,
          lng: 0,
          name: undefined,
          height: 0
        },
        RoadKaList:[]
    }
  },
  components:{
      SelectDiv,
  },
  methods: {
      async CreateMap(){
          this.map = {}
          console.log(await document.getElementById("map"))
          this.map = L.map('map', {zoomAnimation: true}).setView(new L.LatLng(55, 60), 3);
          L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', 
          {
            minZoom: 1, 
            maxZoom: 5,
            attribution: ''
          }).addTo(this.map);
          let DefaultIcon = new L.icon({
                iconUrl: icon,
                shadowUrl: shadow,
                iconRetinaUrl: icon2x
          });
          L.Marker.prototype.options.icon = DefaultIcon;
          this.catalogJson.forEach(element =>{
            L.circle([element.lat, element.lon], 38000, {
                color: 'yellow',
                fillColor: 'yellow',
                fillOpacity: 0.6
              }).addTo(this.map)
          })
          for (let i = 0; i < this.requestJson.length; i++) {
              const element = this.requestJson[i].catalog;
              L.circle([element.lat, element.lon], 41000, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.4
              }).addTo(this.map)
          }
          this.NPList.forEach(element => {
              L.circle([element.latitude, element.longitude], 45000, {
                color: 'green',
                fillColor: '#121100',
                fillOpacity: 0.4
              }).addTo(this.map)
          });
          this.map.on('click', (e) => {
              const { lat, lng } = e.latlng;
              this.AddPoint.lat = lat.toFixed(2)
              this.AddPoint.lng = lng.toFixed(2)
              console.log(`Широта: ${lat}, Долгота: ${lng}`);
          });

        },
        ChangeKaDraw(e){
          this.KatoDraw = e
        },
        StartAddPoint(){
          this.AddPoint.name = undefined
          this.AddPoint.showadd = true
        },
        async AddNP(){
          if(this.AddPoint.lat != '' && this.AddPoint.lng != '' && this.AddPoint.name != undefined){
            this.NPList.push({
              nameEarthPoint: this.AddPoint.name || "С карты",
              latitude: this.AddPoint.lat || 0,
              longitude: this.AddPoint.lng || 0,

            })
            await this.$ChangeNPList(this.NPList)
            L.circle([this.AddPoint.lat||0, this.AddPoint.lng||0], 40000, {
                  color: 'green',
                  fillColor: '#121100',
                  fillOpacity: 0.4
                }).addTo(this.map)
            this.AddPoint.showadd = false
          }
          else{
            this.$showToast('Проверьте корректность данных','warning', 'Добавление НП');
          }
        },
        async AddRequest(){
          if(this.AddPoint.lat != '' && this.AddPoint.lng != '' && this.AddPoint.name != undefined){
            this.catalogJson.push({
              goalName: this.AddPoint.name || "С карты",
              lat: this.AddPoint.lat || 0,
              lon: this.AddPoint.lng || 0,
              alt: 0, goalId: 0 
            })
            await this.$FetchPost("/api/v1/satrequest/catalog/update", this.catalogJson)
            L.circle([this.AddPoint.lat||0, this.AddPoint.lng||0], 28000, {
                color: 'yellow',
                fillColor: 'yellow',
                fillOpacity: 0.8
              }).addTo(this.map)
            this.AddPoint.showadd = false
          }
          else{
            this.$showToast('Проверьте корректность данных','warning', 'Добавление в каталог');
          }
        },
        async GetKARoad(){
          this.$showLoad(true);
          if (this.KatoDraw.value == null) {
            let roads = await this.$FetchGet("/api/v1/pro42/gps/all") || []
            let colorid = 0
            let colors = ['#ff0000','#00ff00','#0000ff','#ffff00','#00ffff','#990000','#009900','#999900','#000099','#ffcc00','#00ffcc','#cc0000','#00cc00','#cccc00','#0000cc','#ee0000','#00ee00','#eeee00','#00eeee','#aaaa00']
            roads.forEach(road => {
              let name = road.satelliteId
              this.KAArray.forEach(sat => {
                if(sat.value != null){
                  if(sat.value.satelliteId == road.satelliteId){
                    name = sat.value.name
                  }
                }
              })
              this.DrowRoad(road.coordinates,colors[colorid], name)
              colorid++
            });
          }
          else{
            let color = document.getElementById("inputColorKa").value
            let road = await this.$FetchPost("/api/v1/pro42/gps/sat", {}, "satelliteId="+this.KatoDraw.value.satelliteId) || []
            this.DrowRoad(road,color, this.KatoDraw.value.name)
          }
          this.$showLoad(false);
        },
        DrowRoad(road,color,nameKA){
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
              
              arrayPoint[line_index].push({lat:element.latitude, lng: element.longitude})
            }
            let point = arrayPoint[line_index][arrayPoint[line_index].length-1]
            let roadSat = L.polyline(arrayPoint, {color: color + "d4", weight: 2}).addTo(this.map);
            let pointSat = L.circle([point.lat, point.lng], 85000, {color: "#0000ff69", fillOpacity: 0.3, fillColor: 'blue'}).addTo(this.map)
            this.RoadKaList.push({name: nameKA, color: color, road:roadSat, point: pointSat})
        },
        DeleteRoad(data, index){
          this.RoadKaList.splice(index, 1)
          this.map.removeLayer(data.road)
          this.map.removeLayer(data.point)
        },
        async ReloadMapContainer(){
          this.map.off();
          this.map.remove();
          this.CreateMap()
        }

    },
    async mounted() {
      this.NPList = await this.$NPList()
      this.OGList = await this.$OGList()
      this.catalogJson = await this.$FetchGet('/api/v1/satrequest/catalog/get/all') || []
      this.system = await this.$SystemObject()
      this.KAArray.push({value: null, lable: "Все КА" })
      this.OGList.forEach(OG => {
        OG.satellites.forEach(element =>{
          this.KAArray.push({value: element, lable: element.name })
        })
      });
      this.KatoDraw = this.KAArray[0]
      this.requestJson = await this.$FetchGet('/api/v1/satrequest/request/get/all') || []
      this.CreateMap()
    },
}

</script>


<style lang="scss">
.MapContain{
  position: relative;
  flex: 1;
}
.AddPointDiv{
    position: absolute;
    top: 0px;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .PanelMenu{
      animation: 0.1s ease-out 0s 1 slideInFromTop;
      .closeButton{
        position: absolute;
        right: 10px;
        top: 10px;
        img{
          width: 20px;
        }
      }
    }
}

#Legend{
  position: absolute;
  left: 5px;
  bottom: 5px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 5px;
  table{
    tr{
      td{
        text-align: left;
        padding-left: 5px;
        .circle{
          width: 10px;
          height: 10px;
          display: block;
          border-radius: 50px;
          &.NP{
            background-color: green;
          }
          &.Catalog{
            background-color: yellow;
          }
          &.Request{
            background-color: red;
          }
          &.Sat{
            background-color: blue;
          }
        }
      }
    }
  }
  .SatList{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-height: 200px;
    overflow-y: auto;
    div{
      border-radius: 5px;
      margin: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .delete{
        width: 25px;
      }
    }
  }
  
}

#DrawKARoad{
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 5px 5px;

  #inputColorKa{
  height: 50px;
  width: 80px;
  border: none;
  padding: 2px;
  margin: 0px 5px;
  }
  .ButtonCommand{
    margin: 5px;
    &.reload{
      margin: 3px;
      img{
         width: 20px;
      }
    }
  }
}
#map{
    background-color: var(--color-bg-panel);
    position: relative;
    outline-style: none;
    height: calc(100% - 14px);
    margin: 7px;
    z-index: 0;
    border-radius: 10px;
  .leaflet-map-pane{
            pointer-events: none;
        }
  .leaflet-bottom {
    &.leaflet-right{
      display: none;
    }
  }
  .leaflet-attribution-flag{
    width: 0 !important;
  }
  
}
.leaflet-bottom{
    display: none !important;
  }
.LatLng{
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--background-Button1);
    padding: 5px;
    border-radius: 10px;
    margin-right: 5px;
    min-width: 260px;
    span{
      white-space: nowrap;
      color: var(--color-Main);
    }
    button{
      border: none;
      background: none;
    }
}
</style>
