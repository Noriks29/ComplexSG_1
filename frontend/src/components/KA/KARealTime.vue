<template>
    <div class="main_contain">

      <div class="ContentDiv">
        <h1 class="TitleText">Моделирование НЕЧЕГО НЕ ТРОГАТЬ ПОЖАЛУЙСТА</h1>

        <div class="Panel">
          <table><tbody>
              <tr><td>Начальное время расчетов:</td><td v-html="CreateDateTime(systemStatus.startTime)"></td></tr>
              <tr><td>Начало горизонта моделирования:</td><td v-html="CreateDateTime(systemStatus.modelingBegin)"></td></tr></tbody>
          </table>
        </div>
        <div class="Panel MaxWidth">
          <div class="Divfieldset">
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
            <button class="ButtonCommand rightPadding" @click="StartModelling"><img src="../../assets/start.png" alt="" class="iconButton" >Начать</button>
          </div>
        </div>

        <div class="Panel MaxWidth" v-if="true">
          <div class="PanelWork">

            <table class="colum"><tbody>
              <tr>
                <td>Заявки</td>
                <td><button class="ButtonCommand">Невыполнимые</button></td>
                <!--<td><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог выполнения</button></td>-->
              </tr>
              <tr>
                <td></td>
                <td colspan="3"><button class="ButtonCommand">Лог движка</button></td>
                <td colspan="1"><button class="ButtonCommand icon"><img src="../../assets/instructions.png" alt="smaoResponse"></button></td>
              </tr></tbody>
            </table>


          </div>
        </div>


      </div>

      

    </div>
</template>
  
<script>

import { UnixToDtime } from '@/js/WorkWithDTime';
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
        this.$showLoad(true)
        let datamodelling = {
          "experimentType": 1,
          "modellingMode": 1
        }
        let rezult = await this.$FetchPost("/api/v1/modelling/smao/dtn", datamodelling)
        console.log(rezult)

        this.$showLoad(false)
      },
    },
    async mounted(){

    }


  }
  </script>


<style lang="scss" scoped>

</style>