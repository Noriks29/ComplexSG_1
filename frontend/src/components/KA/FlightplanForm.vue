<template>
    <div class="DataTable">
        <div class="closebutton"><button @click="CloseTable">
            <img src="../../assets/close.svg"><span>&#8203;</span>
          </button>
          <button @click="LoadXLSX" class="LoadExel">
            <img src="../../assets/excel.png"><span>&#8203;</span>
          </button>
        </div>
        
        <div class="DataBody">
            <div class="TableDiv" style="max-height: 200px;">
                <table class="TableDefault SelectModeTable">
                    <thead>
                      <tr><th>Виток</th><th>Съёмки</th><th>Связь с НП</th><th>Заряд АКБ</th><th>Память</th></tr>
                    </thead>
                    <tbody >
                        <tr v-for="data,index in dataPrevrap" :key="index" :class="selectRevId==index ? 'select': ''" @click="SelectRev(index)">
                            <td>{{ data.nRev }}</td><td>{{ data.shooting }}</td>
                            <td>{{ data.gsContact }}</td><td>{{ data.charge }}</td><td>{{ data.memory }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          
        <div class="TableDiv" style="max-height: 350px;">
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
              <td
                v-for="(dataLable, index) in dataLableName"
                :key="index"
              >{{ data[dataLable.nameParam] }}</td>
            </tr>
          </tbody>
          </table>
        </div>
        <div id="plotlydiv">
          <!--Карта-->
        </div>
        <div id="plotlydivCharge">
          <!--Карта-->
        </div>
      </div>
      </div>
</template>
  
  <script>

import { UnixToDtime } from '@/js/WorkWithDTime';
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
            dataT: [],
            dataPrevrap: [{nRev: 0, shooting:0, gsContact:0, charge: 0, memory: 0, data:[]}],
          dataLableName: [{lable: "Виток", nameParam: "nRev"},{lable: "Время", nameParam: "time"},
            {lable: "C/T", nameParam: "light"},{lable: "Съёмка", nameParam: "shootingName"},
            {lable: "Связь с НП", nameParam: "gsName"},
            {lable: "Режим", nameParam: "mode"},{lable: "Режим", nameParam: "modeName"},{lable: "Заряд АКБ", nameParam: "charge"}],
            selectRevData: [],
            selectRevId: null
        }
      },
      methods:
        {
          CloseTable(){
            this.$emit('closetable', true)
          },
          SelectRev(id){
            let dataPlotly = []
            if(id == this.selectRevId) this.selectRevId = null
            else {
              this.selectRevId = id
              let data = this.dataPrevrap[id].data
              console.log(data, "fsfsfesfes")
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
                  marker: {opacity: 0.6,color: "blue",line: {width: 1}}
                }
                let dataGrapf5 = {name: "Заряд", y: [],x: [], type: 'scatter', fill: 'tonexty'}
                data.forEach(element => {
                  dataGrapf.y.push("Свет / Тень")
                  dataGrapf.marker.color.push(element.light ? 'yellow' : "blue")
                  dataGrapf.x.push(CreateDateTime(element.timeEnd - element.timeBegin, 2))
                  dataGrapf.base.push(CreateDateTime(element.timeBegin, 1))

                  dataGrapf5.y.push(element.timeEnd % 100)
                  dataGrapf5.x.push(CreateDateTime(element.timeBegin, 1))
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
                Plotly.newPlot("plotlydiv", dataPlotly, {title: 'Графическая форма представления витка:' +id,barmode: 'stack'})
                Plotly.newPlot("plotlydivCharge", [dataGrapf5], {title: 'Заряд АКБ Тестовые данные'})
                console.log(dataGrapf5)
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
              data.push([element.nRev,element.time,element.light,element.shootingName,element.gsName,element.mode,element.charge])
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
            workbook.Sheets['Data'] = worksheet;
            XLSX.writeFile(workbook, 'FlightplanForm.xlsx');
          },
          PrevrapData(){
            for (let index = 0; index < this.dataTable.length; index++) {
                const element = this.dataTable[index];
                let createData = {
                    shootingName: element.shootingName || '-',
                    light: element.light,
                    charge: element.charge,
                    nRev: element.nRev,
                    gsName: element.gsName || '-',
                    mode: element.mode,
                    modeName: element.modeName,
                    time: UnixToDtime(element.timeBegin).time +' - '+ UnixToDtime(element.timeEnd).time
                }
                this.dataT.push(createData) 
                while(this.dataPrevrap.length-1 < element.nRev) {
                    this.dataPrevrap.push({nRev: element.nRev, shooting:0, gsContact:0, charge: 0, memory: 0, data:[]})
                }
                console.log(this.dataPrevrap[element.nRev], this.dataPrevrap)
                this.dataPrevrap[element.nRev].data.push(element)
                if(createData.shootingName != '-') this.dataPrevrap[element.nRev].shooting+=1
                if(createData.gsName != '-') this.dataPrevrap[element.nRev].gsContact+=1
                //доделать добавление остальных параметров
            }
            console.log( this.dataPrevrap)
          },
          
          
      },
      mounted() {
        console.log(this.dataTable)
        this.PrevrapData()
      }
    }
  </script>
  
  
  <style lang="scss" scoped>
  .DataTable{
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      position: fixed;
      top: 0%;
      left: 0;
      width: 100%;
      z-index: 10;
      max-width: 100%;
      height: 100%;
      overflow-y: auto;

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
          &.LoadExel{
            margin-right: 45px;
          }
        }
      }

      .DataBody{
        margin: 25px;
      }
  }

  div.TableDiv{
    margin: 10px 1px;
    overflow: auto;
    height: fit-content;
    table{
      width: 100%;
      
      thead,tfoot{
        position: sticky;
      }
      thead{
        top: 0px;
        box-shadow: 0px 1px 0px white;
      }
      tfoot{
        bottom: 0px;
      }
      tbody{
        tr{
          &:nth-child(even){
            background-color: rgb(10, 10, 10);
          }
        }
      }
      tr{
        background-color: black;
        td,th{
          padding: 5px;
        }
      }

      &.SelectModeTable{
        tbody tr{
          &:hover{
            box-shadow: inset 0px 0px 3px 0px white;
          }
          &.select{
            box-shadow: inset 0px 0px 2px 1px white;
          }
        }
      }
    }
  }
  </style>