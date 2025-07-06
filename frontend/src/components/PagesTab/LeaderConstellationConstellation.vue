<template>
    <div class="main_contain RowSection">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
    <div class="ContentDiv">
      <div class="Panel LeftPanel">
            <div class="FlexColumn">
              <div v-if="PageSettings.mode"><label for="angle">Минимальный угол</label><input id="angle" type="number" v-model="experimentObject.angle"></div>
              <div v-if="PageSettings.mode"><button @click="CommandWork(0)" class="ButtonCommand">Топология сети</button></div>
              <div><button @click="CommandWork(1)" class="ButtonCommand">Рассчитать окна видимости</button></div>
              <div v-if="!PageSettings.mode"><button @click="CommandWork(2)" class="ButtonCommand">Расчёт плана контактов</button></div>
              <div><button @click="CommandWork(3)" class="ButtonCommand">Показать окна видимости / плана контактов</button></div>
              <div><button @click="CommandWork(4)" class="ButtonCommand">Графическое представление плана контактов</button></div>
              <div v-if="PageSettings.mode"><button @click="CommandWork(5)" class="ButtonCommand">Полносвязная сеть</button></div>
            </div>
        </div>
        <div class="Panel RightPanel">
          <div v-if="PageSettings.status == 0" class="TableDiv">
            <table class="TableDefault">
              <thead><tr><th>Кластер</th><th>Кластер</th><th></th></tr></thead>
              <tbody><tr v-for="data, index in clusterTopology" :key="index">
                <td><SelectDiv  :dataOption="lessConstellation" :valueS="{lable: data.cluster1.constellationName}" :id="index" @valueSelect="ChangeCluster($event, 'cluster1')"/></td>
                <td><SelectDiv  :dataOption="lessConstellation" :valueS="{lable: data.cluster2.constellationName}" :id="index" @valueSelect="ChangeCluster($event, 'cluster2')"/></td>
                <td @click="DeleteRow(index)" style="width: 20px;"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
              </tr>
            </tbody>
            <tfoot>
              <tr><td colspan="3" @click="AddRow('clusterTopology')" style="text-align: center;"><img src="../../assets/add.png" alt="" class="addButtonIcon"> Добавить</td></tr>
            </tfoot>
          </table>
          </div>
          <div v-if="PageSettings.status == 3" class="TableDiv">
            <table class="TableDefault">
            <thead><tr><th>КА</th><th>Видимый КА</th><th>Начало</th><th>Конец</th></tr></thead>
              <tbody><tr v-for="data, index in PageSettings.SatSat" :key="index">
                <td>{{ data.satellite1 }}</td><td>{{ data.satellite2 }}</td><td>{{ data.beginUnix }}</td><td>{{ data.endUnix }}</td>
              </tr>
            </tbody></table>
          </div>

          <div v-if="PageSettings.status == 5" class="TableDiv">
            <button @click="NetworkModelling" class="ButtonCommand">Расчёт полносвязной сети</button>
            <table class="TableDefault">
            <thead><tr><th></th><th>Время начала</th><th>Время окончания</th><th></th></tr></thead>
              <tbody><tr v-for="data, index in networkClaster" :key="index">
                <td>{{ data.meshNetworkId }}</td>
                <td><DateTime :valueUnix="data.beginTime" :name="'beginTime'" :id="index" @valueSelect="ChangeTime($event)"/></td>
                <td><DateTime :valueUnix="data.endTime" :name="'endTime'" :id="index" @valueSelect="ChangeTime($event)"/></td>
                <td @click="DeleteRowNetwork(index)" style="width: 20px;"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
              </tr>
            </tbody>
          <tfoot>
            <tr><td colspan="3" @click="AddRow('network')" style="text-align: center;"><img src="../../assets/add.png" alt="" class="addButtonIcon"> Добавить</td></tr>
          </tfoot>
          </table>
          </div>

          <div id="plotlymapContain1"></div>
          </div>
        </div>
    </div>

    
  </template>
  
  <script>

import { CreateDateTime } from '@/js/WorkWithDTime.js';
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
          status: 3, //код открытого окна
          SatSat: [], //список контактов сат-сат
        },
        experimentObject: {angle: 0}, //обьект отправки пост
      }
    },
    methods: {
      async AddRow(mode){
        switch (mode) {
          case 'clusterTopology':
            console.log(this.lessConstellation)
            this.clusterTopology.push({
              "cluster1": this.lessConstellation[0].value,
              "cluster2": this.lessConstellation[1].value,
              "beginTime": null,
              "endTime": null,
              "deleted": null
            })
            await this.$FetchPost('/api/v1/topology/update', this.clusterTopology, null)
            this.ReFetch()
            break;
          case 'network':
            this.networkClaster.push({
                "beginTime": 10000000,
                "endTime": 10002000,
                "deleted": null
              })
            await this.$FetchPost('/api/v1/network/update', this.networkClaster, null)
            this.ReFetch()
          
            break;
        
          default:
            break;
        }
      },
      async DeleteRow(index){
        this.clusterTopology[index].deleted= true
        await this.$FetchPost('/api/v1/topology/update', this.clusterTopology, null)
        this.ReFetch()
      },
      async DeleteRowNetwork(index){
        this.networkClaster[index].deleted= true
        await this.$FetchPost('/api/v1/network/update', this.networkClaster, null)
        this.ReFetch()
      },
      
      async ChangeCluster(event, param){
        this.clusterTopology[event.id][param] = event.value
        await this.$FetchPost('/api/v1/topology/update', this.clusterTopology, null)
        this.ReFetch()
      },
      async ChangeTime(obgTime){
        this.networkClaster[obgTime.id][obgTime.name] = obgTime.time
        await this.$FetchPost('/api/v1/network/update', this.networkClaster, null)
        this.ReFetch()
      },
      async NetworkModelling(){
        this.$showLoad(true)
        await this.$FetchGet('/api/v1/network/calc')
        this.ReFetch()
        this.$showLoad(false)
      },
       async CommandWork(commandId){
            this.$showLoad(true)
            document.getElementById("plotlymapContain1").innerHTML=''
            switch (commandId) {
              case 0:
                this.PageSettings.status = 0
                break;
              case 1:
                if(this.PageSettings.mode) await this.$FetchPost('/api/v1/cluster/pro42',this.experimentObject, null)
                else await this.$FetchGet('/api/v1/pro42/view/sat', null)
                await this.ReFetch()
                break;
              case 2:
                await this.$FetchGet('/api/v1/contact-plan/sat')
                await this.ReFetch()
                this.PageSettings.status = 2
                break;

              case 3:
                this.PageSettings.status = 3
                break;
              
              case 4:
                this.PageSettings.status = 4
                var dataPlotly = []
                if(this.PageSettings.SatSat.length < 1 ) return
                this.PageSettings.SatSat.forEach(element => {
                  let flagadd = false
                  dataPlotly.forEach(plot => {
                    if(plot.name == element.satellite2){
                      plot.y.push(element.satellite1+"-"+element.satellite2)
                      plot.x.push(CreateDateTime(element.end - element.begin, 2))
                      plot.base.push(CreateDateTime(element.begin, 1))
                      flagadd = true
                    }
                  })
                  if(!flagadd){
                    dataPlotly.push({
                      type: 'bar',
                      name: element.satellite2,
                      y: [element.satellite1+"-"+element.satellite2],
                      x: [CreateDateTime(element.end - element.begin, 2)],
                      orientation: 'h',
                      base: [CreateDateTime(element.begin, 1)],
                      marker: {
                        opacity: 0.7,
                        color: "#0065ff",
                        line: {width: 1}
                      }
                    })
                  }
                });
                var networkPlot = {
                      type: 'bar',
                      name: "Сеть",
                      y: [],
                      x: [],
                      orientation: 'h',
                      base: [],
                      text: [],
                      marker: {
                        opacity: 0.7,
                        color: "green",
                        line: {width: 1}
                      }
                    }
                console.log(networkPlot)
                this.networkClaster.forEach(elementNet => {
                  networkPlot.y.push('Полносвязная сеть')
                  networkPlot.base.push(CreateDateTime(elementNet.beginTime, 1))
                  networkPlot.x.push(CreateDateTime(elementNet.endTime - elementNet.beginTime, 2))
                  networkPlot.text.push(elementNet.meshNetworkId)
                })
                dataPlotly.push(networkPlot)
                Plotly.newPlot("plotlymapContain1", dataPlotly, {title: 'Окна видимости', showlegend: false,height:80+(dataPlotly.length*50), margin:{l:150,t:40,b:40,r:0}})
                break
              
              case 5:
                this.PageSettings.status = 5
                break;

              default:
                break;
            }
            this.$showLoad(false)
        },
        async ReFetch(){
          let response = []
          this.PageSettings.SatSat = []
          if(this.PageSettings.mode) { // при кластер-кластер
             this.clusterTopology = await this.$FetchGet("/api/v1/topology/all") || []
             this.networkClaster = await this.$FetchGet("/api/v1/network/all") || []
             response = await this.$FetchGet('/api/v1/cluster/all') || []
          }
          else response = await this.$FetchGet('/api/v1/modelling/data/sat-sat/all',false) || []
          if(response.length < 1){
            return
          }
          response = response.sort((a, b) => parseFloat(a.begin) - parseFloat(b.begin))
          for (let index = 0; index < response.length; index++) {
            response[index].beginUnix = CreateDateTime(response[index].begin)
            response[index].endUnix = CreateDateTime(response[index].end)
          }
          this.PageSettings.SatSat = response
        }
    },
    async mounted() {
      this.$showLoad(true)
      let system = await this.$SystemObject()
      if(system.typeWorkplace in {3:null, 4:null}) { //для случаев ка-ка кластеры
        this.PageSettings.mode = true
        this.PageSettings.status = 0
        this.lessConstellation = []
        let rezult = await this.$FetchGet("/api/v1/constellation/cl/all") || []
        rezult.forEach(element => {
          this.lessConstellation.push({lable: element.constellationName, value: element})
        })
      }
      this.ReFetch()
      this.$showLoad(false)
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
