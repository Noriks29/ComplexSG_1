<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../assets/left-arrow.png">
            </button>
          </div>
          <div class="titleText">
            Список наземных пунктов
          </div>
            <TableData/>
      </div>
  </template>
  
  <script>
import TableData from './NP_table.vue'

  export default {
    name: 'NP',
    components:
    {
    TableData,
},
    methods: {
    SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

.ToMenuButtonDiv{
    position: fixed;
    top: 20px;
    left: 20px;
    padding: 0px;
    border: none;
    background: none;

    img{
      width: 30px;
    }
  }

  .button_flex{
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
  }
  
  .main_contain{
      height: 90vh;
      max-width: 99%;
  }   
  .button_level{
      display: flex;
      flex-wrap: wrap;
      width: 90%;
      margin-top: 15px;
  }
  .button_level div{
      margin: 10px;
      padding: 3px;
      flex: 1;
  }
  
  .button_level button{
      background: none;
      height: 100%;
      width: 100%;
      font-size: 30px;
  }
  .titleText{
    color: black;
    font-size: 20px;

  }
  </style>