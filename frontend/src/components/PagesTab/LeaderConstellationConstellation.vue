<template>
    <div class="main_contain RowSection">
          <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false"/>
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
            <div>План контактов КА – КА</div>
          </div>
    <div class="ContentDiv">
      <div class="Panel LeftPanel">
          <div>Парамертры системы</div>
            <div class="SystemInfo">
              <table>
                  <tr><th>Начальное время расчетов:</th></tr>
                      <tr><td v-html="CreateDateTime(systemStatus.startTime)"></td></tr>
                  <tr><th>Начало горизонта моделирования:</th></tr>
                      <tr><td v-html="CreateDateTime(systemStatus.modelingBegin)"></td></tr>
                  <tr><th>Окончание горизонта моделирования:</th></tr>
                      <tr><td v-html="CreateDateTime(systemStatus.modelingEnd)"></td></tr>
                  <tr><th>Шаг моделирования: {{ systemStatus.step }}</th></tr>
                  <tr><th><div>Минимальный угол <input type="number" :value="experimentObject.angle" @change="experimentObject.angle=Number($event.target.value)"></div></th></tr>
                </table>
            </div>
            <div class="FlexColumn">
              <div><button @click="CommandWork(3)" class="ButtonCommand">Топология сети</button></div>
              <div><button @click="CommandWork(1)" class="ButtonCommand">Рассчитать окна видимости</button></div>
              <div><button @click="CommandWork(2)" class="ButtonCommand">Показать окна видимости / плана контактов</button></div>
              <div><button @click="CommandWork(6)" class="ButtonCommand">Графическое представление плана контактов</button></div>
            </div>
        </div>
        <div class="Panel RightPanel">
          <div>
            <table>
              <tr><th>Кластер</th><th>Кластер</th><th></th></tr>
              <tr v-for="data, index in clusterTopology" :key="index">
                <td><SelectDiv  :dataOption="lessConstellation" :valueS="{lable: data.cluster1.constellationName}" :id="index" @valueSelect="ChangeCluster($event, 'cluster1')"/></td>
                <td><SelectDiv  :dataOption="lessConstellation" :valueS="{lable: data.cluster2.constellationName}" :id="index" @valueSelect="ChangeCluster($event, 'cluster2')"/></td>
                <td @click="DeleteRow(index)" style="width: 20px;"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
              </tr>
              <tr><td colspan="3" @click="AddRow('clusterTopology')" style="text-align: center;"><img src="../../assets/add.png" alt="" class="addButtonIcon"> Добавить</td></tr>
            </table>
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
import DefaultTable from '../DefaultTable.vue';
import Plotly from 'plotly.js-dist'

  export default {
    name: 'LeaderConstellationConstellation',
    mixins: [PagesSettings],
    components:{
      DefaultTable,
      SelectDiv
    },
    data(){
      return{
        ConstellationJson: [],
        clusterTopology: [], // топология сети
        lessConstellation: [], // облегчённый список ог для селектора
        earthSize: 0,
        ShowDefaultTable: false,
        ShowPlotlyContain: false,
        dataLableName: {},
        dataTable: [],
        experimentObject: {angle: 0},
        arr: [],
        TableViewWindow:[],
        AllResponse:[],
        valueSS: {},
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
            await FetchPost('/api/v1/cluster/update', this.clusterTopology, null)
            this.ReFetch()
            break;
        
          default:
            break;
        }
      },
      async DeleteRow(index){
        this.clusterTopology[index].deleted= true
        await FetchPost('/api/v1/cluster/update', this.clusterTopology, null)
        this.ReFetch()
      },
      async ChangeCluster(event, param){
        this.clusterTopology[event.id][param] = event.value
        await FetchPost('/api/v1/cluster/update', this.clusterTopology, null)
        this.ReFetch()
      },
       async CommandWork(commandId){
            console.log(commandId)
            if(commandId == 2){
              this.dataLableName = [
                {lable: "КА", nameParam: "satellite1Id"},
                {lable: "Видимый КА", nameParam: "satellite2Id"},
                {lable: "Начало", nameParam: "begin"},
                {lable: "Конец", nameParam: "end"},
              ]
              let response = await FetchGet('/api/v1/modelling/data/sat-sat/all',false) || []
              if(response.length < 1){
                alert("Нет контактов")
                return
              }
              this.dataTable = await response
              this.dataTable =this.dataTable.sort((a, b) => parseFloat(a.begin) - parseFloat(b.begin))
              for (let index = 0; index < this.dataTable.length; index++) {
                this.dataTable[index].begin = this.CreateDateTime(this.dataTable[index].begin)
                this.dataTable[index].end = this.CreateDateTime(this.dataTable[index].end)
              }
              this.ShowDefaultTable = true
            }
            if(commandId == 1){
              DisplayLoad(true)
              let constellation = await FetchPost('/api/v1/cluster/pro42', this.experimentObject) || []
              let countSatelites = 0
              constellation.forEach(OG => {
                countSatelites+=OG.satellites.length
              })
              if(countSatelites < 2){
                alert("При одном КА расчет не выполняется")
                DisplayLoad(false)
                return
              }
              await FetchGet('/api/v1/pro42/view/sat')
              DisplayLoad(false)
            }
            if(commandId == 6){
              console.log("Уааа график")
              this.ShowPlotlyContain = true

              let responseNP = await FetchGet('/api/v1/modelling/data/earth-sat/all', false) || []
              let dataGrapf = {
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
              responseNP.forEach(element => {
                dataGrapf.y.push(element.satelliteId)
                dataGrapf.text.push(element.earthName)
                dataGrapf.x.push(this.CreateDateTime(element.end - element.begin, 2))
                dataGrapf.base.push(this.CreateDateTime(element.begin, 1))
              });

              let response = await FetchGet('/api/v1/modelling/data/sat-sat/all') || []
              if(response.length <1) return
              console.log(response)
              
              let dataPlotly = [dataGrapf]
              response.forEach(element => {
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
              console.log(dataPlotly)
              Plotly.newPlot("plotlymapContain1", dataPlotly,
                {
                  title: 'Окна видимости',
                }
              )
            }
        },
        async ReFetch(){
          this.clusterTopology = await FetchGet("/api/v1/cluster/all") || []
        }
    },
    async mounted() {
      this.clusterTopology = await FetchGet("/api/v1/cluster/all")
      let rezult = await FetchGet("/api/v1/constellation/cl/all") || []
      this.lessConstellation = []
      rezult.forEach(element => {
        this.lessConstellation.push({lable: element.constellationName, value: element})
      })

      
      console.log(this.lessConstellation)
    }
  }
  </script>

<style lang="scss" scoped>
.main_contain{
  display: inline-flex;
  flex-direction: column;
  flex-wrap: nowrap;
  color: white;

  &.RowSection{
    display: flex;

    .ContentDiv{
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: stretch;

      .Panel{
        &.RightPanel{
          flex: 1;
          overflow-y: auto;
        }
      }
    }
  }
}
td{
  text-align: left;

}
th{
  border-bottom: 2px solid white;

}
.PanelDefault{
    
    .SystemInfo{
        display: flex;
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
.CommandButtons{
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    div{
        padding: 5px;
    }
}

.FlexColumn{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  div{
    width: 100%;
    button{
      width: 96%;
      text-align: start;
    }
  }
}



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
