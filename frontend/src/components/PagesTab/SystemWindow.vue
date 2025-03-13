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
          <!--<tr class="active"><td>Inter sat</td><td>Межспутниковая связь</td><td><input id="interSatelliteCommunication" type="checkbox" @change="ChangeParam" :checked="systemStatus.interSatelliteCommunication"><label for="interSat">{{systemStatus.interSatelliteCommunication}}</label></td></tr>-->
          <tr class="active"><td>Control</td><td>Управление орбитальной группировкой</td><td><input id="controlSystem" @change="ChangeParam" type="checkbox" :checked="systemStatus.controlSystem == 'Automated'"><label for="controlSystem">{{systemStatus.controlSystem}}</label></td></tr>

          <tr class="active"><td>step</td><td>Шаг моделлирования</td><td><input id="step" @change="ChangeParam" type="number" min="0" :value="systemStatus.step"><label for="step"></label></td></tr>
          <!--<tr class="active"><td>duration</td><td>Продолжительность съёмки</td><td><input id="duration" type="number" min="0" @change="alert('Не доступно из системы')" :value="systemStatus.duration"><label for="duration">сек.</label></td></tr>-->
        </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import DateTime from '../DateTime.vue';
import { PagesSettings } from './PagesSettings';

  export default {
    name: 'SystemWindow',
    mixins: [PagesSettings],
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
      ChangeTime(obgTime){
        this.dataSystem[obgTime.id] = obgTime.time
        this.ChangeSystemStatusInSystem()
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
        this.ChangeSystemStatusInSystem()
      },
      ChangeSystemStatusInSystem(){
        this.$emit('ChangeSystemStatus', this.dataSystem)
      }, 
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
