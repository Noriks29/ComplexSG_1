<template>
    <div class="DataTable">
        <div class="closebutton"><button @click="CloseTable">
          <img src="../../assets/close.svg"><span>&#8203;</span>
        </button>
        <button @click="LoadXLSX" class="LoadExel">
          <img src="../../assets/excel.png"><span>&#8203;</span>
        </button>
        </div>
  
        <div class="scroll-table">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Виток</th><th>Съёмки</th><th>Связь с НП</th><th>Заряд АКБ</th><th>Память</th>
                        </tr>
                    </thead>
                    <tbody >
                        <tr v-for="data,index in dataPrevrap" :key="index">
                            <td>{{ data.nRev }}</td><td>{{ data.shooting }}</td><td>{{ data.gsContact }}</td><td>{{ data.charge }}</td><td>{{ data.memory }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

          <table class="TableDefault">
        <thead>
          <tr>
            <th 
              v-for="(data, index) in dataLableName"
              :key="index"
              :name="data.nameParam"
              >{{ data.lable }}</th>
  
          </tr>
          </thead>
        </table>
        <div class="scroll-table-body">
        <table class="TableDefault">
          <tbody>
          <tr
            v-for="(data, index) in dataT"
            :key="index"
          >
  
            <td
              v-for="(dataLable, index) in dataLableName"
              :key="index"
              :class="(prevrap) ? 'prevrap': ''"
            >{{ data[dataLable.nameParam] }}</td>
          </tr>
        </tbody>
        </table>
      </div>
      </div>
      
    </div>
  </template>
  
  <script>

import { UnixToDtime } from '@/js/WorkWithDTime';
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
            {lable: "Режим", nameParam: "mode"},{lable: "Заряд АКБ", nameParam: "charge"}]
        }
      },
      methods:
        {
          CloseTable(){
            this.$emit('closetable', true)
          },
          LoadXLSX(){
            alert("не готова для этой таблицы")
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
                    time: UnixToDtime(element.timeBegin).time +' - '+ UnixToDtime(element.timeEnd).time
                }
                this.dataT.push(createData) 
                while(this.dataPrevrap.length-1 < element.nRev) {
                    this.dataPrevrap.push({nRev: element.nRev, shooting:0, gsContact:0, charge: 0, memory: 0, data:[]})
                }
                console.log(this.dataPrevrap[element.nRev], this.dataPrevrap)
                this.dataPrevrap[element.nRev].data.push(createData)
                if(createData.shootingName != '-') this.dataPrevrap[element.nRev].shooting+=1
                if(createData.gsName != '-') this.dataPrevrap[element.nRev].gsContact+=1
                //доделать добавление остальных параметров
            }
            console.log( this.dataPrevrap)
          }
          
      },
      mounted() {
        console.log(this.dataTable)
        this.PrevrapData()
      }
    }
  </script>
  
  
  <style lang="scss" scoped>
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
    .TableDefault{
      filter: drop-shadow(2px 4px 6px black);
  
    }
    .PanelTable{
      position: sticky;
      bottom: 20px;
      margin: 0px 5%;
      width: 90%;
    }
  }
  .PanelDefault{
    width: 95%;
    padding: 5px;
  
  }
  .scroll-table-body {
      height: 80vh;
  
  }
  .smallTh{
    width: 50px;
  }
  .scroll-table{
    margin: 0% 2%;
      background-color: rgba(151, 151, 151, 0.15);
      box-shadow: -4px 3px 1px rgba(63, 60, 60, 0.35);
      border: 2px solid rgba(0, 0, 0, 0.25);
  }
  tr{
    background-color: rgba(0, 0, 0, 0.755);
  }
  .prevrap{
    white-space: pre-wrap;
  }
  </style>