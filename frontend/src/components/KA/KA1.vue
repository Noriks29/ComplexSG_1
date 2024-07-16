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
            <fieldset  @change="ChangeInputRadio">
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
            <fieldset  @change="ChangeInputRadio">
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
          <p @click="console.log(userFields)">Ход моделирования</p>
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

            <table class="colum">
              <tr>
                <td>Заявки</td>
                <td><button>План выполнения</button></td>
                <td><button>План доставки</button></td>
                <td><button>Невыполнимые</button></td>
                <td><button>Лог выполнения</button></td>
              </tr>
              <tr>
                <td>КА</td>
                <td><button @click="ShowShootingPlan">План съёмок</button></td>
                <td><button>План доставки</button></td>
                <td><button>План полёта</button></td>
                <td><button>Лог полёта</button></td>
              </tr>
              <tr>
                <td></td>
                <td colspan="4"><button @click="ShowLogEvent">Лог движка</button></td>
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
  export default {
    name: 'FlightPlaner',
    data(){
      return{
        mode: 0,
        earthSize: 0,
        purposesJson: 0,
        ConstellationJson: [],
        progressValue: 0,
        ShowDefaultTable: false,
        dataLableName: [{label: "data", nameParam: "data"}],
        dataModelling: [],
        dataTable: [],
        E77: {},
        earthList: []
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
      ChangeInputRadio(target){
        console.log(target.target.name, target.target.value)
      },
      async StartModelling(){
        DisplayLoad(true)
        this.progressValue = 20
        console.log(this.ConstellationJson)
        let Ka = this.ConstellationJson[0].satellites[0]

        let dataPost = {
            "experimentType": 1,
            "modellingMode": 1,
            "satellite": Ka,
            "earthPoint": this.earthList[0]
        }
        console.log(dataPost)
        let rezult = await FetchPost('/api/v1/modelling/satellite', dataPost)
        console.log("Результат", await rezult)
        this.dataModelling = rezult
        this.progressValue = 100
        DisplayLoad(false)
      },
      ShowLogEvent(){
        this.dataTable = []
        this.dataLableName = [{label: "data", nameParam: "data"}]
        for (let index = 0; index < this.dataModelling.length; index++) {
          const element = this.dataModelling[index];
          this.dataTable.push({data: element}) 
        }
        console.log(this.dataTable)
        this.ShowDefaultTable = true
      },
      ShowShootingPlan(){
        console.log(this.dataModelling)
        for (let index = 0; index < this.dataModelling.length; index++) {
          const element = JSON.parse(this.dataModelling[index]);
          console.log(element)
          if(element.type == "E77"){
            this.E77 = element
            break
          }
          
        }
        console.log(this.E77)
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
        for (let index = 0; index < this.E77.VisualFormsData.VisualFormsDataShooting.length; index++) {
          const element = this.E77.VisualFormsData.VisualFormsDataShooting[index];
          element.ws = UnixToDtime(element.ws).time
          element.we = UnixToDtime(element.we).time
          element.ts = UnixToDtime(element.ts).time
          element.te = UnixToDtime(element.te).time
          element.pitch =  Math.round(element.pitch * 100) / 100
          element.roll =  Math.round(element.roll * 100) / 100
          
          this.dataTable.push(element) 
        }
        console.log(this.dataTable[0],this.dataLableName, "fsdfdfds" )
        this.ShowDefaultTable = true
      },
      ModeLableCreate(){
        if(this.mode > 3 || this.mode < 0){
          this.mode = 0
          alert("ошибка, сброс")
        }
        switch (this.mode) {
          case 0:
            return 'Один КА'
          case 1:
            return 'ОГ с доставкой данных в сеансах связи КА-НП'
          case 2:
            return 'ОГ с доставкой данных по коммуникационной сети'
          case 3:
            return 'ОГ «рой» с доставкой данных в сеансах связи КА-НП'
          default:
            break;
        }
      },
    },
    async mounted(){
      DisplayLoad(true)
      let result = await FetchGet('/api/v1/earth/get/list')
      this.earthSize = result.length
      this.earthList = result

      result = await FetchGet('/api/v1/satrequest/request/get/all')
      this.purposesJson = result.length || 0

      result = await FetchGet('/api/v1/constellation/get/list')
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

</style>