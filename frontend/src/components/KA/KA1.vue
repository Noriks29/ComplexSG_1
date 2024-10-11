<template>
    <div class="main_contain">
      <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false" :prevrap="PreWrapDefaultTable"/>
      <E78Table v-if="ShowE78Table" :dataTable="modellingRezultSelect.E78" @closetable="ShowE78Table = false"/>
      <E77E78 v-if="ShowE77E78Table" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78" @closetable="ShowE77E78Table = false"/>
      <div>
        <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
          <img src="../../assets/exit.svg">
        </button>
      </div>

      <div class="ContentDiv">
        <h1 class="TitleText">Моделирование</h1>

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
        </div>
        


        <div class="Panel MaxWidth">
          <div>
            <button @click="StartModelling" class="ButtonCommand rightPadding"><img src="../../assets/start.png" alt="" class="iconButton">Начать</button>
          </div>
        </div>

        <div class="Panel MaxWidth" v-if="dataModelling.engineLogResponse.length > 0">
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
                <td><SelectDiv  :dataOption="arr" :valueS="valueSS" :id="'0'"  @valueSelect="SelectChange"/></td>
                <td><button @click="ShowShootingPlan" :class="(modellingRezultSelect.E77.length < 1) ? 'disable' : ''" class="ButtonCommand">План съёмок</button></td>
                <td><button @click="EventE78" :class="(modellingRezultSelect.E78.length < 1) ? 'disable' : ''" class="ButtonCommand">План доставки</button></td>
                <td><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">План полёта</button></td>
                <td><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог полёта</button></td>
              </tr>
              <tr>
                <td></td>
                <td colspan="3"><button @click="ShowLogEvent" class="ButtonCommand">Лог движка</button></td>
                <td colspan="1"><button @click="ShowLogSMAO" class="ButtonCommand icon"><img src="../../assets/instructions.png" alt="smaoResponse"></button></td>
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
import SelectDiv from "../SelectDiv.vue"
import E78Table from './E78Table.vue';
import E77E78 from './E77E78.vue';
  export default {
    name: 'FlightPlaner',
    data(){
      return{
        earthSize: 0,
        purposesJson: 0,
        ConstellationJson: [],
        ShowDefaultTable: false,
        PreWrapDefaultTable: false,
        ShowE78Table: false,
        ShowE77E78Table: false,
        dataLableName: [{label: "data", nameParam: "data"}],
        dataModelling: {
          engineLogResponse: []
        },
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
        },
        modellingRezultSelect:{
          E77: [],
          E78: [],
          selectKA: undefined
        },

        arr: [],
        valueSS: {},
      }
    },
    components:{
      DefaultTable,
      E78Table,
      E77E78,
      SelectDiv
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
        let dataPost = {
            "experimentType": this.modellingSettings.experimentType,
            "modellingMode": this.modellingSettings.modellingMode,
        }
        let rezult = await FetchPost('/api/v1/modelling/smao', dataPost) || {engineLogResponse: []}
        console.log("Результат", await rezult)
        if(rezult.engineLogResponse.length > 0){
          this.dataModelling = rezult
          this.ParceModellingRezult()
        }
        else{
          console.log("нет результата")
        }
        

        DisplayLoad(false)
      },
      ParceModellingRezult(){
        this.modellingRezult = {
          Smao: [],
          log: [],
          E77: [],
          E78: [],
          hide: []
        }
        this.modellingRezultSelect = {
          E77: [],
          E78: [],
          selectKA: this.modellingRezultSelect.selectKA
        }
        try {
          this.modellingRezult.Smao.push(this.dataModelling.smaoLogResponse)
        } catch (error) {
          console.log(error)
        }
        this.dataModelling.engineLogResponse.forEach(element => {
          try {
            element.time = this.CreateDateTime(element.time, false)
            this.modellingRezult.log.push(element)
            if(element.type == "E77"){
              let oneE77 = {idSender:  element.idSender, data: []}
              for (let index = 0; index < element.visualFormsData.visualFormsDataShooting.length; index++) {
                const e = Object.assign({}, element.visualFormsData.visualFormsDataShooting[index]);
                oneE77.data.push(e)
              }
              this.modellingRezult.E77.push(oneE77)
              
            }
            else if (element.type == "E78"){
              if (element.dataDownPlan.partsPlan.length > 0) {
                this.modellingRezult.E78.push(element)
              }
            }
          } catch (error) {
            console.log(error, element)
            this.modellingRezult.log.push("-!-!-!-!-ОШИБКА обработки на строке - " + element)
          }
        });
        this.modellingRezultSelect_FillById(this.modellingRezultSelect.selectKA)
        console.log(this.modellingRezult)
      },
      ShowLogEvent(){
        this.dataTable = []
        this.dataLableName = [{label: "data", nameParam: "data"}]
        for (let index = 0; index < this.modellingRezult.log.length; index++) {
          const element = this.modellingRezult.log[index];
          this.dataTable.push({data: element}) 
        }
        this.PreWrapDefaultTable = false
        this.ShowDefaultTable = true
      },
      ShowLogSMAO(){
        this.dataTable = []
        this.dataLableName = [{label: "data", nameParam: "data"}]
        for (let index = 0; index < this.modellingRezult.Smao.length; index++) {
          const element = this.modellingRezult.Smao[index];
          this.dataTable.push({data: element}) 
        }
        this.PreWrapDefaultTable = true
        this.ShowDefaultTable = true
      },
      ShowShootingPlan(){
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
        for (let index = 0; index < this.modellingRezultSelect.E77.length; index++) {
          let element = Object.assign({}, this.modellingRezultSelect.E77[index]);
          element.ws = UnixToDtime(element.ws).time
          element.we = UnixToDtime(element.we).time
          element.ts = UnixToDtime(element.ts).time
          element.te = UnixToDtime(element.te).time
          element.pitch =  Math.round(element.pitch * 100) / 100
          element.roll =  Math.round(element.roll * 100) / 100
          this.dataTable.push(element) 
        }
        this.PreWrapDefaultTable = false
        this.ShowDefaultTable = true
      },
      EventE78(){
        this.ShowE78Table = true
      },
      EventE77E78(){
        this.ShowE77E78Table = true
      },
      SelectChange(target){
          //this.modellingRezultSelect.selectKA = target.value
          //console.log(this.modellingRezultSelect.selectKA, target.value)
          this.modellingRezultSelect_FillById(target.value)
        },
      modellingRezultSelect_FillById(id){
        this.modellingRezultSelect = {
          E77: [],
          E78: [],
          selectKA: id
        }
        this.modellingRezult.E77.forEach(E77 =>{
          if (E77.idSender == id) {
            this.modellingRezultSelect.E77 = E77.data
          }
        })
        this.modellingRezult.E78.forEach(E78 =>{
          if (E78.idSender == id) {
            this.modellingRezultSelect.E78 = E78.dataDownPlan.partsPlan
          }
        })
        console.log(this.modellingRezultSelect)
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
        for (let i = 0; i < result.length; i++) {
          
          for (let index = 0; index < result[i].satellites.length; index++) {
            const element = result[i].satellites[index];
            this.arr.push({value: element.idNode, lable: element.idNode + " - " + result[i].constellationName})
          }
        }
        this.valueSS = {lable: this.arr[0].lable, value: this.arr[0].value}
        this.modellingRezultSelect.selectKA = this.arr[0].value

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