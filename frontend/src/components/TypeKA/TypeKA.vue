<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
          <div class="titleText">
            Типы космических аппаратов
          </div>
          <div class="SelectDiv">

          </div>
          <div>
            <KAInfo/>
          </div>
      </div>
</template>
  
  <script>
import MainStyle from '../../style/component.scss'
import KAInfo from './KAInfo.vue'


  export default {
    name: 'TypeKA',
    data() {
      return {
        approved: true,
        datasave: true,
        dataJson: [],
        DisplayList:false

      }
    },
    components:{
      KAInfo
    },
    css:{
      MainStyle
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

<style lang="scss" scoped>
.SelectDiv{
    color: white;
    padding: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 100px;
}


</style>
  
