<template>
  <div class="DataTable">
      <div class="closebutton"><button @click="CloseTable">
        <img src="../assets/close.svg"><span>&#8203;</span>
      </button></div>
      <div class="scroll-table">
        <table class="TableDefault">
      <thead>
        <tr>
          <th class="smallTh">№</th>
          <th 
            v-for="(data, index) in data"
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
          v-for="(data, index) in dataTable"
          :key="index"
        >
        <td class="smallTh">{{index}}</td>

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

//import jsons from '../../res/testOGFree.json'


  export default {
    name: 'TableData',
    props: {
      dataLableName:{
        type: Array
      },
      dataTable:{
        type: Array
      },
      prevrap:{
        type: Boolean
      }
    },

    data() {
      return {
        data: {}
      }
    },
    methods:
      {
        CloseTable(){
          this.$emit('closetable', true)
        },
        
    },
    mounted() {
      this.data = this.dataLableName
      console.log(this.dataLableName, this.dataTable)
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
.prevrap{
  white-space: pre-wrap;
}
</style>