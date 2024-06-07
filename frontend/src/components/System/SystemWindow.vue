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
          <tr class="active"><td>Inter sat</td><td>Межспутниковая связь</td><td><input id="Inter_sat" type="text"></td></tr>
          <tr class="active"><td>Control</td><td>Управление орбитальной группировкой</td><td><input id="Control" type="text"></td></tr>
         
        </table>
      </div>
        <div class="PanelTable" v-if="!approved">
        <div class="TableInfo PanelDefault">
          <div class="ButtonApproved">
            <button @click="SatartSave" :class="!datasave ? '' :'Empty disabled'" class="ButtonDefault"> <img src="../../assets/save.svg">Сохранить</button>
            <button v-if="!datasave" class="ButtonDefaultShadow"><span>&#8203;</span></button>
          </div>
        </div>
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
