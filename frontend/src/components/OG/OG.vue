<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg"><span>&#8203;</span>
            </button>
          </div>
          <div class="titleText">
            Список орбитальных группировок
          </div>
          <Select :systemStatus="systemStatus" @ChangeSystemStatus="ChangeSystemStatus"></Select>
      </div>
  </template>
  
  <script>
import Select from './SelectOG.vue'
import MainStyle from '../../style/component.scss'
  import GlobalStyle from '@/style/GlobalStyle.scss'


  export default {
    name: 'OG',
    data() {
      return {
        OGTableExists: false,
        dataOGList: []
      }
    },
    props:{
    systemStatus:{
          type: Object
        },
    },
    css:{
      MainStyle,
      GlobalStyle
    },
    components:
    {
      Select
    },
    methods: {
    SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
    ChangeSystemStatus(data){
        this.$emit('ChangeSystemStatus', data)
      }
    }
  }
  </script>

<style>

</style>
  
