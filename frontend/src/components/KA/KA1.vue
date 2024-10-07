<template>
    <div class="main_contain">
      <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false"/>
      <E78Table v-if="ShowE78Table" :dataTable="modellingRezult.E78" @closetable="ShowE78Table = false"/>
      <E77E78 v-if="ShowE77E78Table" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78" @closetable="ShowE77E78Table = false"/>
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

          <div>
            <fieldset  @change="ChangeInputRadio">
              <legend>Режим моделирования:</legend>
              <div>
                <input type="radio" name="modellingMode" value="1" checked />
                <label>Непрерывное моделирование</label>
              </div>
              <div>
                <input type="radio" name="modellingMode" value="2" />
                <label>Пошаговое моделирование</label>
              </div>
            </fieldset>
          </div>
        </div>
        
        <div class="Panel MaxWidth">
          <p @click="console.log(userFields)">Ход моделирования</p>
          <progress id="progress" max="100" :value="progressValue"></progress>
        </div>


        <div class="Panel MaxWidth">
          <div>
            <button @click="StartModelling" class="ButtonCommand rightPadding"><img src="../../assets/start.png" alt="" class="iconButton">Начать</button>
            <button @click="progressValue--" class="ButtonCommand">Продолжить</button>
          </div>
        </div>

        <div class="Panel MaxWidth" v-if="dataModelling.length > 0">
          <div class="PanelWork">

            <table class="colum">
              <tr>
                <td>Заявки</td>
                <td><button @click="EventE77E78" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План выполнения</button></td>
                <td><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">План доставки</button></td>
                <td><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Невыполнимые</button></td>
                <td><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог выполнения</button></td>
              </tr>
              <tr>
                <td>КА</td>
                <td><button @click="ShowShootingPlan" :class="(modellingRezult.E77.length < 1) ? 'disable' : ''" class="ButtonCommand">План съёмок</button></td>
                <td><button @click="EventE78" :class="(modellingRezult.E78.lenght < 1) ? 'disable' : ''" class="ButtonCommand">План доставки</button></td>
                <td><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">План полёта</button></td>
                <td><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог полёта</button></td>
              </tr>
              <tr>
                <td></td>
                <td colspan="4"><button @click="ShowLogEvent" class="ButtonCommand">Лог движка</button></td>
              </tr>
            </table>


          </div>
        </div>


      </div>

      

    </div>
</template>
  
<script>

import { UnixToDtime } from '@/js/WorkWithDTime';
import { FetchGet, DisplayLoad, FetchPost } from '@/js/LoadDisplayMetod';
import DefaultTable from '@/components/DefaultTable.vue'
import E78Table from './E78Table.vue';
import E77E78 from './E77E78.vue';
  export default {
    name: 'FlightPlaner',
    data(){
      return{
        earthSize: 0,
        purposesJson: 0,
        ConstellationJson: [],
        progressValue: 0,
        ShowDefaultTable: false,
        ShowE78Table: false,
        ShowE77E78Table: false,
        dataLableName: [{label: "data", nameParam: "data"}],
        dataModelling: [],
        dataTable: [],
        earthList: [],
        modellingSettings:{
          experimentType: 1,
          modellingMode: 1
        },
        modellingRezult: {
          log: [],
          E77: [],
          E78: [],
          hide: []
        }
      }
    },
    components:{
      DefaultTable,
      E78Table,
      E77E78
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
      ChangeInputRadio(target){
        this.modellingSettings[target.target.name] = Number(target.target.value)
      },
      async StartModelling(){
        DisplayLoad(true)
        this.progressValue = 20
        let dataPost = {
            "experimentType": this.modellingSettings.experimentType,
            "modellingMode": this.modellingSettings.modellingMode,
        }
        let rezult = await FetchPost('/api/v1/modelling/smao', dataPost) || []
        console.log("Результат", await rezult)
        if(rezult.length < 1){
          alert("Пустой результат моделирования")
          this.progressValue = 50
        }
        else{
          this.dataModelling = rezult
          this.ParceModellingRezult()
          this.progressValue = 100
        }
        

        DisplayLoad(false)
      },
      ParceModellingRezult(){
        this.modellingRezult = {
          log: [],
          E77: [],
          E78: [],
          hide: []
        }
        //console.log(this.dataModelling)
        this.dataModelling.forEach(e => {
          try {
            const element = JSON.parse(e)
            element.time = this.CreateDateTime(element.time, false)
            this.modellingRezult.log.push(element)
            if(element.type == "E77"){
              for (let index = 0; index < element.VisualFormsData.VisualFormsDataShooting.length; index++) {
                const e = Object.assign({}, element.VisualFormsData.VisualFormsDataShooting[index]);
                this.modellingRezult.E77.push(e)
              }
              
            }
            else if (element.type == "E78"){
              if (element.dataDownPlan.partsPlan.length > 0) {
                this.modellingRezult.E78.push(element)
              }
            }
          } catch (error) {
            console.log(error)
            this.modellingRezult.log.push("-!-!-!-!-ОШИБКА обработки на строке - " + e)
          }
        });
        console.log(this.modellingRezult)
      },
      ShowLogEvent(){
        this.dataTable = []
        this.dataLableName = [{label: "data", nameParam: "data"}]
        for (let index = 0; index < this.modellingRezult.log.length; index++) {
          const element = this.modellingRezult.log[index];
          this.dataTable.push({data: element}) 
        }
        this.ShowDefaultTable = true
      },
      ShowShootingPlan(){
        console.log(this.modellingRezult)
        this.dataTable = []
        this.dataLableName = [
          {lable: "Заявка", nameParam: "orderId"},
          {lable: "Цель", nameParam: "targetName"},
          {lable: "Начало видимости", nameParam: "ws"},
          {lable: "Окончание видимости", nameParam: "we"},
          {lable: "Разворот", nameParam: "transition"},
          {lable: "Начало съёмки", nameParam: "ts"},
          {lable: "Окончаниие съёмки", nameParam: "te"},
          {lable: "Тангаж", nameParam: "pitch"},
          {lable: "Крен", nameParam: "roll"},
        ]
        for (let index = 0; index < this.modellingRezult.E77.length; index++) {
          let element = Object.assign({}, this.modellingRezult.E77[index]);
          element.ws = UnixToDtime(element.ws).time
          element.we = UnixToDtime(element.we).time
          element.ts = UnixToDtime(element.ts).time
          element.te = UnixToDtime(element.te).time
          element.pitch =  Math.round(element.pitch * 100) / 100
          element.roll =  Math.round(element.roll * 100) / 100
          this.dataTable.push(element) 
        }
        this.ShowDefaultTable = true
      },
      EventE78(){
        this.ShowE78Table = true
      },
      EventE77E78(){
        this.ShowE77E78Table = true
      }
    },
    async mounted(){
      DisplayLoad(true)
      let result = await FetchGet('/api/v1/earth/get/list') || []
      this.earthSize = result.length
      this.earthList = result

      result = await FetchGet('/api/v1/satrequest/request/get/all') || []
      this.purposesJson = result.length || 0

      result = await FetchGet('/api/v1/constellation/get/list') || []
      this.ConstellationJson = result


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