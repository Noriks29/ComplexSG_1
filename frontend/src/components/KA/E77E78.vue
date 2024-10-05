<template>
    <div class="DataTable">
        <div class="closebutton"><button @click="CloseTable">
          <img src="../../assets/close.svg"><span>&#8203;</span>
        </button></div>
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
  //import { FetchGet } from '../../js/LoadDisplayMetod'
  
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
          NP: {}
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
          for (let index = 0; index < this.rebuild_data.length; index++) {
            const element = this.rebuild_data[index];
            htmlcode += "<tr><td rowspan="+element.data78.length+">" + (index+1) + "</td><td rowspan="+element.data78.length+">" + element.data77.targetName + "</td><td rowspan="+element.data78.length+">" + "--" + "</td><td rowspan="+element.data78.length+">" + this.CreateDateTime(element.data77.ws) + "</td>"
            htmlcode += "<td rowspan="+element.data78.length+">" + element.data78[0].scId + "</td><td rowspan="+element.data78.length+">" + this.CreateDateTime(element.data77.te) + "</td>"
            htmlcode += "<td>"+ this.CreateDateTime(element.data78[0].timeEndConnect) +"</td><td>" + this.NP[element.data78[0].gsId] + "</td></tr>"
            for (let i = 1; i < element.data78.length; i++) {
              htmlcode += "<tr><td>"+ this.CreateDateTime(element.data78[i].timeEndConnect) +"</td><td>" + this.NP[element.data78[i].gsId] + "</td></tr>"
            }
          }
          return htmlcode
        },
          
      },
      async mounted() {
        let NPlist = await FetchGet('/api/v1/earth/get/list')
        NPlist.forEach(element => {
            this.NP[element.idNode] = element.nameEarthPoint
        });
        this.rebuild_data = []
        let dataE78 = this.dataTable2[0].dataDownPlan.partsPlan
        this.dataTable1.forEach(element => {
            let data2 = []
            dataE78.forEach(element2 => {
                if (element.orderId == element2.idOrder) {
                    data2.push(element2)
                }
            });
            this.rebuild_data.push({data77: element, data78: data2})
        });
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