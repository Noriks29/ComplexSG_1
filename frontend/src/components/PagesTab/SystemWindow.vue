<template>
    <div class="main_contain RowSection">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
            <h1 class="TitleText">Информация системы</h1>
          </div>
      <div class="ContentDiv">
        <div class="Panel RightPanel">
          <table class="TableDefault"><tbody>
          <tr>
            <th colspan="2">Исходные данные. Космическая система (КС) и связь</th>
          </tr>
          <tr><td>Список и координаты наземных пунктов</td><td id="earthStatus">{{dataSystem.earthStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr><td>Список и построение КА в ОГ </td><td id="constellationStatus">{{dataSystem.constellationStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr><td>Сеансы связи КА с НП</td><td id="earthSatStatus">{{dataSystem.earthSatStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr><td>План контактов между КА</td><td id="satSatStatus">{{dataSystem.satSatStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr><td>Опорный фрагмент сети связи</td><td id="gridStatus">{{dataSystem.gridStatus ? 'Утверждено' : 'Не утверждено'}}</td></tr>
          <tr>
            <th colspan="2">Горизонт времени моделирования</th>
          </tr>
          <tr><td>Начальное время расчетов</td><td>
            <DateTime :valueUnix="dataSystem.startTime" :id="'startTime'"  @valueSelect="ChangeTime"/>
          </td></tr>
          <tr><td>Начало горизонта моделирования</td><td>
            <DateTime :valueUnix="dataSystem.modelingBegin" :id="'modelingBegin'"  @valueSelect="ChangeTime"/>
          </td></tr>
          <tr><td>Окончание горизонта моделирования</td><td>
            <DateTime :valueUnix="dataSystem.modelingEnd" :id="'modelingEnd'" @valueSelect="ChangeTime"/>
          </td></tr>
          <tr>
            <th colspan="2">Аспекты системы управления</th>
          </tr>
          <tr><td>Шаг моделлирования</td><td><input id="step" @change="ChangeParam" type="number" min="0" :value="dataSystem.step"><label for="step"></label></td></tr>
        </tbody></table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import DateTime from '../DateTime.vue';
import { PagesSettings } from './PagesSettings';
import { SystemObject, ChangeSystemObject } from '@/js/GlobalData';

  export default {
    name: 'SystemWindow',
    mixins: [PagesSettings],
    components:{
      DateTime
    },
    data(){
      return{
        dataSystem:{}
      }
    },
    methods: {
      ChangeTime(obgTime){
        ChangeSystemObject(obgTime.id, obgTime.time)
      },
      ChangeParam(target){
        ChangeSystemObject('step',  Math.floor(target.target.value))
      },
    },
    created(){
      this.dataSystem = SystemObject
    },
  }
  </script>

<style lang="scss" scoped>



</style>
