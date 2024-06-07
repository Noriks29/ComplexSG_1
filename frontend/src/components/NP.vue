<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../assets/exit.svg">
            </button>
          </div>
          
          <div class="titleText">
            Список наземных пунктов
          </div>
          <TableData :systemStatus="systemStatus" @ChangeSystemStatus="ChangeSystemStatus"/>
      </div>
  </template>
  
  <script>
import TableData from './NP_table.vue'
import StyleDefolt from '../style/component.scss'
  export default {
    name: 'NP',
    components:
    {
    TableData,
    },
    css:{
      StyleDefolt
    },
    data(){
      return{
        
      }
    },
    props:{
    systemStatus:{
          type: Object
        },
    },
    methods: {
      ChangeSystemStatus(data){
        this.$emit('ChangeSystemStatus', data)
      },
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      }
      
    }
  }
  </script>
