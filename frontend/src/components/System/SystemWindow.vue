<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/left-arrow.png">
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
          <tr><td>Earth</td><td>Список и координаты наземных пунктов</td><td id="Earth_status">Не утверждены / Утверждены</td></tr>
          <tr><td>Constellation</td><td>Список и построение КА в ОГ </td><td id="Constellation_status">Не утверждены / Утверждены</td></tr>
          <tr><td>Earth-Sat</td><td>Сеансы связи КА с НП</td><td id="Earth-Sat_status">Не утверждены / Утверждены</td></tr>
          <tr><td>Sat-Sat</td><td>План контактов между КА</td><td id="Sat-Sat_status">Не утверждены / Утверждены</td></tr>
          <tr><td>Grid</td><td>Опорный фрагмент сети связи</td><td id="Grid_status">Не утверждены / Утверждены</td></tr>
          <tr>
            <th colspan="2" >Горизонт времени моделирования</th><th></th>
          </tr>
          <tr><td>S_begin</td><td>Начальное время расчетов</td><td><input id="S_begin" type="text"></td></tr>
          <tr><td>H_begin</td><td>Начало горизонта моделирования</td><td><input id="H_begin" type="text"></td></tr>
          <tr><td>H_end</td><td>Окончание горизонта моделирования</td><td><input id="H_end" type="text"></td></tr>
          <tr>
            <th colspan="2" >Аспекты системы управления</th><th></th>
          </tr>
          <tr><td>Inter sat</td><td>Межспутниковая связь</td><td><input id="Inter_sat" type="text"></td></tr>
          <tr><td>Control</td><td>Управление орбитальной группировкой</td><td><input id="Control" type="text"></td></tr>
         
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

  export default {
    name: 'SystemWindow',
    css:{
      MainStyle
    },
    data(){
      return{
        modalwindowDisplay: false
      }
    },
    methods: {
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      }
      
    }
  }
  </script>

<style lang="scss" scoped>

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
