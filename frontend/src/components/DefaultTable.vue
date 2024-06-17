<template>
  <div class="DataTable">
    <div class="PanelDefault">
      <div class="closebutton"><button @click="CloseTable">
        <img src="../assets/close.svg"><span>&#8203;</span>
      </button></div>
      <div class="scroll-table">
        <table class="TableDefault">
<thead>
        <tr>
          <th>№</th>
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
          v-for="(data, index) in dataTable"
          :key="index"
        >
        <td>{{index}}</td>

          <td
            v-for="(dataLable, index) in dataLableName"
            :key="index"
          >{{ data[dataLable.nameParam] }}</td>
        </tr>
      </tbody>
      </table>
    </div>
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
        type: Object
      },
      dataTable:{
        type: Object
      },
    },

    data() {
      return {
        //dataJson: jsons,
      }
    },
    methods:
      {
        CloseTable(){
          this.$emit('closetable', true)
        },
        
    },
    mounted() {
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
  top: 1%;
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




</style>