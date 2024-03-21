<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/left-arrow.png">
            </button>
          </div>
          <div class="titleText">
            Список орбитальных группировок
          </div>
          <Select></Select>
      </div>
  </template>
  
  <script>
import Select from './SelectOG.vue'
import MainStyle from '../../style/component.scss'


  export default {
    name: 'OG',
    data() {
      return {
        OGTableExists: false,
        dataOGList: []
      }
    },
    css:{
      MainStyle
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
      }
    }
  }
  </script>
  
