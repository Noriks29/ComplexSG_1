<template>
    <div class="main_contain">
      <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false" :prevrap="PreWrapDefaultTable"/>
      <div class="ContentDiv">
        <div class="Panel">
          <table>
              <tr><td>Начальное время расчетов:</td><td v-html="CreateDateTime(systemStatus.startTime)"></td></tr>
              <tr><td>Начало горизонта моделирования:</td><td v-html="CreateDateTime(systemStatus.modelingBegin)"></td></tr>
          </table>
        </div>
        <div class="Panel MaxWidth">
          <div>
            <button class="ButtonCommand rightPadding" @click="StartModelling"><img src="../../assets/start.png" alt="" class="iconButton" >Начать Гордеев</button>
            <button class="ButtonCommand rightPadding" @click="StartModellingPavlov"><img src="../../assets/start.png" alt="" class="iconButton" >Начать Павлов</button>
            <fieldset style="display: inline-block;">
              <input type="checkbox"  v-model="interSatellite"/><label>interSatellite: {{ interSatellite }}</label>
            </fieldset>
          </div>
        </div>
        <div class="Panel MaxWidth" v-if="true">
          <div class="PanelWork">
            <fieldset>
              <input type="checkbox"  v-model="PreWrapDefaultTable"/><label>Форматирование вывода: {{ PreWrapDefaultTable }}</label>
            </fieldset>
            <table class="colum">
              <tr>
                <td><button class="ButtonCommand LIghtPoint" @click="GetRezultGordeev"><div :class="systemStatus.successRouteModelling ? 'approved' : 'Notapproved'"></div>Результат Гордеев</button></td>
                <td><button class="ButtonCommand LIghtPoint" @click="GetRezultPavlov"><div :class="systemStatus.successPlannerModelling ? 'approved' : 'Notapproved'"></div>Результат Павлов</button></td>
              </tr>
              <tr>
                <td><button class="ButtonCommand" @click="ShowRezult(1)" :class="(modellingRezult.data1.length < 1) ? 'disable' : ''">Результат1</button></td>
                <td><button class="ButtonCommand" @click="ShowRezult(2)" :class="(modellingRezult.data2.length < 1) ? 'disable' : ''">Результат2</button></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script>

import { DisplayLoad, FetchGet, FetchPost } from '@/js/LoadDisplayMetod';
import DefaultTable from '../DefaultTable.vue';
import { GetSystemObject } from '@/js/GlobalData';

import { KaSettings } from './KaSettings';
  export default {
    name: 'KA2',
    mixins: [KaSettings],
    data(){
      return{
        modellingRezult: {
          data1: [],
          data2: []
        },
        interSatellite: true,
        dataTable: [],
        dataLableName: [],
        PreWrapDefaultTable: false,
        ShowDefaultTable: false
      }
    },
    components:{
      DefaultTable
    },
    methods: {
      async StartModelling(){
        DisplayLoad(true)
        this.StartAwait("successRouteModelling")
        let rezult = await FetchGet("/api/v1/route", true, "Расчёт Route окончен") || []
        console.log(rezult)
        
        DisplayLoad(false)
      },
      async StartModellingPavlov(){
        DisplayLoad(true)
        this.StartAwait("successPlannerModelling")
        let rezult = await FetchPost("/api/v1/planner", {"interSatellite": this.interSatellite}, undefined, true, "Расчёт Planner окончен") || []
        console.log(rezult)
        this.modellingRezult.data = rezult
        DisplayLoad(false)
      },
      StartAwait(param){
        setTimeout(() => {
          let interval = setInterval(async () => {
            let system = await GetSystemObject()
            console.log(system)
            console.log("идут запросы системы")
            if(system[param]){
              clearInterval(interval)
              console.log("Интревал оборван")
            }
          }, 3000);
        }, 4000);
      },
      async GetRezultPavlov(){
        this.modellingRezult.data2 = await FetchGet("/api/v1/planner/all") || []
      },
      async GetRezultGordeev(){
        this.modellingRezult.data1 = await FetchGet("/api/v1/route/all") || []
      },
      ShowRezult(numb){
        this.dataTable = []
        this.dataLableName = [{label: "data", nameParam: "data"}]
        let dataT = []
        if(numb == 1){
          dataT = this.modellingRezult.data1
        }else{
          dataT = this.modellingRezult.data2
        }
        for (let index = 0; index < dataT.length; index++) {
          const element = JSON.stringify(dataT[index], null, 2);
          console.log(element)
          this.dataTable.push({data: element}) 
        }
        this.ShowDefaultTable = true
      },
      async ReLoadComponent(){
        console.log("Перезагрузка")

      }
    },
    async mounted(){
      this.ReLoadComponent()
      
      
    }
  }
  </script>


<style lang="scss" scoped>
.LIghtPoint{

  div{
    position: absolute;
    width: 10px;
    height: 10px;
    top: 20%;
    left: 10px;
    border-radius: 20px;

    &.approved{
      background-color: rgb(0, 139, 0);
      box-shadow: 0px 0px 5px rgb(11, 167, 11);
    }
    &.Notapproved{
      background-color: red;
      box-shadow: 0px 0px 5px #fe1a1a;
    }
  }


}
</style>