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
            <button class="ButtonCommand rightPadding" @click="StartModelling"><img src="../../assets/start.png" alt="" class="iconButton" >Начать</button>
            <button class="ButtonCommand rightPadding" @click="StartModellingPavlov"><img src="../../assets/start.png" alt="" class="iconButton" >Начать Павлов</button>
          </div>
        </div>
        <div class="Panel MaxWidth" v-if="true">
          <div class="PanelWork">
            <table class="colum">
              <tr>
                <td><button class="ButtonCommand" @click="ShowRezult" :class="(modellingRezult.data.length < 1) ? 'disable' : ''">Результат</button></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script>

import { DisplayLoad, FetchGet } from '@/js/LoadDisplayMetod';
import DefaultTable from '../DefaultTable.vue';

import { KaSettings } from './KaSettings';
  export default {
    name: 'KA2',
    mixins: [KaSettings],
    data(){
      return{
        modellingRezult: {
          data: []
        },
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
        let rezult = await FetchGet("/api/v1/route") || []
        console.log(rezult)
        this.modellingRezult.data = rezult
        DisplayLoad(false)
      },
      async StartModellingPavlov(){
        DisplayLoad(true)
        let rezult = await FetchGet("/api/v1/planner") || []
        console.log(rezult)
        this.modellingRezult.data = rezult
        DisplayLoad(false)
      },
      ShowRezult(){
        this.dataTable = []
        this.dataLableName = [{label: "data", nameParam: "data"}]
        for (let index = 0; index < this.modellingRezult.data.length; index++) {
          const element = this.modellingRezult.data[index];
          this.dataTable.push({data: element}) 
        }
        this.PreWrapDefaultTable = false
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

</style>