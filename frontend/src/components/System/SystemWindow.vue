<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
      <div class="ContentDiv">
        <div class="TitleText">Информация системы</div>

        <div class="Panel MaxWidth">
          <table class="TableDefault">
          <tr>
            <th colspan="2" class="Title">Исходные данные. Космическая система (КС) и связь</th><th></th>
          </tr>
          <tr><td>Earth</td><td>Список и координаты наземных пунктов</td><td id="earthStatus">{{dataSystem.earthStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr><td>Constellation</td><td>Список и построение КА в ОГ </td><td id="constellationStatus">{{dataSystem.constellationStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr><td>Earth-Sat</td><td>Сеансы связи КА с НП</td><td id="earthSatStatus">{{dataSystem.earthSatStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr><td>Sat-Sat</td><td>План контактов между КА</td><td id="satSatStatus">{{dataSystem.satSatStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr><td>Grid</td><td>Опорный фрагмент сети связи</td><td id="gridStatus">{{dataSystem.gridStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr>
            <th colspan="2" class="Title">Горизонт времени моделирования</th><th></th>
          </tr>
          <tr class="active"><td>S_begin</td><td>Начальное время расчетов</td><td>
            <DateTime :valueUnix="dataSystem.startTime" :id="'startTime'"  @valueSelect="ChangeTime"/>
          </td></tr>
          <tr class="active"><td>H_begin</td><td>Начало горизонта моделирования</td><td>
            <DateTime :valueUnix="dataSystem.modelingBegin" :id="'modelingBegin'"  @valueSelect="ChangeTime"/>
          </td></tr>
          <tr class="active"><td>H_end</td><td>Окончание горизонта моделирования</td><td>
            <DateTime :valueUnix="dataSystem.modelingEnd" :id="'modelingEnd'" @valueSelect="ChangeTime"/>
          </td></tr>
          <tr>
            <th colspan="2" class="Title">Аспекты системы управления</th><th></th>
          </tr>
          <tr class="active"><td>Inter sat</td><td>Межспутниковая связь</td><td><input id="interSatelliteCommunication" type="checkbox" @change="ChangeParam" :checked="systemStatus.interSatelliteCommunication"><label for="interSat">{{systemStatus.interSatelliteCommunication}}</label></td></tr>
          <tr class="active"><td>Control</td><td>Управление орбитальной группировкой</td><td><input id="controlSystem" @change="ChangeParam" type="checkbox" :checked="systemStatus.controlSystem == 'Automated'"><label for="controlSystem">{{systemStatus.controlSystem}}</label></td></tr>

          <tr class="active"><td>step</td><td>Шаг моделлирования</td><td><input id="step" @change="ChangeParam" type="number" min="0" :value="systemStatus.step"><label for="step"></label></td></tr>
          <tr class="active"><td>duration</td><td>Продолжительность съёмки</td><td><input id="duration" type="number" min="0" @change="ChangeParam" :value="systemStatus.duration"><label for="duration">сек.</label></td></tr>
        </table>
        </div>
        <div class="Panel MaxWidth">
          <button @click="SaveWorkplace" class="ButtonCommand">Сохранить копию данных</button>
          <label class="input-file">
            <input type="file" name="file" id="file-Json" @change="LoadFile" accept="application/json">		
            <span>Открыть файл</span>
          </label>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import DateTime from '../DateTime.vue';
import {FetchGet, FetchPost, DisplayLoad} from '../../js/LoadDisplayMetod'
import { saveAs } from 'file-saver';

  export default {
    name: 'SystemWindow',
    props:{
    systemStatus:{
          type: Object
        },
    },
    components:{
      DateTime
    },
    data(){
      return{
        modalwindowDisplay: false,
        dataSystem:{}
      }
    },
    methods: {
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
      async SaveWorkplace(){
        let dataLoad = {}
        let result = await FetchGet('/api/v1/earth/get/list')
        for (let index = 0; index < result.length; index++) {
          let new_data = result[index];
          new_data.id = undefined
          new_data.idNode = undefined
          result[index] = new_data
        }
        dataLoad.earth = result

        result = await FetchGet('/api/v1/system/get')
        dataLoad.system = result

        result = await FetchGet('/api/v1/constellation/get/list')
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          element.id = undefined
          for (let jindex = 0; jindex < element.satellites.length; jindex++) {
            const j_element = element.satellites[jindex];
            j_element.idNode = undefined
            j_element.satelliteId = undefined
            //не забудь про modelsat.id
            element.satellites[jindex] = j_element
          }
          result[index] = element 
        }
        dataLoad.constellation = result

        result = await FetchGet('/api/v1/satrequest/catalog/get/all')
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          element.goalId = undefined
          result[index] = element
        }
        dataLoad.catalog = result

        console.log(JSON.stringify(dataLoad, null, 2))
        var fileName = 'myData.json';
        var fileToSave = new Blob([JSON.stringify(dataLoad, null, 2)], {
            type: 'application/json'
        });
        saveAs(fileToSave, fileName);
      },
      ChangeTime(obgTime){
        this.dataSystem[obgTime.id] = obgTime.time
        this.ChangeSystemStatus()
      },
      ChangeParam(target){
        console.log(target, target.target.id, target.target.checked)
        if(target.target.id == "interSatelliteCommunication"){
          this.dataSystem.interSatelliteCommunication = target.target.checked
        }
        else if (target.target.id == "controlSystem") {
          if(target.target.checked){
            this.dataSystem.controlSystem = "Automated"
          } else{
            this.dataSystem.controlSystem = "Earth"
          }
        }
        else if(target.target.id == "step"){
          this.dataSystem.step = Math.floor(target.target.value)
        }
        else if(target.target.id == "duration"){
          this.dataSystem.duration = Math.floor(target.target.value)
        }
        else return 0;
        this.ChangeSystemStatus()
      },
      ChangeSystemStatus(){
        this.$emit('ChangeSystemStatus', this.dataSystem)
      },
      LoadFile(data){
        const reader = new FileReader();
        if (data.target.files[0]) {
          var file = data.target.files[0];
          reader.readAsText(file);
          reader.addEventListener('load', () => {
            this.ReloadDataBaseFromFile(reader.result);
          });
          reader.addEventListener('error', () => {
            console.error(`Произошла ошибка при чтении файла`);
          });
        }
      },
      async ReloadDataBaseFromFile(json){
        DisplayLoad(true)
        try {
          let dataJson = JSON.parse(json)
          try {
            dataJson.system.systemId = this.dataSystem.systemId
            this.dataSystem = dataJson.system
            this.ChangeSystemStatus()
          } catch (error) {
            console.log(error)
            alert("Ошибка перезаписи")
          }
          try {
            if(dataJson.earth != undefined){
              let result = await FetchGet('/api/v1/earth/get/list')
              let new_Np = dataJson.earth
              for (let index = 0; index < result.length; index++) {
                const element = result[index]
                element.deleted = true
                new_Np.push(element)
              }
              let response = await FetchPost("/api/v1/earth/update/byList", new_Np)
              console.log(response)
            }
          } catch (error) {
            console.log(error)
            alert("Ошибка перезаписи")
          }
          try {
            if(dataJson.constellation != undefined){
              let result = await FetchGet('/api/v1/constellation/get/list')
              for (let index = 0; index < result.length; index++) {
                const element = result[index];
                let response = await FetchPost('/api/v1/constellation/delete/byId',{},'id='+element.id)
                console.log(response)
              }
              let modelsat = await FetchGet('/api/v1/modelsat/all')
              for (let index = 0; index < dataJson.constellation.length; index++) {
                const element = dataJson.constellation[index];
                for (let satellites_index = 0; satellites_index < element.satellites.length; satellites_index++) {
                  const satellites = element.satellites[satellites_index];
                  satellites.modelSat = {
                    id: modelsat[0].id
                  }
                  element.satellites[satellites_index] = satellites
                }
                let responce = await FetchPost('/api/v1/constellation/update',element)
                console.log(responce)
              }
            }
          } catch (error) {
            console.log(error)
            alert("Ошибка перезаписи")
          }
          try {
            if(dataJson.catalog != undefined){
              let result = await FetchGet('/api/v1/satrequest/catalog/get/all')
              for (let index = 0; index < result.length; index++) {
                const element = result[index];
                element.deleted = true
                dataJson.catalog.push(element)
              }
              let responce = await FetchPost("/api/v1/satrequest/catalog/update", dataJson.catalog)
              console.log(responce)
            }    
          } catch (error) {
            console.log(error)
            alert("Ошибка перезаписи")
          }
        } catch (error) {
          console.log(error)
          alert("Ошибка чтения")
        }
        DisplayLoad(false)
      }
      
    },
    created(){
      this.dataSystem = this.systemStatus
    }
  }
  </script>

<style lang="scss" scoped>
input{
  pointer-events: all;
}
td{
  text-align: left;

  &:last-child{
    border-left: 1px solid white;
  }
}
th{
  border-bottom: 2px solid white;

  &:last-child{
    border-left: 1px solid white;
  }
}
.input-file {
	background: #2b2b2b;
  color: white;
  border: 1px solid black;
  padding: 14px;
  font-size: var(--font-size);
  border-radius: 10px;
  box-shadow: -3px 3px 1px black;
  margin: 5px;
  transition: all 0.2s;
  position: relative;
  display: inline-block;
}
.input-file span {
  position: relative;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  display: flex;
  vertical-align: middle;
  text-align: center;
  background: none;
  height: 100%;
  font-size: 15px;
  transition: all 0.3s ease;
  color: white;
  align-items: center;
  flex-direction: row;
}
.input-file input[type=file] {
	position: absolute;
	z-index: -1;
	opacity: 0;
	display: block;
	width: 0;
	height: 0;
}



</style>
