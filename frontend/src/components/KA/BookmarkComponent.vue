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
            <th>КА</th>
            <th>Время связи</th>
            <th>НП связи</th>
            <th>Название целей</th>
            <th>Время съёмки</th>
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
  //import { FetchGet } from '../../js/LoadDisplayMetod'
  
    export default {
      name: 'BookmarkTable',
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
            if(element.data.length == 0){ //для пустых полей
              htmlcode += "<tr><td style='border-top: 1px solid white;'>" + element.satelliteId + "</td><td style='border-top: 1px solid white;'>" + this.CreateDateTime(element.begin) + "</td><td style='border-top: 1px solid white;'>" + element.earthName + "</td><td style='border-top: 1px solid white;'></td><td style='border-top: 1px solid white;'></td></tr>"
            }
            else{
              htmlcode += "<tr><td rowspan="+element.data.length+" style='border-top: 1px solid white;'>" + element.satelliteId + "</td><td rowspan="+element.data.length+" style='border-top: 1px solid white;'>" + this.CreateDateTime(element.begin) + "</td><td rowspan="+element.data.length+" style='border-top: 1px solid white;'>" +  element.earthName + "</td>"
              htmlcode += "<td style='border-top: 1px solid white;'>" + element.data[0].targetName + "</td><td style='border-top: 1px solid white;'>" + this.CreateDateTime(element.data[0].time) + "</td></tr>"
              for (let i = 1; i < element.data.length; i++) {
              htmlcode += "<td>" + element.data[i].targetName + "</td><td>" + this.CreateDateTime(element.data[i].time) + "</td></tr>"
            }
            }
          }
          return htmlcode
        },
        LoadXLSX(){
          const workbook = XLSX.utils.book_new();
          let data = [[
            "КА","Время связи","НП связи","Название целей","Время съёмки"
          ]]
          this.rebuild_data.forEach(element => {
            let row = [
                element.satelliteId, 
                this.CreateDateTime(element.begin, true),
                element.earthName
              ]
            if(element.data.length !== 0){
              row.push(element.data[0].targetName)
              row.push(this.CreateDateTime(element.data[0].time, true))
            }
            data.push(row)
            for (let i = 1; i < element.data.length; i++) {
              row = ["","","",
                element.data[i].targetName,
                this.CreateDateTime(element.data[i].time, true)
              ]
              data.push(row)
            }
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
          XLSX.writeFile(workbook, 'План закладок.xlsx');
        }
          
      },
      async mounted() {
        console.log(this.dataTable1, this.dataTable2)

        let target = await FetchGet('/api/v1/modelling/data/earth-sat/all') || []
        this.rebuild_data = target
        this.rebuild_data.forEach(datareb => {
          datareb.data = []
        })

        let rebuild_dataE77E78 = []
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
                rebuild_dataE77E78.push({data77: element, data78: data2, use: false})
            });
            }
          }) 
        }

        for (let index = 0; index < rebuild_dataE77E78.length; index++) {
          const element = rebuild_dataE77E78[index];
          for (let jindex = 0; jindex < this.rebuild_data.length; jindex++) {
            const jelement = this.rebuild_data[jindex];
            if(jelement.satelliteId == element.data78[0].scId && jelement.begin <= element.data77.te && !element.use)
            {
              jelement.data.push({time: element.data77.te, targetName: element.data77.targetName})
              element.use = true
            }
          }
          
        }

        console.log(this.rebuild_data, rebuild_dataE77E78)
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