<template>
    <div class="main_contain RowSection">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
            <div class="TitleText">План контактов КА – КА</div>
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
                  <tr v-if="PageSettings.mode"><th><div>Минимальный угол <input type="number" :value="experimentObject.angle" @change="experimentObject.angle=Number($event.target.value)"></div></th></tr>
                </tbody></table>
            </div>
            <div class="FlexColumn">
              <div v-if="PageSettings.mode"><button @click="CommandWork(0)" class="ButtonCommand">Топология сети</button></div>
              <div><button @click="CommandWork(1)" class="ButtonCommand">Рассчитать окна видимости</button></div>
              <div v-if="!PageSettings.mode"><button @click="CommandWork(2)" class="ButtonCommand">Расчёт плана контактов</button></div>
              <div><button @click="CommandWork(3)" class="ButtonCommand">Показать окна видимости / плана контактов</button></div>
              <div><button @click="CommandWork(4)" class="ButtonCommand">Графическое представление плана контактов</button></div>
              <div v-if="PageSettings.mode"><button @click="CommandWork(5)" class="ButtonCommand">Полносвязная сеть</button></div>
            </div>
        </div>
        <div class="Panel RightPanel">
          <div v-if="PageSettings.status == 0">
            <table>
              <thead><tr><th>Кластер</th><th>Кластер</th><th></th></tr></thead>
              <tbody><tr v-for="data, index in clusterTopology" :key="index">
                <td><SelectDiv  :dataOption="lessConstellation" :valueS="{lable: data.cluster1.constellationName}" :id="index" @valueSelect="ChangeCluster($event, 'cluster1')"/></td>
                <td><SelectDiv  :dataOption="lessConstellation" :valueS="{lable: data.cluster2.constellationName}" :id="index" @valueSelect="ChangeCluster($event, 'cluster2')"/></td>
                <td @click="DeleteRow(index)" style="width: 20px;"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
              </tr>
              <tr><td colspan="3" @click="AddRow('clusterTopology')" style="text-align: center;"><img src="../../assets/add.png" alt="" class="addButtonIcon"> Добавить</td></tr>
            </tbody></table>
          </div>
          <div v-if="PageSettings.status == 1">
            <table class="TableDefault">
            <thead><tr><th>КА</th><th>Видимый КА</th><th>Начало</th><th>Конец</th></tr></thead>
              <tbody><tr v-for="data, index in PageSettings.SatSat" :key="index">
                <td>{{ data.satellite1 }}</td><td>{{ data.satellite2 }}</td><td>{{ data.begin }}</td><td>{{ data.end }}</td>
              </tr>
            </tbody></table>
          </div>

          <div v-if="PageSettings.status == 2">
            <h1>Структура полносвязной сети</h1>
            <table>
            <thead><tr><th></th><th>Время начала</th><th>Время окончания</th><th></th></tr></thead>
              <tbody><tr v-for="data, index in networkClaster" :key="index">
                <td>{{ data.meshNetworkId }}</td>
                <td><DateTime :valueUnix="data.beginTime" :name="'beginTime'" :id="index" @valueSelect="ChangeTime($event, index)"/></td>
                <td><DateTime :valueUnix="data.endTime" :name="'endTime'" :id="index" @valueSelect="ChangeTime($event, index)"/></td>
                <td @click="DeleteRowNetwork(index)" style="width: 20px;"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
              </tr>
              <tr><td colspan="3" @click="AddRow('network')" style="text-align: center;"><img src="../../assets/add.png" alt="" class="addButtonIcon"> Добавить</td></tr>
            </tbody></table>
          </div>
        </div>
    </div>

    
    <!--
    <div id="PlotlyDiv" v-if="ShowPlotlyContain">
      <div class="ContainerDiv">
        <div class="closebutton"><button @click="ShowPlotlyContain = false">
        <img src="../../assets/close.svg"><span>&#8203;</span>
      </button></div>

      <div id="plotlymapContain1" style="height: 79vh;"></div>
      </div>
    </div>-->
    </div>
  </template>
  
  <script>

import {DisplayLoad, FetchGet, FetchPost} from '../../js/LoadDisplayMetod.js'
import { PagesSettings } from './PagesSettings.js';
import SelectDiv from '../SelectDiv.vue';
import Plotly from 'plotly.js-dist'
import DateTime from '../DateTime.vue';

  export default {
    name: 'LeaderConstellationConstellation',
    mixins: [PagesSettings],
    components:{
      SelectDiv,
      DateTime
    },
    data(){
      return{
        clusterTopology: [], // топология сети
        networkClaster: [], //полносвязная сеть
        lessConstellation: [], // облегчённый список ог для селектора
        PageSettings:{
          mode: false, //лидер / все
          status: 1, //код открытого окна
          SatNp: [], //список контактов сат-нп
          SatSat: [], //список контактов сат-сат
        },
        experimentObject: {angle: 0}, //обьект отправки пост
        ShowPlotlyContain: false,
      }
    },
    methods: {
      async AddRow(mode){
        switch (mode) {
          case 'clusterTopology':
            this.clusterTopology.push({
              "cluster1": this.lessConstellation[0].value,
              "cluster2": this.lessConstellation[1].value,
              "beginTime": null,
              "endTime": null,
              "deleted": null
            })
            await FetchPost('/api/v1/topology/update', this.clusterTopology, null)
            this.ReFetch()
            break;
          case 'network':
            this.networkClaster.push({
                "beginTime": 10000000,
                "endTime": 10002000,
                "deleted": null
              })
            await FetchPost('/api/v1/network/update', this.networkClaster, null)
            this.ReFetch()
          
            break;
        
          default:
            break;
        }
      },
      async DeleteRow(index){
        this.clusterTopology[index].deleted= true
        await FetchPost('/api/v1/topology/update', this.clusterTopology, null)
        this.ReFetch()
      },
      async DeleteRowNetwork(index){
        this.networkClaster[index].deleted= true
        await FetchPost('/api/v1/network/update', this.networkClaster, null)
        this.ReFetch()
      },
      
      async ChangeCluster(event, param){
        this.clusterTopology[event.id][param] = event.value
        await FetchPost('/api/v1/topology/update', this.clusterTopology, null)
        this.ReFetch()
      },
      async ChangeTime(obgTime, id){
        console.log(this.networkClaster[id], obgTime.id, obgTime)
        this.networkClaster[obgTime.id][obgTime.name] = obgTime.time
        await FetchPost('/api/v1/network/update', this.networkClaster, null)
        this.ReFetch()
      },
       async CommandWork(commandId){
            DisplayLoad(true)
            let dataPlotly = null
            let dataGrapf = null
            switch (commandId) {
              case 0:
                this.PageSettings.status = 0
                break;
              case 1:
                
                if(this.PageSettings.mode) await FetchPost('/api/v1/cluster/pro42',this.experimentObject, null)
                else await FetchGet('/api/v1/pro42/view/sat', null)
                await this.ReFetch()
                break;
              case 2:
                await FetchGet('/api/v1/contact-plan/sat')
                this.ReFetch()
                break;

              case 3:
                //Таблица сат-сат
                this.PageSettings.status = 1
                break;
              
              case 4:
                if(this.PageSettings.SatSat.length < 1 ) return

                this.ShowPlotlyContain = true
                dataGrapf = {
                  type: 'bar',
                  name: "NP",
                  y: [],
                  x: [],
                  orientation: 'h',
                  base: [],
                  text: [],
                  marker: {
                    opacity: 0.5,
                    color: "red",
                    line: {
                      width: 1
                    }
                  }
                }
                this.PageSettings.SatNp.forEach(element => {
                  dataGrapf.y.push(element.satelliteId)
                  dataGrapf.text.push(element.earthName)
                  dataGrapf.x.push(this.CreateDateTime(element.end - element.begin, 2))
                  dataGrapf.base.push(this.CreateDateTime(element.begin, 1))
                });

                dataPlotly = [dataGrapf]
                this.PageSettings.SatSat.forEach(element => {
                  let flagadd = false
                  dataPlotly.forEach(plot => {
                    if(plot.name == element.satellite2Id){
                      plot.y.push(element.satellite1Id, element.satellite2Id)
                      plot.text.push(element.satellite1Id+"->"+element.satellite2Id, element.satellite2Id+"->"+element.satellite1Id)
                      plot.x.push(this.CreateDateTime(element.end - element.begin, 2), this.CreateDateTime(element.end - element.begin, 2))
                      plot.base.push(this.CreateDateTime(element.begin, 1), this.CreateDateTime(element.begin, 1))
                      flagadd = true
                    }
                  })
                  if(!flagadd){
                    dataPlotly.push({
                      type: 'bar',
                      name: element.satellite2Id,
                      y: [element.satellite1Id, element.satellite2Id],
                      x: [this.CreateDateTime(element.end - element.begin, 2), this.CreateDateTime(element.end - element.begin, 2)],
                      orientation: 'h',
                      base: [this.CreateDateTime(element.begin, 1), this.CreateDateTime(element.begin, 1)],
                      text: [element.satellite1Id+"->"+element.satellite2Id, element.satellite2Id+"->"+element.satellite1Id],
                      textfont: {
                        size: 16,
                        color: '#000000'
                      },
                      marker: {
                        opacity: 0.5,
                        color: "#0065ff",
                        line: {width: 1}
                      }
                    })
                  }
                });
                Plotly.newPlot("plotlymapContain1", dataPlotly, {title: 'Окна видимости',})
                break
              
              case 5:
                this.PageSettings.status = 2
                break;
            
              default:
                break;
            }
            DisplayLoad(false)
        },
        async ReFetch(){
          if(this.PageSettings.mode) this.clusterTopology = await FetchGet("/api/v1/topology/all") || []
          if(this.PageSettings.mode) this.networkClaster = await FetchGet("/api/v1/network/all") || []
          this.PageSettings.SatSat = []
          let response = []
          if(this.PageSettings.mode) response = await FetchGet('/api/v1/cluster/all',false) || []
          else response = await FetchGet('/api/v1/modelling/data/sat-sat/all',false) || []
            if(response.length < 1){
              return
            }
            response = response.sort((a, b) => parseFloat(a.begin) - parseFloat(b.begin))
            for (let index = 0; index < response.length; index++) {
              response[index].begin = this.CreateDateTime(response[index].begin)
              response[index].end = this.CreateDateTime(response[index].end)
            }
          this.PageSettings.SatSat = response
        }
    },
    async mounted() {
      DisplayLoad(true)
      console.log("fsfesefesfesfesfesfsefs")
      if(this.systemStatus.typeWorkplace in {3:null, 4:null}) {
        this.PageSettings.mode = true
        this.PageSettings.status = 0
      }
      this.ReFetch()
      let rezult = await FetchGet("/api/v1/constellation/cl/all") || []
      this.PageSettings.SatNp = await FetchGet('/api/v1/modelling/data/earth-sat/all', false) || []
      
      this.lessConstellation = []
      rezult.forEach(element => {
        this.lessConstellation.push({lable: element.constellationName, value: element})
      })
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
