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
          <div><button @click="CommandWork(1)" class="ButtonCommand">Рассчитать окна видимости</button></div>
          <div><button @click="CommandWork(5)" class="ButtonCommand">Расчёт плана контактов</button></div>
          <div><button @click="CommandWork(6)" class="ButtonCommand">Графическое представление плана контактов</button></div>
        </div>
      </div>

      <div class="Panel RightPanel">
          <div v-if="PageSettings.status == 2">
            <div class="TableDiv" style="max-height: 60vh;">
              <table class="TableDefault">
                <thead><tr><th>НП</th><th>КА</th><th>Начало</th><th>Конец</th></tr></thead>
                <tbody><tr v-for="data, index in PageSettings.SatNp" :key="index">
                  <td>{{ data.earthName }}</td><td>{{ data.satelliteName }}</td><td>{{ data.begin }}</td><td>{{ data.end }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="addRowButton"><td  colspan="4"><button @click="LoadXLSX" class="LoadExel"><img src="../../assets/excel.png"><span>&#8203;</span></button></td></tr>
              </tfoot>
            </table>
            </div>
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

  export default {
    name: 'TargetDZZ',
    mixins: [PagesSettings],
    data(){
      return{
        PageSettings:{
          mode: false, //лидер / все
          status: 2, //код открытого окна
          SatNp: [], //список контактов сат-нп
        },
        KAModellingRoleMode: false
      }
    },
    methods: {
       async CommandWork(commandId){
            if(commandId == 5){
              this.$showLoad(true)
              await this.$FetchGet("/api/v1/contact-plan/earth")
              this.ReFetch()
              this.$showLoad(false)
            }
            if(commandId == 1){
              this.$showLoad(true)
              await this.$FetchPost('/api/v1/pro42/view/earth', {leaderProcessing: this.KAModellingRoleMode})
              this.ReFetch()
              this.$showLoad(false)
            }
            if(commandId == 6){
              this.PageSettings.status = 2
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
                console.log(CreateDateTime(element.end - element.begin, 2))
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
        LoadXLSX(){
          const workbook = XLSX.utils.book_new();
          let data = [["НП","КА","Начало","Конец"]]
            this.PageSettings.SatNp.forEach(element => {
              data.push([element.earthName,element.satelliteName,element.begin,element.end])
            });
          console.log(data)
          let worksheet = XLSX.utils.aoa_to_sheet(data); // Создаем таблицу в файле с данными из массива
          workbook.SheetNames.push('Data'); // Добавляем лист с названием First list
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
          let keylist = Object.keys(worksheet)
          for (let keyid = 0; keyid < keylist.length; keyid++) {
            const key = keylist[keyid];
            console.log(worksheet[key].v, keylist, data[0])
            try {
              if (data[0].indexOf(worksheet[key].v) != -1) {
                worksheet[key].s = style
              }
            } catch (error) {
              console.log(error)
            }
          }
          console.log(worksheet)
          workbook.Sheets['Data'] = worksheet;
          XLSX.writeFile(workbook, 'KA-NP.xlsx');
        },
        async ReFetch(){
          this.PageSettings.SatNp = await this.$FetchGet('/api/v1/modelling/data/earth-sat/all', false) || []
          this.PageSettings.SatNp = this.PageSettings.SatNp.sort((a, b) => parseFloat(a.begin) - parseFloat(b.begin))
              for (let index = 0; index < this.PageSettings.SatNp.length; index++) {
                const element = this.PageSettings.SatNp[index]
                element.begin = CreateDateTime(element.begin)
                element.end = CreateDateTime(element.end)
              }
          await this.CommandWork(6)
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
.LoadExel{
  padding: 0px !important;
  width: fit-content !important;
  height: fit-content !important;
  img{
    width: 30px;
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
