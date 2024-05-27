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
            <div class="SelectDivList">
            <div class="divflex PanelDefault">
              <!--<div @click="DisplayList= !DisplayList" >{{ tableDisplay ? dataJsonTable.constellationName : 'Модель космического аппарата не выбрана' }}</div>-->
              <!--<table :class="DisplayList ? 'active' :'disable'" class="TableDefault" >
                  <tr v-for="data, index in dataJson"
                      :key="index"
                      @click="SelectOGData(index)"
                      v-show="!(data.deleted==true)"
                      
                      >
                  <td colspan="2">{{ data.constellationName }}</td><td>{{ data.arbitraryFormation ? "Произвольное" : "Плоскостное" }}</td>
                      <td v-if="!approved" :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
                </tr>
                <tr v-if="!approved" class="addRowButton">
                  <td colspan="4"><Button @click="ShowModalWindow">Добавить аппарат</Button></td>
                </tr> 
              </table>
              -->
            </div>
            </div>

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
  
