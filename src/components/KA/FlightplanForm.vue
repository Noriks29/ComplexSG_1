<template>
    <Toolbar class="mb-4" :style="'width: 100%;padding: 0px;'">
      <template #end>
        <Button icon="pi pi-file-excel" severity="help" @click="LoadXLSX" text label="Exel"/>
      </template>
    </Toolbar>
    <DataTable :value="dataPrevrap" scrollable stripedRows :size="'small'" scrollHeight="30vh"
      v-model:selection="selectedProduct"
      selectionMode="multiple"
      dataKey="nRev">
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="nRev" header="Виток"/>
      <Column field="shooting" header="Съёмки"/>
      <Column field="gsContact" header="Связь с НП"/>
      <Column field="charge" header="Заряд АКБ Факт"/>
    </DataTable>
    <DataTable :value="dataPrevrapSelectRef" scrollable stripedRows :size="'small'" scrollHeight="60vh" style="margin-top: 20px;">
      <Column field="nRev" header="Виток"/>
      <Column field="timeUnix" header="Время"/>
      <Column field="lightForm" header="C/T"/>
      <Column field="shootingName" header="Съёмка"/>
      <Column field="gsName" header="Связь с НП"/>
      <Column field="modeName" header="Режим"/>
      <Column field="chargeTheoForm" header="Прогноз АКБ"/>
      <Column field="chargeFacForm" header="Факт АКБ"/>

    </DataTable>
    <div class="GrafDiv">
      <div id="plotlydiv">
      </div>
      <div id="plotlydivCharge">
      </div>
    </div>
</template>
  
  <script>

import XLSX from 'xlsx-js-style';
import Plotly from 'plotly.js-dist'
import { CreateDateTime } from '@/js/WorkWithDTime';

    export default {
      name: 'TableData',
      props: {
        dataTable:{
          type: Array
        },
      },
      data() {
        return {
          selectedProduct: [],
          dataPrevrapSelectRef: [],
          dataT: [],
          dataPrevrap: [{nRev: 0, shooting:0, gsContact:0, charge: null, memory: 0, data:[]}],
          dataLableName: [{lable: "Виток", nameParam: "nRev"},{lable: "Время", nameParam: "timeUnix"},
            {lable: "C/T", nameParam: "lightForm"},{lable: "Съёмка", nameParam: "shootingName"},
            {lable: "Связь с НП ", nameParam: "gsName"},{lable: "Режим", nameParam: "modeName"},{lable: "Прогноз АКБ", nameParam: "chargeTheoForm"},{lable: "Факт АКБ", nameParam: "chargeFacForm"}],
            selectRevData: [],
            selectRevId: null
        }
      },
      watch: {
        selectedProduct: {
          handler(newSelection) {
            console.log('Выбор изменен:', newSelection);
            this.handleRowSelect()
          },
          deep: true
        }
      },
      methods:
        {
          CloseTable(){
            this.$emit('closetable', true)
          },
          handleRowSelect(){
            this.dataPrevrapSelectRef=[]
            this.selectedProduct.forEach(el => {
              this.dataPrevrapSelectRef = this.dataPrevrapSelectRef.concat(el.data)
            })
            this.dataPrevrapSelectRef.sort((a,b) => {
              return a.nRev - b.nRev
            })
            this.SelectRev()

          },
          SelectRev(){
            let dataPlotly = []
            if(this.dataPrevrapSelectRef.length == 0){
              document.getElementById('plotlydiv').innerHTML = ''
              document.getElementById('plotlydivCharge').innerHTML = ''
            } 
            else {
              Plotly.newPlot("plotlydiv", [],  {title: 'Графическая форма представления',barmode: 'stack', showlegend: false, margin:{b:40,r:10, t:30,l:100}, height:300}, {displayModeBar: true})
              Plotly.newPlot("plotlydivCharge", [], {title: 'Заряд АКБ Тестовые данные', showlegend: false, margin:{b:30,r:10, t:30,l:30}, height:250})
              
              let data = this.dataPrevrapSelectRef

              if(data.length > 0 ){
                let dataGrapf = {type: 'bar',name: "Свет / Тень",y: [],x: [],orientation: 'h', base: [],
                  marker: {opacity: 0.6,color: []}
                }
                let dataGrapf1 = {type: 'bar',name: "Связь с НП",y: [],x: [],orientation: 'h',base: [],text: [],
                  marker: {opacity: 0.8,color: "green",line: {width: 1}}
                }
                let dataGrapf2 = {type: 'bar',name: "Съёмка",y: [],x: [],orientation: 'h',base: [],text: [],
                  marker: {opacity: 0.8,color: "red",line: {width: 1}}
                }
                let dataGrapf3 = {type: 'bar',name: "Дежурный",y: [],x: [],orientation: 'h',base: [],
                  marker: {color: "white",line: {width: 1}}
                }
                let dataGrapf4 = {type: 'bar',name: "Заряд АКБ",y: [],x: [],orientation: 'h',base: [],
                  marker: {opacity: 0.6,color: "yellow",line: {width: 1}}
                }
                let dataGrapf6 = {type: 'bar',name: "Межспутниковая",y: [],x: [],orientation: 'h',base: [],
                  marker: {opacity: 0.6,color: "purple",line: {width: 1}}
                }
                let dataGrapf1_1 = {name: "Факт АКБ", y: [],x: [], type: 'scatter', fill: 'tonexty'}
                let dataGrapf1_2 = {name: "Прогноз АКБ", y: [],x: [], type: 'scatter', fill: 'tonexty'}
                data.forEach(element => {
                  dataGrapf.y.push("Свет / Тень")
                  dataGrapf.marker.color.push(element.light ? 'yellow' : "blue")
                  dataGrapf.x.push(CreateDateTime(element.timeEnd - element.timeBegin, 2))
                  dataGrapf.base.push(CreateDateTime(element.timeBegin, 1))
                  console.log(CreateDateTime(element.timeEnd - element.timeBegin, 2), CreateDateTime(element.timeBegin, 1))

                  dataGrapf1_1.y.push(element.chargeFacForm)
                  dataGrapf1_2.y.push(element.chargeTheoForm)
                  dataGrapf1_1.x.push(CreateDateTime(element.timeEnd, 1))
                  dataGrapf1_2.x.push(CreateDateTime(element.timeEnd, 1))
                  if(element.gsName != null){
                    dataGrapf1.y.push("Связь с НП")
                    dataGrapf1.text.push(element.gsName+' '+ (element.timeEnd-element.timeBegin) + "c.")
                    dataGrapf1.x.push(CreateDateTime(element.timeEnd - element.timeBegin, 2))
                    dataGrapf1.base.push(CreateDateTime(element.timeBegin, 1))
                  }
                  if(element.shootingName != null){
                    dataGrapf2.y.push("Съёмка")
                    dataGrapf2.text.push(element.shootingName+' '+ (element.timeEnd-element.timeBegin) + "c.")
                    dataGrapf2.x.push(CreateDateTime(element.timeEnd - element.timeBegin, 2))
                    dataGrapf2.base.push(CreateDateTime(element.timeBegin, 1))
                  }
                  if(element.mode == 5){
                    dataGrapf3.y.push("Дежурный")
                    dataGrapf3.x.push(CreateDateTime(element.timeEnd - element.timeBegin, 2))
                    dataGrapf3.base.push(CreateDateTime(element.timeBegin, 1))
                  }
                  if(element.mode == 3){
                    dataGrapf6.y.push("Межспутниковая")
                    dataGrapf6.x.push(CreateDateTime(element.timeEnd - element.timeBegin, 2))
                    dataGrapf6.base.push(CreateDateTime(element.timeBegin, 1))
                  }
                  if(element.mode == 4){
                    dataGrapf4.y.push("Заряд АКБ")
                    dataGrapf4.x.push(CreateDateTime(element.timeEnd - element.timeBegin, 2))
                    dataGrapf4.base.push(CreateDateTime(element.timeBegin, 1))
                  }
                });
                dataPlotly = [dataGrapf,dataGrapf1,dataGrapf2,dataGrapf3,dataGrapf4,dataGrapf6]
                Plotly.newPlot("plotlydiv", dataPlotly,  {title: 'Графическая форма представления',barmode: 'stack', showlegend: false, margin:{b:40,r:10, t:30,l:100}, height:300}, {displayModeBar: true})
                Plotly.newPlot("plotlydivCharge", [dataGrapf1_1, dataGrapf1_2], {title: 'Заряд АКБ Тестовые данные', showlegend: false, margin:{b:30,r:10, t:30,l:30}, height:250})
                }
              }
          },
          LoadXLSX(){
            const workbook = XLSX.utils.book_new();
            let data = [[]]
            this.dataLableName.forEach(element => {
              data[0].push(element.lable)
            })
            
            this.dataT.forEach(element => {
              let rowData = []
              this.dataLableName.forEach(label => {
                rowData.push(element[label.nameParam])
              })
              data.push(rowData)
            });
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
              try {
                if (data[0].indexOf(worksheet[key].v) != -1) {
                  worksheet[key].s = style
                }
              } catch (error) {
                console.error(error)
              }
            }
            workbook.Sheets['Data'] = worksheet;
            XLSX.writeFile(workbook, 'FlightplanForm.xlsx');
          },
          PrevrapData(){
            for (let index = 0; index < this.dataTable.length; index++) {
                const element = this.dataTable[index];
                element.chargeTheoForm = Math.round(element.charge * 100)/100
                element.chargeFacForm = Math.round(element.factCharge * 100)/100
                element.lightForm = element.light ? 'Свет' : 'Тень'
                this.dataT.push(element) 
                while(this.dataPrevrap.length-1 < element.nRev) {
                    this.dataPrevrap.push({nRev: element.nRev, shooting:0, gsContact:0, charge: null, memory: 0, data:[]})
                }
                this.dataPrevrap[element.nRev].data.push(element)
                if(element.chargeFacForm < this.dataPrevrap[element.nRev].charge || this.dataPrevrap[element.nRev].charge == null) this.dataPrevrap[element.nRev].charge = element.chargeFacForm
                if(element.shootingName != null) this.dataPrevrap[element.nRev].shooting+=1
                if(element.gsName != null) this.dataPrevrap[element.nRev].gsContact+=1
                //доделать добавление остальных параметров
            }
            this.selectedProduct = this.dataPrevrap.concat([])
          },
      },
      mounted() {
        this.PrevrapData()
      }
    }
  </script>
  
  
  <style lang="scss" scoped>

  </style>