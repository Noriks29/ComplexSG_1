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
        <div class="TableDiv" style="max-height: 85vh;">
          <table class="TableDefault">
          <thead>
            <tr>
          <th>НП</th>
          <th>КА</th>
          <th>Начало сеанса связи</th>
          <th>Окончание сеанса связи</th>
          <th>Пропускная способность</th>
          <th>Заявка</th>
          <th>Объём данных (МБ)</th>
          <th>Объём передаваемых данных (МБ)</th>
        </tr>
          </thead>
          <tbody v-html="CreateTableBody()">
            </tbody>
          </table>
        </div>  
      </div> 
  </div>
</template>

<script>

import { UnixToDtime } from '../../js/WorkWithDTime'
import XLSX from 'xlsx-js-style';
  export default {
    name: 'E78Data',
    props: {
      dataTable:{
        type: Array
      },
    },

    data() {
      return {
        data: [],
        rebuild_data: []
      }
    },
    methods:
      {
        CloseTable(){
          this.$emit('closetable', true)
        },
        CreateTableBody(){
          let htmlcode = ""
          for (let index = 0; index < this.rebuild_data.length; index++) {
            const element = this.rebuild_data[index];
            htmlcode += "<tr><td rowspan="+element.orderList.length+">" + element.orderList[0].earthPointName + "</td><td rowspan="+element.orderList.length+">" + element.scId + "</td><td rowspan="+element.orderList.length+">" + this.CreateDateTime(element.timeStartConnect) + "</td><td rowspan="+element.orderList.length+">" + this.CreateDateTime(element.timeEndConnect) + "</td>"
            htmlcode += "<td>"+ element.orderList[0].capacity +"</td><td>" + element.orderList[0].orderName + "</td><td>" + element.orderList[0].dataVolume + "</td><td>" + element.orderList[0].dataVolumeContact + "</td></tr>"
            for (let i = 1; i < element.orderList.length; i++) {
              const el = element.orderList[i];
              htmlcode += "<tr><td>" + el.capacity + "</td><td>" + el.orderName + "</td><td>" + el.dataVolume + "</td><td>" + el.dataVolumeContact  + "</td></tr>"
            }
          }
          return htmlcode
        },
        CreateDateTime(time){
          let Dtime = UnixToDtime(time)
          return Dtime.time
        },
        LoadXLSX(){
          const workbook = XLSX.utils.book_new();
          let data = [["НП","КА","Начало сеанса связи","Окончание сеанса связи","Пропускная способность","Заявка","Объём данных (МБ)","Объём передаваемых данных (МБ)"]]
          console.log(data,workbook)
          this.rebuild_data.forEach(element => {
            let row = [element.orderList[0].earthPointName, element.scId, this.CreateDateTime(element.timeStartConnect),  this.CreateDateTime(element.timeEndConnect),
              element.orderList[0].capacity,element.orderList[0].orderName,element.orderList[0].dataVolume,element.orderList[0].dataVolumeContact]
            data.push(row)
            for (let i = 1; i < element.orderList.length; i++) {
              const el = element.orderList[i];
              row = ["","","","", el.capacity,el.orderName,el.dataVolume,el.dataVolumeContact]
              data.push(row)
            }
          });
          console.log(data,workbook)
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
          XLSX.writeFile(workbook, 'dataPlanDelivery.xlsx');
        }
    },
    async mounted() {
      console.log("E78 mount", this.dataTable)
      this.rebuild_data.push({
              timeEndConnect: this.dataTable[0].timeEndConnect,
              timeStartConnect: this.dataTable[0].timeStartConnect,
              scId: this.dataTable[0].scId,
              gsId: this.dataTable[0].gsId,
              orderList: [{ idOrder: this.dataTable[0].idOrder, 
                orderName: this.dataTable[0].orderName, 
                earthPointName: this.dataTable[0].earthPointName, 
                capacity: this.dataTable[0].capacity, 
                dataVolume: this.dataTable[0].dataVolume,  
                dataVolumeContact: this.dataTable[0].dataVolumeContact}]
            })
      for (let index = 1; index < this.dataTable.length; index++) {
        const element = this.dataTable[index];
        let flag_push = false
        for (let i = 0; i < this.rebuild_data.length; i++) {
          if (this.rebuild_data[i].gsId == element.gsId && this.rebuild_data[i].scId == element.scId &&  this.rebuild_data[i].timeEndConnect == element.timeEndConnect &&  this.rebuild_data[i].timeStartConnect == element.timeStartConnect) {
            this.rebuild_data[i].orderList.push({idOrder: element.idOrder, orderName: element.orderName, earthPointName: element.earthPointName, capacity: element.capacity, dataVolume: element.dataVolume, dataVolumeContact: element.dataVolumeContact})
            flag_push = true
            break
          }
        }
        if(!flag_push){
            this.rebuild_data.push({
              timeEndConnect: element.timeEndConnect,
              timeStartConnect: element.timeStartConnect,
              scId: element.scId,
              gsId: element.gsId,
              orderList: [{idOrder: element.idOrder, orderName: element.orderName, earthPointName: element.earthPointName, capacity: element.capacity, dataVolume: element.dataVolume, dataVolumeContact: element.dataVolumeContact}]
            })
          }
      }
      console.log("rebuild_data",this.rebuild_data)
    }
  }
</script>


<style lang="scss" scoped>
</style>