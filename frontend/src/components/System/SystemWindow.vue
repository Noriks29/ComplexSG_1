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
          <div class="DataTable">
      <div class="PanelDefault">
        <table class="TableDefault">
          <tr>
            <th colspan="2" >Исходные данные. Космическая система (КС) и связь</th><th></th>
          </tr>
          <tr><td>Earth</td><td>Список и координаты наземных пунктов</td><td id="earthStatus">{{dataSystem.earthStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr><td>Constellation</td><td>Список и построение КА в ОГ </td><td id="constellationStatus">{{dataSystem.constellationStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr><td>Earth-Sat</td><td>Сеансы связи КА с НП</td><td id="earthSatStatus">{{dataSystem.earthSatStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr><td>Sat-Sat</td><td>План контактов между КА</td><td id="satSatStatus">{{dataSystem.satSatStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr><td>Grid</td><td>Опорный фрагмент сети связи</td><td id="gridStatus">{{dataSystem.gridStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr>
            <th colspan="2" >Горизонт времени моделирования</th><th></th>
          </tr>
          <tr class="active"><td>S_begin</td><td>Начальное время расчетов</td><td>
            <DateTime :valueUnix="systemStatus.startTime" :id="'startTime'"  @valueSelect="ChangeTime"/>
          </td></tr>
          <tr class="active"><td>H_begin</td><td>Начало горизонта моделирования</td><td>
            <DateTime :valueUnix="systemStatus.modelingBegin" :id="'modelingBegin'"  @valueSelect="ChangeTime"/>
          </td></tr>
          <tr class="active"><td>H_end</td><td>Окончание горизонта моделирования</td><td>
            <DateTime :valueUnix="systemStatus.modelingEnd" :id="'modelingEnd'" @valueSelect="ChangeTime"/>
          </td></tr>
          <tr>
            <th colspan="2" >Аспекты системы управления</th><th></th>
          </tr>
          <tr class="active"><td>Inter sat</td><td>Межспутниковая связь</td><td><input id="interSatelliteCommunication" type="checkbox" @change="ChangeParam" :checked="systemStatus.interSatelliteCommunication"><label for="interSat">{{systemStatus.interSatelliteCommunication}}</label></td></tr>
          <tr class="active"><td>Control</td><td>Управление орбитальной группировкой</td><td><input id="controlSystem" @change="ChangeParam" type="checkbox" :checked="systemStatus.controlSystem == 'Automated'"><label for="controlSystem">{{systemStatus.controlSystem}}</label></td></tr>

          <tr class="active"><td>step</td><td>Шаг моделлирования</td><td><input id="step" @change="ChangeParam" type="number" min="0" :value="systemStatus.step"><label for="step"></label></td></tr>
          <tr class="active"><td>duration</td><td>Продолжительность съёмки</td><td><input id="duration" type="number" min="0" @change="ChangeParam" :value="systemStatus.duration"><label for="duration">сек.</label></td></tr>
         
        </table>
      </div>
      </div>
    </div>
  </template>
  
  <script>
import MainStyle from '../../style/component.scss'
import DateTime from '../DateTime.vue';

  export default {
    name: 'SystemWindow',
    css:{
      MainStyle
    },
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
      
    },
    mounted(){
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
</style>
