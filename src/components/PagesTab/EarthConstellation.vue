<template>
    <div class="main_contain RowSection">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
    <div class="ContentDiv">
      <div class="Panel LeftPanel">
        <div class="FlexColumn" style="padding-top: 10px;">
          <div><Button @click="CommandWork(1)" label="Рассчитать окна видимости"  icon="pi pi-play" iconPos="right"/></div>
          <div><Button @click="CommandWork(5)" label="Расчёт плана контактов"  icon="pi pi-play" iconPos="right"/></div>
          <div><Button @click="CommandWork(3)" label="Окна видимости" :outlined="PageSettings.status == 3"/></div>
          <div><Button @click="CommandWork(6)" label="Графическое представление" :outlined="PageSettings.status == 6"/></div>
        </div>
      </div>

      <div class="Panel RightPanel">
          <Toolbar class="mb-4" v-if="PageSettings.status == 3" >
            <template #start>
              <Button icon="pi pi-file-excel" severity="help" @click="exportExcel" text label="Exel"/>
            </template>
          </Toolbar>
            <DataTable :value="PageSettings.SatNp" v-if="PageSettings.status == 3" scrollable scrollHeight="60vh"
              tableStyle="min-width: 50rem" sortMode="multiple" stripedRows removableSort :size="'small'"
              ref="dtSatGs" :exportFilename="'Окна_КА_НП_' + new Date().toISOString().slice(0, 10)">
              <Column :field="field" :header="header" sortable  v-for="header, field in {
                earthName:'НП', satelliteName:'КА',begin:'Начало',end:'Конец'
                }" :key="header" />
            </DataTable>
          <div v-if="PageSettings.status == 6">
            <div id="plotlymapContain1"></div>
            <div id="plotlymapContain2"></div>
          </div>
      </div>
    </div>
    </div>
  </template>
  
  <script>
import { PagesSettings } from './PagesSettings';
import { CreateDateTime } from '@/js/WorkWithDTime';
import Plotly from 'plotly.js-dist'
import XLSX from 'xlsx-js-style';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';

  export default {
    name: 'TargetDZZ',
    mixins: [PagesSettings],
    data(){
      return{
        PageSettings:{
          mode: false, //лидер / все
          status: 3, //код открытого окна
          SatNp: [], //список контактов сат-нп
        },
        KAModellingRoleMode: false
      }
    },
    components:{
      DataTable, Column, Button, Toolbar
    },
    methods: {
       async CommandWork(commandId){
            if(commandId == 5){
              this.$showLoad(true)
              await this.$FetchGet("/api/v1/contact-plan/earth")
              this.ReFetch()
              this.$showLoad(false)
              this.PageSettings.status = 3
            }
            if(commandId == 3){
              this.PageSettings.status = 3
            }
            if(commandId == 1){
              this.$showLoad(true)
              await this.$FetchPost('/api/v1/pro42/view/earth', {leaderProcessing: this.KAModellingRoleMode})
              this.ReFetch()
              this.$showLoad(false)
              this.PageSettings.status = 3
            }
            if(commandId == 6){
              this.PageSettings.status = 6
              let response = await this.$FetchGet('/api/v1/modelling/data/earth-sat/all') || []
              let dataGrapfKANP = {
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
              let dataGrapfNPKA = {
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
              let NPGrafList = []
              let OGGrafList = []
              
              response.forEach(element => {
                dataGrapfKANP.y.push(element.earthName)
                dataGrapfKANP.text.push(element.satelliteName)
                dataGrapfKANP.x.push(CreateDateTime(element.end - element.begin, 2))
                dataGrapfKANP.base.push(CreateDateTime(element.begin, 1))
                if( NPGrafList.indexOf(element.earthName) == -1){NPGrafList.push(element.earthName)}

                dataGrapfNPKA.y.push(element.satelliteName)
                dataGrapfNPKA.text.push(element.earthName)
                dataGrapfNPKA.x.push(CreateDateTime(element.end - element.begin, 2))
                dataGrapfNPKA.base.push(CreateDateTime(element.begin, 1))
                if( OGGrafList.indexOf(element.earthName) != -1){OGGrafList.push(element.earthName)}
              });
              console.log(await document.getElementById('plotlymapContain1'))
              console.log(await document.getElementById('plotlymapContain2'))
              Plotly.newPlot("plotlymapContain1", [dataGrapfKANP],{title: 'Окна видимости',margin:{b:30,r:10, t:30,l:70}, height:(60+NPGrafList.length * 100)})
              Plotly.newPlot("plotlymapContain2", [dataGrapfNPKA],{margin:{b:30,r:10, t:30,l:70}, height:(60+NPGrafList.length * 100)})
            }
        },
        exportExcel() {
          // 1. Получаем имя файла
          const headers = [];
          const fields = [];
          let filename = this.$refs.dtSatGs.$props.exportFilename || 'export';
            this.$refs.dtSatGs.$slots.default()[0].children
              .filter(col => col.props?.exportable !== false)
              .forEach(col => {
                headers.push(col.props?.header || col.props?.field);
                fields.push(col.props?.field);
              });
          let data = this.PageSettings.SatNp.map(row => {
              const newRow = {};
              fields.forEach(field => {
                newRow[field] = row[field];
              });
              return newRow;
            });
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
        async ReFetch(){
          this.PageSettings.SatNp = await this.$FetchGet('/api/v1/modelling/data/earth-sat/all', false) || []
          this.PageSettings.SatNp = this.PageSettings.SatNp.sort((a, b) => parseFloat(a.begin) - parseFloat(b.begin))
              for (let index = 0; index < this.PageSettings.SatNp.length; index++) {
                const element = this.PageSettings.SatNp[index]
                element.begin = CreateDateTime(element.begin)
                element.end = CreateDateTime(element.end)
              }
        }
    },
    
    async mounted() {
      this.$showLoad(true)
      let system = await this.$SystemObject()
      if(system.typeWorkplace in {3:null,4:null}){
        this.KAModellingRoleMode = true
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
