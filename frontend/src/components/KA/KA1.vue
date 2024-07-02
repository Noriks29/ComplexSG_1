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

        <div class="Panel MaxWidth SelectMode">
          <div><img  @click="mode--" :class="mode < 1 ? 'disable' : ''" src="../../assets/arrow1.png" alt="назад"></div>
          <div v-html="ModeLableCreate()"></div>
          <div><img  @click="mode++" :class="mode > 2 ? 'disable' : ''" src="../../assets/arrow2.png" alt="назад"></div>
        </div>

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
import { FetchGet, DisplayLoad } from '@/js/LoadDisplayMetod';
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
        E77: {}
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
      this.earthSize = result.length || 0

      result = await FetchGet('/api/v1/satrequest/request/get/all')
      this.purposesJson = result.length || 0

      result = await FetchGet('/api/v1/constellation/get/list')
      this.ConstellationJson = await result

      this.E77 = {
        "time":	1716623030.0800357,
        "type":	"E77",
        "idReceiver":	0,
        "idSender":	66,
        "VisualFormsData":	{
          "idNode":	0,
          "idSat":	0,
          "state":	0,
          "VisualFormsDataShooting":	[{
              "idNode":	66,
              "orderId":	1,
              "targetName":	"Samara",
              "ws":	1716622999.9995081,
              "we":	1716623104.9995062,
              "ts":	38647.499507146422,
              "te":	38657.499507146422,
              "transition":	22,
              "roll":	-16.43999999681488,
              "pitch":	5.8250000911299153
            }, {
              "idNode":	66,
              "orderId":	2,
              "targetName":	"Penza",
              "ws":	1716623015.0000358,
              "we":	1716623110.0000341,
              "ts":	38686.718784451514,
              "te":	38696.718784451514,
              "transition":	29,
              "roll":	26.16843750447908,
              "pitch":	-23.397812372495533
            }, {
              "idNode":	66,
              "orderId":	3,
              "targetName":	"Saranck",
              "ws":	1716623030.0000355,
              "we":	1716623125.0000339,
              "ts":	38713.6719089497,
              "te":	38723.6719089497,
              "transition":	15,
              "roll":	22.162500005573968,
              "pitch":	-32.933749874585772
            }],
          "nShooting":	3
        }
      }

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