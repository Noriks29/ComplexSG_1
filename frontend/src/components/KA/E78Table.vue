<template>
  <div class="DataTable">
      <div class="closebutton"><button @click="CloseTable">
        <img src="../../assets/close.svg"><span>&#8203;</span>
      </button></div>
      <div class="scroll-table">
        <table class="TableDefault">
      <thead><tr>
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
      </table>
      <div class="scroll-table-body">
      <table class="TableDefault">
        <tbody v-html="CreateTableBody()">
          


          
      </tbody>
      </table>
    </div>
    </div>
  </div>
</template>

<script>

//import jsons from '../../res/testOGFree.json'
import { UnixToDtime } from '../../js/WorkWithDTime'

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
            htmlcode += "<tr><td rowspan="+element.orderList.length+">" + element.gsId + "</td><td rowspan="+element.orderList.length+">" + element.scId + "</td><td rowspan="+element.orderList.length+">" + this.CreateDateTime(element.timeStartConnect) + "</td><td rowspan="+element.orderList.length+">" + this.CreateDateTime(element.timeEndConnect) + "</td>"
            htmlcode += "<td rowspan="+element.orderList.length+"> ?? </td><td>" + element.orderList[0].idOrder + "</td><td>" + element.orderList[0].capacity + "</td><td>" + element.orderList[0].dataVolume + "</td></tr>"
            for (let i = 1; i < element.orderList.length; i++) {
              const el = element.orderList[i];
              htmlcode += "<tr><td>" + el.idOrder + "</td><td>" + el.capacity + "</td><td>" + el.dataVolume + "</td></tr>"
            }
          }
          return htmlcode
        },
        CreateDateTime(time){
          let Dtime = UnixToDtime(time)
          console.log(time)
          return Dtime.time + " МСК"
        },
        
    },
    mounted() {
      console.log( this.dataTable)
      //this.rebuild_data = []
      this.rebuild_data.push({
              timeEndConnect: this.dataTable[0].dataDownPlan.partsPlan[0].timeEndConnect,
              timeStartConnect: this.dataTable[0].dataDownPlan.partsPlan[0].timeStartConnect,
              scId: this.dataTable[0].dataDownPlan.partsPlan[0].scId,
              gsId: this.dataTable[0].dataDownPlan.partsPlan[0].gsId,
              orderList: [{ idOrder: this.dataTable[0].dataDownPlan.partsPlan[0].idOrder , capacity: this.dataTable[0].dataDownPlan.partsPlan[0].capacity, dataVolume: this.dataTable[0].dataDownPlan.partsPlan[0].dataVolume}]
            })
      for (let index = 1; index < this.dataTable[0].dataDownPlan.partsPlan.length; index++) {
        const element = this.dataTable[0].dataDownPlan.partsPlan[index];
        let flag_push = false
        for (let i = 0; i < this.rebuild_data.length; i++) {
          if (this.rebuild_data[i].gsId == element.gsId && this.rebuild_data[i].scId == element.scId) {
            this.rebuild_data[i].orderList.push({idOrder: element.idOrder , capacity: element.capacity, dataVolume: element.dataVolume})
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
              orderList: [{idOrder: element.idOrder , capacity: element.capacity, dataVolume: element.dataVolume}]
            })
          }
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