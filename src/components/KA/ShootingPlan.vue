<template>
          <button @click="LoadXLSX" class="LoadExel">
            <img src="../../assets/excel.png"><span>&#8203;</span>
          </button>
        <div class="DataBody">
        <div class="TableDiv" style="max-height: 500px;">
          <table class="TableDefault">
          <thead>
            <tr><th 
                v-for="(data, index) in dataLableName"
                :key="index"
                :name="data.nameParam"
                >{{ data.lable }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in dataT" :key="index">
                <td v-for="(datatd, indextd) in dataLableName" :key="indextd"
                >{{ data[datatd.nameParam] }}</td>
            </tr>
          </tbody>
          </table>
        </div>
        <div class="GrafDiv">
          <div id="plotlydiv">
            <!--Карта-->
          </div>
        </div>
        
      </div>
</template>
  
  <script>
import Plotly from 'plotly.js-dist'
import { CreateDateTime } from '@/js/WorkWithDTime'
import XLSX from 'xlsx-js-style';

    export default {
      name: 'TableData',
      props: {
        dataTable:{
          type: Array
        },
      },
      data() {
        return {
            dataT: [],
          dataLableName: this.dataLableName = [
          {lable: "Заявка", nameParam: "orderId"},
          {lable: "Цель", nameParam: "targetName"},
          {lable: "Начало видимости", nameParam: "wsUnix"},
          {lable: "Окончание видимости", nameParam: "weUnix"},
          {lable: "Разворот", nameParam: "transition"},
          {lable: "Начало съёмки", nameParam: "tsUnix"},
          {lable: "Окончаниие съёмки", nameParam: "teUnix"},
          {lable: "Тангаж", nameParam: "pitch"},
          {lable: "Крен", nameParam: "roll"}
        ]
        }
      },
      methods:
        {
          CloseTable(){
            this.$emit('closetable', true)
          },
          LoadXLSX(){
            this.$showLoad(true);
            const workbook = XLSX.utils.book_new();
            let data = [[]]
            this.dataLableName.forEach(lable => {
                data[0].push(lable.lable)
            })
            this.dataT.forEach(element => {
                let row = []
                this.dataLableName.forEach(lable => {
                row.push(element[lable.nameParam])
                })
                data.push(row)
            });
            let worksheet = XLSX.utils.aoa_to_sheet(data); // Создаем таблицу в файле с данными из массива
            workbook.SheetNames.push('ShootingPlan'); // Добавляем лист с названием First list
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
            workbook.Sheets['ShootingPlan'] = worksheet;
            XLSX.writeFile(workbook, 'ShootingPlan.xlsx');
            this.$showLoad(false);
          },
          CreatePlot(){
                document.getElementById("plotlydiv").innerHTML=''
                if(this.dataT.length < 1 ) return
                let dataPlotly = [
                    {
                      type: 'bar',name: "Видимость",y: [],x: [],
                      orientation: 'h',base: [],
                      marker: {
                        opacity: 0.5,color: "blue",line: {width: 1}
                      }
                    },
                    {
                      type: 'bar',name: "Съёмка",y: [],x: [],
                      orientation: 'h',
                      base: [],
                      marker: {
                        opacity: 0.8,color: "red",line: {width: 1}
                      }
                    }]
                
                let annotations = []
                this.dataT.forEach(element => {
                    dataPlotly[0].y.push(element.targetName)
                    dataPlotly[1].y.push(element.targetName)
                    dataPlotly[0].x.push(CreateDateTime(element.we - element.ws, 2))
                    dataPlotly[1].x.push(CreateDateTime(element.te - element.ts, 2))
                    dataPlotly[0].base.push(CreateDateTime(element.ws, 1))
                    dataPlotly[1].base.push(CreateDateTime(element.ts, 1))
                    annotations.push({x: CreateDateTime(element.ts+(element.te-element.ts)/2, 1),y: element.targetName,xref: 'x',yref: 'y',text:element.nodeName,showarrow: false,ax: 0,ay: 0})
                  })
                Plotly.newPlot("plotlydiv", dataPlotly, {titel: 'График съёмки целей', annotations:annotations, barmode: 'stack', showlegend: false,height:150+(dataPlotly.length*70), margin:{l:100,t:40,b:40,r:40}})
              },
          PrevrapData(){
            this.dataT = this.dataT.concat(this.dataTable)
            console.log(this.dataT)
            this.CreatePlot()
          },
      },
      mounted() {
        this.PrevrapData()
      }
    }
  </script>
  
  
  <style lang="scss" scoped>

  </style>