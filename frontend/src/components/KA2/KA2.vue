<template>
    <div class="main_contain">
      <div>
        <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
          <img src="../../assets/exit.svg">
        </button>
      </div>

      <div class="ContentDiv">
        <h1 class="TitleText">Моделирование НЕЧЕГО НЕ ТРОГАТЬ ПОЖАЛУЙСТА</h1>

        <div class="Panel">
          <table>
              <tr><td>Начальное время расчетов:</td><td v-html="CreateDateTime(systemStatus.startTime)"></td></tr>
              <tr><td>Начало горизонта моделирования:</td><td v-html="CreateDateTime(systemStatus.modelingBegin)"></td></tr>
          </table>
        </div>
        <div class="Panel MaxWidth">
          <div>
            <fieldset  @change="ChangeInputRadio">
              <legend>Тип эксперимента:</legend>
              <div>
                <input type="radio" name="experimentType" value="1" checked />
                <label>Планирование заявок</label>
              </div>
              <div>
                <input type="radio" name="experimentType" value="2" />
                <label>Планирование заявок и планирование полёта</label>
              </div>
              <div>
                <input type="radio" name="experimentType" value="3" />
                <label>Планирование заявок и моделирование полёта</label>
              </div>
            </fieldset>
          </div>
        </div>
        


        <div class="Panel MaxWidth">
          <div>
            <button class="ButtonCommand rightPadding"><img src="../../assets/start.png" alt="" class="iconButton">Начать</button>
          </div>
        </div>

        <div class="Panel MaxWidth" v-if="true">
          <div class="PanelWork">

            <table class="colum">
              <tr>
                <td>Заявки</td>
                <td><button class="ButtonCommand">Невыполнимые</button></td>
                <!--<td><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог выполнения</button></td>-->
              </tr>
              <tr>
                <td></td>
                <td colspan="3"><button class="ButtonCommand">Лог движка</button></td>
                <td colspan="1"><button class="ButtonCommand icon"><img src="../../assets/instructions.png" alt="smaoResponse"></button></td>
              </tr>
            </table>


          </div>
        </div>


      </div>

      

    </div>
</template>
  
<script>

import { UnixToDtime } from '@/js/WorkWithDTime';
import { DisplayLoad } from '@/js/LoadDisplayMetod';
  export default {
    name: 'KA2',
    data(){
      return{
        
      }
    },
    components:{
    },
    props:{
        systemStatus:{
            type: Object
        },
    },
    methods: {
      SelectComponent(nameComponent) {
          this.$emit('updateParentComponent', {nameComponent: nameComponent})
      },
      CreateDateTime(time, text = true){
          let Dtime = UnixToDtime(time)
          if(!text){
            return Dtime.date + " " + Dtime.time
          }
          return Dtime.date + " " + Dtime.time + " МСК"
        },
      async StartModelling(){
        DisplayLoad(true)


        DisplayLoad(false)
      },
    },
    async mounted(){
      alert("НЕЧЕГО НЕ ТРОГАТЬ ВКЛАДКА В РАЗРАБОТКЕ")
      DisplayLoad(true)

      DisplayLoad(false)
    }


  }
  </script>


<style lang="scss" scoped>


fieldset{
  text-align: left;
}
.PanelWork{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .colum{
    flex: 1;
    button{
      width: 99%;
    }

  }

  .FlexColum{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;

    button{
      margin: 5px;
    }
  }
}
.SelectMode{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  height: 45px;
  font-size: 18px;
  div{
    img{
      width: 40px;
      &:active{
        width: 30px;
      }
      &.disable{
        pointer-events: none;
      }
    }
  }
  
}
.ContentDiv{
  height: fit-content;

}

</style>