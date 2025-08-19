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
              <div v-if="PageSettings.mode" style="align-items: flex-end;">
                <FloatLabel>
                  <InputNumber v-model="experimentObject.angle" inputId="angle" showButtons :invalid="!experimentObject.angle && experimentObject.angle !== 0"/>
                  <label for="angle">Минимальный угол</label>
                </FloatLabel>
              </div>
              <div v-if="PageSettings.mode"><Button @click="CommandWork(0)" label="Топология сети" :outlined="PageSettings.status == 0"/></div>
              <div><Button @click="CommandWork(1)" label="Рассчитать окна видимости"  icon="pi pi-play" iconPos="right"/></div>
              <div v-if="!PageSettings.mode"><Button  @click="CommandWork(2)" label="Расчёт плана контактов"  icon="pi pi-play" iconPos="right"/></div>
              <div><Button @click="CommandWork(3)" label="Показать окна видимости / плана контактов" :outlined="PageSettings.status == 3"/></div>
              <div><Button @click="CommandWork(4)" label="Графическое представление" :outlined="PageSettings.status == 4"/></div>
              <div v-if="PageSettings.mode"><Button @click="CommandWork(5)" label="Полносвязная сеть" :outlined="PageSettings.status == 5"/></div>
            </div>
        </div>
        <div class="Panel RightPanel">
          <Toolbar class="mb-4" v-if="PageSettings.status in {0:null,3:null,5:null}">
            <template #start>
              <Button v-if="PageSettings.status in {0:null,3:null,5:null}" icon="pi pi-file-excel" severity="help" @click="exportExcel" text label="Exel"/>
            </template>
            <template #center>
              <Button v-if="PageSettings.status == 5" @click="NetworkModelling" label="Расчёт полносвязной сети" severity="success" />
            </template>
            <template #end>
              <Button v-if="PageSettings.status in {0:null,5:null}" icon="pi pi-plus" class="p-button-sm" severity="success" label="Добавить" rounded text @click="AddRow()" />
            </template>
          </Toolbar>
          <DataTable :value="clusterTopology" v-if="PageSettings.status == 0" scrollable scrollHeight="60vh"
            tableStyle="min-width: 50rem" sortMode="multiple" stripedRows
            ref="dtSatSatTopology" :exportFilename="'Топология_КА_КА_' + new Date().toISOString().slice(0, 10)">
            <Column field="cluster1" header="Кластер">
              <template #body="slotProps">
                <Dropdown v-model="slotProps.data.cluster1" :options="lessConstellation" @change="ChangeCluster($event)" optionLabel="constellationName" placeholder="Выберите кластер"/>
              </template>
            </Column>
            <Column field="cluster2" header="Кластер">
              <template #body="slotProps">
                <Dropdown v-model="slotProps.data.cluster2" :options="lessConstellation" @change="ChangeCluster($event)" optionLabel="constellationName" placeholder="Выберите кластер"/>
              </template>
            </Column>
            <Column header="" :exportable="false" headerStyle="width: 3rem">
              <template #body="slotProps">
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" 
                  @click="slotProps.data.deleted = true; DeleteRow('Topology')"/>
              </template>
            </Column>
          </DataTable>
            <DataTable :value="PageSettings.SatSat" v-if="PageSettings.status == 3" scrollable scrollHeight="60vh"
              tableStyle="min-width: 50rem" sortMode="multiple" stripedRows removableSort
              ref="dtSatSat" :exportFilename="'Окна_КА_КА_' + new Date().toISOString().slice(0, 10)">
              <Column :field="field" :header="header" sortable  v-for="header, field in {
                satellite1:'КА', satellite2:'Видимый КА',beginUnix:'Начало',endUnix:'Конец'
                }" :key="header" />
            </DataTable>

            <DataTable :value="networkClaster" v-if="PageSettings.status == 5" scrollable scrollHeight="60vh"
              tableStyle="min-width: 50rem" stripedRows removableSort
              ref="dtSatSatNet" :exportFilename="'Сеть_КА_КА_' + new Date().toISOString().slice(0, 10)">
              <Column field="beginTime" header="Время начал" sortables>
                <template #body="slotProps">
                  <Calendar v-model="slotProps.data.beginTimeDate"  @date-select="ChangeTimeInput($event, 'beginTime', slotProps.data.meshNetworkId)" @input="ChangeTimeInput($event.target.value, 'beginTime', slotProps.data.meshNetworkId)" :invalid="!slotProps.data.beginTimeDate" dateFormat="yy-mm-dd" timeFormat="HH:mm:ss" showTime hourFormat="24" showIcon iconDisplay="input" inputId="datetime" showSeconds='true' :manualInput="true"/>
                </template>
              </Column>
              <Column field="endTime" header="Время окончания">
                <template #body="slotProps">
                  <Calendar v-model="slotProps.data.endTimeDate"  @date-select="ChangeTimeInput($event, 'endTime', slotProps.data.meshNetworkId)" @input="ChangeTimeInput($event.target.value, 'endTime', slotProps.data.meshNetworkId)" :invalid="!slotProps.data.endTimeDate" dateFormat="yy-mm-dd" timeFormat="HH:mm:ss" showTime hourFormat="24" showIcon iconDisplay="input" inputId="datetime" showSeconds='true' :manualInput="true"/>
                </template>
              </Column>
              <Column header="" :exportable="false" headerStyle="width: 3rem">
                <template #body="slotProps">
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" 
                    @click="slotProps.data.deleted = true; DeleteRow('Net')"/>
                </template>
              </Column>
            </DataTable>

          <div id="plotlymapContain1"></div>
          </div>
        </div>
    </div>

    
  </template>
  
  <script>

import { CreateDateTime } from '@/js/WorkWithDTime.js';
import { PagesSettings } from './PagesSettings.js';
import Plotly from 'plotly.js-dist'

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import FloatLabel from 'primevue/floatlabel';
import InputNumber from 'primevue/inputnumber';

import XLSX from 'xlsx-js-style';
  export default {
    name: 'LeaderConstellationConstellation',
    mixins: [PagesSettings],
    components:{
      DataTable, Column, Toolbar, Button,Calendar,Dropdown, FloatLabel, InputNumber
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
      exportExcel() {
          // 1. Получаем имя файла
          const headers = [];
          const fields = [];
          let filename = 'export'
          let data = []
          if(this.PageSettings.status == 0){
            filename = this.$refs.dtSatSatTopology.$props.exportFilename || 'export';
            this.$refs.dtSatSatTopology.$slots.default()
              .filter(col => col.props?.exportable !== false)
              .forEach(col => {
                headers.push(col.props?.header || col.props?.field);
                fields.push(col.props?.field);
              });
            data = this.clusterTopology.map(row => {
              const newRow = {};
              fields.forEach(field => {
                newRow[field] = row[field].constellationName;
              });
              return newRow;
            });
          }
          else if(this.PageSettings.status == 3){
            filename = this.$refs.dtSatSat.$props.exportFilename || 'export';
            this.$refs.dtSatSat.$slots.default()[0].children
              .filter(col => col.props?.exportable !== false)
              .forEach(col => {
                headers.push(col.props?.header || col.props?.field);
                fields.push(col.props?.field);
              });
            data = this.PageSettings.SatSat.map(row => {
              const newRow = {};
              fields.forEach(field => {
                newRow[field] = row[field];
              });
              return newRow;
            });
          }
          else if(this.PageSettings.status == 5){
            filename = this.$refs.dtSatSatNet.$props.exportFilename || 'export';
            this.$refs.dtSatSatNet.$slots.default()
              .filter(col => col.props?.exportable !== false)
              .forEach(col => {
                headers.push(col.props?.header || col.props?.field);
                fields.push(col.props?.field);
              });
            data = this.networkClaster.map(row => {
              const newRow = {};
              fields.forEach(field => {
                newRow[field] = CreateDateTime(row[field]);
              });
              return newRow;
            });
          }
          else{return}
          // 4. Создаем лист Excel
          let style = {
            font: {
              name: 'Calibri',
              sz: 12,
              bold: true,
                  color: {rgb: '000000'} // red font
            },
            border: {
              bottom: { style: 'thin', color: { rgb: '000000' } }
            }}
          // Преобразуем заголовки в массив объектов с стилями
          const styledHeaders = headers.map(text => ({
            v: text,
            t: 's',
            s: style
          }));
          const worksheet = XLSX.utils.json_to_sheet(data, { header: fields });
          XLSX.utils.sheet_add_aoa(worksheet, [styledHeaders], { origin: 'A1' });
          // 7. Сохраняем файл
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
          XLSX.writeFile(workbook, `${filename}.xlsx`);
        },
      async ChangeTimeInput(value, param, index){
        for (let i = 0; i < this.networkClaster.length; i++) {
          if(this.networkClaster[i].meshNetworkId == index){
            this.networkClaster[i][param] = Math.floor(Date.parse(value)/1000)
            console.log(Math.floor(Date.parse(value)/1000))
            break
          }
        }
        await this.$FetchPost('/api/v1/network/update', this.networkClaster, null)
      },
      async AddRow(){
        let page = this.PageSettings.status
        switch (page) {
          case 0:
            console.log(this.lessConstellation)
            this.clusterTopology.push({
              "cluster1": this.lessConstellation[0],
              "cluster2": this.lessConstellation[1],
              "beginTime": null,
              "endTime": null,
              "deleted": null
            })
            await this.$FetchPost('/api/v1/topology/update', this.clusterTopology, null)
            this.ReFetch()
            break;
          case 5:
            this.networkClaster.push({
                "beginTime": 10000000,'beginTimeDate': Math.floor(Date.parse(10000000)/1000),
                "endTime": 10000001,'endTimeDate': Math.floor(Date.parse(10000001)/1000),
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
        if(index == 'Net'){
          await this.$FetchPost('/api/v1/network/update', this.networkClaster, null)
        }
        else if(index == 'Topology'){
          await this.$FetchPost('/api/v1/topology/update', this.clusterTopology, null)
        }
        this.ReFetch()
      },
      
      async ChangeCluster(event){
        console.log('сделать изменение отдельной записи', event)
        await this.$FetchPost('/api/v1/topology/update', this.clusterTopology, null)
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
             this.networkClaster.forEach(windownet => {
              windownet.beginTimeDate = new Date(windownet.beginTime * 1000) || null
              windownet.endTimeDate = new Date(windownet.endTime * 1000) || null
             })
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
          this.lessConstellation.push(element)
        })
      }
      this.ReFetch()
      this.$showLoad(false)
    }
  }
  </script>

<style lang="scss" scoped>

.FlexColumn{
  padding-top: 10px;
  div{
    display: flex;
    height: auto;
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
