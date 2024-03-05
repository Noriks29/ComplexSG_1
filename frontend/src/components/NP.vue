<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="ShowModalWindow">
              <img src="../assets/left-arrow.png">
            </button>
          </div>
          
          <div class="titleText">
            Список наземных пунктов
          </div>
          <TableData @changeState="ChangeTableStatus"/>
          <ModalWindow  v-if="modalwindowDisplay" mainText="Вы уверены что хотите выйти?" infoText="Не сохранённые изменения будут утеряны" @returnValue="GetValueModalWind"/>
      </div>
  </template>
  
  <script>
import TableData from './NP_table.vue'
import ModalWindow from './ModalWindow.vue';
import StyleDefolt from '../style/component.scss'
  export default {
    name: 'NP',
    components:
    {
    TableData,
    ModalWindow
    },
    css:{
      StyleDefolt
    },
    data(){
      return{
        modalwindowDisplay: false,
        tableStatus: true,
      }
    },
    methods: {
      ChangeTableStatus(state){
        this.tableStatus = state.state
      },
      GetValueModalWind(status) {
        console.log(status.status);
        this.modalwindowDisplay = false
        if(status.status == 1){
          this.$emit('updateParentComponent', {
            nameComponent: 'TemplateComponent'
          })
        }
      },
      ShowModalWindow() {
        if(this.tableStatus == false)
        {
          this.modalwindowDisplay = true
        }
        else{
          this.GetValueModalWind({status: 1})
        }
      }
      
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>


  </style>