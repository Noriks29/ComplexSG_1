<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
          
    <div class="ContentDiv">
        <h1 class="TitleText">Маршрут обхода целей</h1>
        <div class="Panel">
          <table  style="border-bottom: 1px solid white;">
              <tr><td>Начальное время расчетов:</td><td v-html="CreateDateTime(systemStatus.startTime)"></td></tr>
              <tr><td>Начало горизонта моделирования:</td><td v-html="CreateDateTime(systemStatus.modelingBegin)"></td></tr>
              <tr><td>Окончание горизонта моделирования:</td><td v-html="CreateDateTime(systemStatus.modelingEnd)"></td></tr>
          </table>
          <p>Цели</p>
          <table style="width: 100%;">
            <tr
                v-for="data, index in purposesJson"
                :key="index"
            >
                <td> {{ index }}</td>
                <td> {{ data.catalog.goalName }}</td>
                <td> {{ data.catalog.lat }}</td>
                <td> {{ data.catalog.lon }}</td>
                <td> {{ data.catalog.alt }}</td>
            </tr>
          </table>
        </div>
        <div class="Panel MaxWidth">
            <div class="flexrow">
            <button class="ButtonCommand">Найти маршруты</button>
            <div>Маршрут 1 из N</div>
            <button class="ButtonCommand">Показать на карте</button>
        </div>
        <div class="MiniMapPanel">
          <div id="map" style="width: 90vw; height: 500px;"></div>
          тут типо карта

        </div>
        </div>

    </div>

    </div>
  </template>
  
  <script>

import {DisplayLoad, FetchGet} from '../../js/LoadDisplayMetod.js'
import {UnixToDtime} from "../../js/WorkWithDTime.js";
import MainStyle from '../../style/component.scss'
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import "leaflet/dist/leaflet.css";

  export default {
    name: 'TargetRoad',
    css:{
      MainStyle
    },
    props:{
        systemStatus:{
            type: Object
        },
    },
    data(){
      return{
        purposesJson: [],
        catalogList: []
      }
    },
    methods: {
        async StartModelling(){

        },
        CreateDateTime(time){
          let Dtime = UnixToDtime(time)
          return Dtime.date + " " + Dtime.time
        },
        SelectComponent(nameComponent) {
          this.$emit('updateParentComponent', {
              nameComponent: nameComponent
          })
        },
    },
    
    async mounted() {
        DisplayLoad(true)
        let result = await FetchGet('/api/v1/satrequest/request/get/all')
        this.purposesJson = result
        var map = L.map('map').setView(new L.LatLng(59.932936, 30.311349), 4);
        L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', 
        {
            foo: 'bar', 
            key: '383118983d4a867dd2d367451720d724',
            minZoom: 2, 
            maxZoom: 15,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        let DefaultIcon = new L.icon({
        iconUrl: icon,
        shadowUrl: shadow,
        iconRetinaUrl: icon2x
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        for (let index = 0; index < this.purposesJson.length; index++) {
          const element = this.purposesJson[index];
          L.marker([element.catalog.lat, element.catalog.lon], {opacity: 0.5}).addTo(map);
        }
        var linecount = this.purposesJson.length - 1
        if(linecount > 1){
          let colorArr = ["#00FF00"]
          let color = [0, 255, 0]
          let step =  Math.floor(570 / linecount)
          for (let index = 1; index < linecount; index++) {
            color[0] += step
            if(color[0] > 255){
              color[1] -= color[0] - 255
              color[0] = 255
            }
            let r = Number(color[0]).toString(16)
            if(r.length< 2) {r = "0"+r}
            let g = Number(color[1]).toString(16)
            if(g.length< 2) {g = "0"+g}
            colorArr.push("#"+r+g+Number(color[2]).toString(16)+"0")
          }
          for (let index = 0; index < this.purposesJson.length-1; index++) {
            L.polyline([new L.LatLng(this.purposesJson[index].catalog.lat, this.purposesJson[index].catalog.lon), new L.LatLng(this.purposesJson[index+1].catalog.lat, this.purposesJson[index+1].catalog.lon)], {color: colorArr[index], weight: 3, stroke: true}).addTo(map);
          }
        }
        /*
        setInterval(() => {

          console.log("!")
        }, 2000);*/
        DisplayLoad(false)

    }
  }
  </script>

<style lang="scss" scoped>
.main_contain{
  display: inline-flex;
  flex-direction: column;
  flex-wrap: nowrap;
  color: white;
}
td{
  text-align: left;

}
th{
  border-bottom: 2px solid white;

}
.Width80{
  width: 80%;
}
.PanelDefault{
    
    .SystemInfo{
        display: inline-flex;
        flex-wrap: wrap;
        align-content: center;
        align-items: center;
        color: white;
        text-align: left;
        padding: 10px;
        justify-content: space-around;

        .paddl{
            padding-left: 15px;
        }
    }
}
.ButtonCommand{
  background: #2b2b2b;
  color: white;
  border: 1px solid black;
  padding: 14px;
  font-size: 16px;
  border-radius: 10px;
  box-shadow: -3px 3px 1px black;
  margin: 5px;
  transition: all 0.2s;

  &:hover{
    box-shadow: -1px 1px 2px black;
    background: #202020;
  }
  &:active{
    border-radius: 5px;
    background: #171717;
    box-shadow: -3px 3px 10px black;
  }
  &.small{
    padding: 5px;
    font-size: 14px;
    margin: 3px;
  }
}
.CommandButtons{
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    div{
        padding: 5px;
    }
}
input{
  padding: 10px;
    text-align: center;
    border: none;
    background: none;
    font-size: 18px;
    color: white;
}
.flexrow{
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: nowrap;
}



#map{
  background-color: #2b2b2b;
  .leaflet-map-pane{
            pointer-events: none;
        }

}

</style>