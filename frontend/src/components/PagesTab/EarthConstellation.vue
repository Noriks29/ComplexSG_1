<template>
    <div class="main_contain RowSection">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
            <div class="TitleText">План контактов НП – ОГ</div>
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
                  <tr><th>Шаг моделирования: {{ systemStatus.step }}</th></tr>
                  <tr><th><div style="width: fit-content;">Фильтр сети:<input type="checkbox" :checked="KAModellingRoleMode" @change="KAModellingRoleMode = $event.target.checked"><label>{{ KAModellingRoleMode ? 'Только Лидеры' : 'Все КА' }}</label></div></th></tr>
                </tbody></table>
            </div>
        <div class="FlexColumn">
          <div><button @click="CommandWork(1)" class="ButtonCommand">Рассчитать окна видимости</button></div>
          <div><button @click="CommandWork(2)" class="ButtonCommand">Показать окна видимости / плана контактов</button></div>
          <div><button @click="CommandWork(5)" class="ButtonCommand">Расчёт плана контактов</button></div>
          <div><button @click="CommandWork(6)" class="ButtonCommand">Графическое представление плана контактов</button></div>
        </div>
      </div>

      <div class="Panel RightPanel">
          <div v-if="PageSettings.status == 1" class="TableDiv" style="max-height: 95%;">
            <table class="TableDefault">
              <thead><tr><th>НП</th><th>КА</th><th>Начало</th><th>Конец</th></tr></thead>
              <tbody><tr v-for="data, index in PageSettings.SatNp" :key="index">
                <td>{{ data.earthName }}</td><td>{{ data.satelliteName }}</td><td>{{ data.begin }}</td><td>{{ data.end }}</td>
              </tr>
            </tbody></table>
          </div>
      </div>

    </div>
    <div id="PlotlyDiv" v-if="ShowPlotlyContain">
      <div class="ContainerDiv">
        <div class="closebutton"><button @click="ShowPlotlyContain = false">
        <img src="../../assets/close.svg"><span>&#8203;</span>
      </button></div>
      <div id="plotlymapContain1" style="height: 79vh;"></div>
      </div>
    </div>
    </div>
  </template>
  
  <script>

import {DisplayLoad, FetchGet, FetchPost} from '../../js/LoadDisplayMetod.js'
import { PagesSettings } from './PagesSettings';
import Plotly from 'plotly.js-dist'

  export default {
    name: 'TargetDZZ',
    mixins: [PagesSettings],
    data(){
      return{
        PageSettings:{
          mode: false, //лидер / все
          status: 1, //код открытого окна
          SatNp: [], //список контактов сат-нп
        },
        ShowPlotlyContain: false,
        KAModellingRoleMode: false
      }
    },
    methods: {
       async CommandWork(commandId){
            if(commandId == 2){
              this.PageSettings.status = 1
            }
            if(commandId == 5){
              DisplayLoad(true)
              await FetchGet("/api/v1/contact-plan/earth")
              this.ReFetch()
              DisplayLoad(false)
            }
            if(commandId == 1){
              DisplayLoad(true)
              await FetchPost('/api/v1/pro42/view/earth', {leaderProcessing: this.KAModellingRoleMode})
              this.ReFetch()
              DisplayLoad(false)
            }
            if(commandId == 6){
              this.ShowPlotlyContain = true
              let response = await FetchGet('/api/v1/modelling/data/earth-sat/all') || []
              let dataGrapf = {
                type: 'bar',
                y: [],
                x: [],
                orientation: 'h',
                base: [],
                text: [],
                marker: {
                  opacity: 0.7,
                  line: {
                    width: 2
                  }
                }
              }
              response.forEach(element => {
                console.log(this.CreateDateTime(element.end - element.begin, 2))
                dataGrapf.y.push(element.earthName)
                dataGrapf.text.push(element.satelliteName)
                dataGrapf.x.push(this.CreateDateTime(element.end - element.begin, 2))
                dataGrapf.base.push(this.CreateDateTime(element.begin, 1))
              });
              Plotly.newPlot("plotlymapContain1", [dataGrapf],
                {
                  title: 'Окна видимости',
                }
              )
            }
        },
        async ReFetch(){
          this.PageSettings.SatNp = await FetchGet('/api/v1/modelling/data/earth-sat/all', false) || []
          this.PageSettings.SatNp = this.PageSettings.SatNp.sort((a, b) => parseFloat(a.begin) - parseFloat(b.begin))
              for (let index = 0; index < this.PageSettings.SatNp.length; index++) {
                const element = this.PageSettings.SatNp[index]
                element.begin = this.CreateDateTime(element.begin)
                element.end = this.CreateDateTime(element.end)
              }
        }
    },
    
    async mounted() {
        DisplayLoad(true)
        if(this.systemStatus.typeWorkplace in {3:null,4:null}){
          this.KAModellingRoleMode = true
        }
        this.ReFetch()
        DisplayLoad(false)
    }
  }
  </script>

<style lang="scss" scoped>

#PlotlyDiv{
  width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0px;
    top: 0px;
    background-color: #000000d4;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;

  .ContainerDiv{
    min-width: 90vw;
    margin-top: 100px;
    flex: 1;
    margin-bottom: 20px;
    background-color: #111111c7;
    border: 2px solid #4c4b4b;
    backdrop-filter: blur(10px);
    border-radius: 15px;

    .closebutton{
      display: flex;
      margin: 20px;
      flex-direction: row-reverse;
      button{
        background: none;
        border: none;
        img{
          width: 25px;
        }
      }
    }
  }
  
}
</style>
