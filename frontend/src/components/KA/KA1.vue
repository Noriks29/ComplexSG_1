<template>
    <div class="main_contain">
      <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false"/>
      <div>
        <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
          <img src="../../assets/exit.svg">
        </button>
      </div>

      <div class="ContentDiv">
        <h1 class="TitleText">Моделирование КА</h1>

        <div class="Panel">
          <table>
              <tr><td>Начальное время расчетов:</td><td v-html="CreateDateTime(systemStatus.startTime)"></td></tr>
              <tr><td>Начало горизонта моделирования:</td><td v-html="CreateDateTime(systemStatus.modelingBegin)"></td></tr>
              <tr><td>Окончание горизонта моделирования:</td><td v-html="CreateDateTime(systemStatus.modelingEnd)"></td></tr>
              <tr><td>Количество заявок:</td><td>{{ purposesJson }}</td></tr>
              <tr><td>Количество НП:</td><td>{{ earthSize }}</td></tr>
              <tr><td>Количество КА:</td><td></td></tr>
              <tr 
                v-for="(data, index) in ConstellationJson"
                :key="index"
              >
              <td></td><td> - {{ data.constellationName }}: {{ data.satellites.length }} КА</td>
              </tr>
          </table>
        </div>
        <div class="Panel MaxWidth">
          <div>
            <fieldset>
              <legend>Тип эксперимента:</legend>
              <div>
                <input type="radio" name="typeEx" value="1" checked />
                <label>Планирование заявок</label>
              </div>
              <div>
                <input type="radio" name="typeEx" value="2" />
                <label>Планирование заявок и планирование полёта</label>
              </div>
              <div>
                <input type="radio" name="typeEx" value="3" />
                <label>Планирование заявок и моделирование полёта</label>
              </div>
            </fieldset>
          </div>

          <div>
            <fieldset>
              <legend>Режим моделирования:</legend>
              <div>
                <input type="radio" name="typeModelling" value="1" checked />
                <label>Непрерывное моделирование</label>
              </div>
              <div>
                <input type="radio" name="typeModelling" value="2" />
                <label>Пошаговое моделирование</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="Panel MaxWidth">
          <p>Ход моделирования</p>
          <progress id="progress" max="100" :value="progressValue"></progress>
        </div>


        <div class="Panel MaxWidth">
          <div>
            <button @click="StartModelling">Начать</button>
            <button @click="progressValue--">Продолжить</button>
          </div>
        </div>

        <div class="Panel MaxWidth">
          <div class="PanelWork">

            <div class="colum FlexColum">
              <button>Лог движка</button>
              <button @click="ShowLogEvent">Лог событий</button>
            </div>

            <table class="colum">
              <tr>
                <td>Съёмка целей</td>
                <td><button>План</button></td>
                <td><button>Лог</button></td>
              </tr>
              <tr>
                <td>Доставка данных</td>
                <td><button>План</button></td>
              </tr>
              <tr>
                <td>План полёта</td>
                <td><button>План</button></td>
                <td><button>Лог</button></td>
              </tr>
            </table>

          </div>
        </div>


      </div>

      

    </div>
</template>
  
<script>

import { UnixToDtime } from '@/js/WorkWithDTime';
import { FetchGet, DisplayLoad } from '@/js/LoadDisplayMetod';
import DefaultTable from '@/components/DefaultTable.vue'
  export default {
    name: 'FlightPlaner',
    data(){
      return{
        earthSize: 0,
        purposesJson: 0,
        ConstellationJson: [],
        progressValue: 0,
        ShowDefaultTable: false,
        dataLableName: [{label: "data", nameParam: "data"}],
        dataModelling: [],
        dataTable: []
      }
    },
    components:{
      DefaultTable
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
      CreateDateTime(time){
          let Dtime = UnixToDtime(time)
          return Dtime.date + " " + Dtime.time
        },
      async StartModelling(){
        DisplayLoad(true)
        this.progressValue = 20
        let rezult = await FetchGet('/api/v1/modelling/satellite')
        console.log(await rezult)
        this.dataModelling = rezult
        this.progressValue = 100
        DisplayLoad(false)
      },
      ShowLogEvent(){
        
        this.dataTable = [{data: this.dataModelling}]
        console.log(this.dataTable)
        this.ShowDefaultTable = true
      }
    },
    async mounted(){
      DisplayLoad(true)
      let result = await FetchGet('/api/v1/earth/get/list')
      this.earthSize = result.length || 0

      result = await FetchGet('/api/v1/satrequest/request/get/all')
      this.purposesJson = result.length || 0

      result = await FetchGet('/api/v1/constellation/get/list')
      this.ConstellationJson = await result

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

</style>