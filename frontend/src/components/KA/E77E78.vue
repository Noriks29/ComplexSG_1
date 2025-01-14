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
          <table class="TableDefault">
        <thead><tr>
            <th>Заявка</th>
            <th>Цель</th>
            <th>Приоритет</th>
            <th>Появление</th>
            <th>КА</th>
            <th>Съёмка</th>
            <th>Доставка</th>
            <th>НП</th>
          </tr>
          </thead>
        </table>
        <div class="scroll-table-body">
        <table class="TableDefault">
            <tbody v-html="CreateTableBody()"></tbody>
        </table>
      </div>
      </div>
    </div>
  </template>
  
  <script>
  
import { FetchGet } from '@/js/LoadDisplayMetod';
import { UnixToDtime } from '../../js/WorkWithDTime'
import XLSX from 'xlsx-js-style';
  
    export default {
      name: 'E78Data',
      props: {
        dataTable1:{
          type: Array
        },
        dataTable2:{
          type: Array
        },
      },
  
      data() {
        return {
          data: [],
          rebuild_data: [],
          priory: {}
        }
      },
      methods:
        {
          
          CloseTable(){
            this.$emit('closetable', true)
          },
          CreateDateTime(time, mode = false){
            let Dtime = UnixToDtime(time)
            if(mode) return Dtime.time
            return Dtime.time + " МСК"
          },
          CreateTableBody(){
          let htmlcode = ""
          console.log(this.rebuild_data)
          for (let index = 0; index < this.rebuild_data.length; index++) {
            const element = this.rebuild_data[index];
            htmlcode += "<tr><td rowspan="+element.data78.length+">" + (index+1) + "</td><td rowspan="+element.data78.length+">" + element.data77.targetName + "</td><td rowspan="+element.data78.length+">" + this.priory[element.data77.orderId] + "</td><td rowspan="+element.data78.length+">" + this.CreateDateTime(element.data78[0].timeAppearanceOrder) + "</td>"
            htmlcode += "<td rowspan="+element.data78.length+">" + element.data78[0].scId + "</td><td rowspan="+element.data78.length+">" + this.CreateDateTime(element.data77.te) + "</td>"
            htmlcode += "<td>"+ this.CreateDateTime(element.data78[0].timeEndConnect) +"</td><td>" + element.data78[0].earthPointName + "</td></tr>"
            for (let i = 1; i < element.data78.length; i++) {
              htmlcode += "<tr><td>"+ this.CreateDateTime(element.data78[i].timeEndConnect) +"</td><td>" + element.data78[i].earthPointName + "</td></tr>"
            }
          }
          return htmlcode
        },
        LoadXLSX(){
          const workbook = XLSX.utils.book_new();
          let data = [[
            "№","Цель","Приоритет","Появление","КА","Съёмка","Доставка","НП"
          ]]
          let indexrow = 1
          this.rebuild_data.forEach(element => {
            let row = [
              indexrow, 
              element.data77.targetName, 
              this.priory[element.data77.orderId], 
              this.CreateDateTime(element.data78[0].timeAppearanceOrder, true),
              element.data78[0].scId,
              this.CreateDateTime(element.data77.te, true),
              this.CreateDateTime(element.data78[0].timeEndConnect, true),
              element.data78[0].earthPointName
            ]
            data.push(row)
            for (let i = 1; i < element.data78.length; i++) {
              row = ["","","","","","",
                this.CreateDateTime(element.data78[i].timeEndConnect, true),
                element.data78[i].earthPointName
              ]
              data.push(row)
            }
            indexrow++
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
              console.log(error)
            }
          }
          workbook.Sheets['Data'] = worksheet;
          XLSX.writeFile(workbook, 'План выполнения.xlsx');
        }
          
      },
      async mounted() {
        console.log(this.dataTable1, this.dataTable2)
        let target = await FetchGet('/api/v1/satrequest/request/get/all') || []
        target.forEach(el => {
          this.priory[el.requestId] = el.priory
        })
        this.rebuild_data = []
        for (let i = 0; i < this.dataTable2.length; i++) {
          const dataE78 = this.dataTable2[i].dataDownPlan.partsPlan
          this.dataTable1.forEach(E77 => {
            if(E77.idSender == this.dataTable2[i].idSender){
              E77.data.forEach(element => {
                let data2 = []
                dataE78.forEach(element2 => {
                    if (element.orderId == element2.idOrder) {
                        data2.push(element2)
                    }
                });
                this.rebuild_data.push({data77: element, data78: data2})
            });
            }
          }) 
        }
        console.log(this.rebuild_data)
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
      height: 75vh;
  
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
  </style>