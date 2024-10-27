<template>
    <div class="DataTable">
        <div class="closebutton"><button @click="CloseTable">
          <img src="../../assets/close.svg"><span>&#8203;</span>
        </button></div>
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
  //import { FetchGet } from '../../js/LoadDisplayMetod'
  
    export default {
      name: 'Bookmark',
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
          CreateDateTime(time){
            let Dtime = UnixToDtime(time)
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
    }
  }
  .DataTable{
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0%;
    left: 0;
    width: 100%;
    z-index: 4;
    max-width: 100%;
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