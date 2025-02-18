<template>
  <div class="main_contain">
    <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false" :prevrap="PreWrapDefaultTable"/>
    <div class="ContentDiv">
      <h1 class="TitleText">АГУ Между кластерами</h1>
      <div class="FlexRow Panel">
        <div class="ButtonModelling">
          <button v-if="!ExperimentStatus" @click="Experiment(true)" class="ButtonCommand rightPadding"><img src="../../assets/start.png" alt="" class="iconButton">Начать эксперимент</button>
          <button v-if="ExperimentStatus" @click="StartModelling" class="ButtonCommand rightPadding"><img src="../../assets/start.png" alt="" class="iconButton">Старт моделирования</button>
          <button v-if="ExperimentStatus" @click="Experiment(false)" class="ButtonCommand rightPadding">Закончить эксперимент</button>
        </div>
        <div class="TableSystem">
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
            <td>- {{ data.constellationName }}:</td><td>{{ data.satellites.length }} КА</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="Panel MaxWidth">
        <div class="PanelWork">
          <table class="colum">
            <tr>
              <td><button :class="false ? 'disable' : ''" class="ButtonCommand">Время доставки</button></td>
              <td><button :class="false ? 'disable' : ''" class="ButtonCommand">Сеансы связи с НП</button></td>
              <td><button :class="false ? 'disable' : ''" class="ButtonCommand">Загрузки памяти МКА</button></td>
              <td><button :class="false ? 'disable' : ''" class="ButtonCommand">Маршруты доставки</button></td>
            </tr>
            <tr>
              <td></td>
              <td colspan="1"><button :class="false ? 'disable' : ''" class="ButtonCommand" @click="ShowEngineLog">Лог движка</button></td>
              <td colspan="1"><button :class="false ? 'disable' : ''" class="ButtonCommand" @click="ShowEventLog">Лог событий</button></td>
              <td colspan="1"><button :class="false ? 'disable' : ''" class="ButtonCommand icon" @click="ShowLogSMAO"><img src="../../assets/instructions.png" alt="smaoResponse"></button></td>
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
  name: 'KAControl_Out',
  data(){
    return{
      earthSize: 0,
      purposesJson: 0,
      ConstellationJson: [],
      ShowDefaultTable: false,
      PreWrapDefaultTable: false,
      dataLableName: [{label: "data", nameParam: "data"}],
      dataModelling: {},
      dataTable: [],
      modellingNull: false,
      RezultModelling: {
        engineLogResponse: [],
        eventsLogResponse: [],
        smaoLogResponse: ""
      }
    }
  },
  components:{
    DefaultTable,
  },
  props:{
      systemStatus:{
          type: Object
      },
      reload:{
        type: Number
      },
      ExperimentStatus:{
        type: Boolean
      }
  },
  watch: {
  // всякий раз когда question меняется, эта функция будет запускаться
  reload(newreload, oldreload) {
    console.log(newreload, oldreload)
    this.ReLoadComponent()
  }
},
  methods: {
    Experiment(status){
      if(status){
        if(!this.systemStatus.earthStatus){
          alert("НП не утверждены")
          return
        }
        if(!this.systemStatus.constellationStatus){
          alert("КА и ОГ не утверждены")
          return
        }
        if(this.ConstellationJson.length < 1){
          alert("Нет КА")
          return
        }
        if(this.earthSize < 1){
          alert("Нет НП")
          return
        }
        if(this.purposesJson < 1){
          alert("Нет заявок")
          return
        }
      }
      else{
        this.dataModelling = {
          engineLogResponse: []
        }
      }
      this.modellingNull = false
      this.$emit('ChangeExperimentStatus', {status})
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
      this.modellingNull = false
      this.RezultModelling = {
        engineLogResponse: [],
        eventsLogResponse: [],
        smaoLogResponse: ""
      }
      let dataPost = {"experimentType":1,"modellingMode":1}
      let rezult = await FetchPost("/api/v1/modelling/smao/dtn", dataPost) || {};
      console.log(rezult);
      if(rezult.engineLogResponse.length > 0){
        this.RezultModelling.engineLogResponse = rezult.engineLogResponse
      }
      else{
        console.log("нет результата")
        this.modellingNull = true
      }
      try {
        this.RezultModelling.eventsLogResponse = rezult.eventsLogResponse
        this.RezultModelling.smaoLogResponse = rezult.smaoLogResponse
      } catch (error) {
        console.log(error)
      }
      DisplayLoad(false)
    },
    ParceModellingRezult(){
      /*
      this.dataModelling.engineLogResponse.forEach(element => {
        try {
          element.time = this.CreateDateTime(element.time, false)
          this.modellingRezult.log.push(element)
      
        } catch (error) {
          console.log(error, element)
          this.modellingRezult.log.push("-!-!-!-!-ОШИБКА обработки на строке - " + element)
        }
      });
      this.modellingRezultSelect_FillById(this.modellingRezultSelect.selectKA)
      console.log(this.modellingRezult)*/
    },
    ShowEngineLog(){
      this.dataTable = []
      this.dataLableName = [{lable: "data", nameParam: "data"}]
      for (let index = 0; index < this.RezultModelling.engineLogResponse.length; index++) {
        let element = this.RezultModelling.engineLogResponse[index];
        this.dataTable.push({data:element}) 
      }
      this.PreWrapDefaultTable = false
      this.ShowDefaultTable = true
    },
    async ShowEventLog(){
      this.dataTable = []
        this.dataLableName = [
          {lable: "Время", nameParam: "time"},
          {lable: "Код", nameParam: "code"},
          {lable: "Событие", nameParam: "event"},
          {lable: "Заявка", nameParam: "orderId"},
          {lable: "Узел 1", nameParam: "nodeId"},
          {lable: "Узел 2", nameParam: "nodeId2"},
          {lable: "Коментарий", nameParam: "text"},
          {lable: "Значение", nameParam: "value"},
        ]
        let events = await FetchGet('/api/v1/event/codes/all') || []
        let dataevents = {}
        events.forEach(element => dataevents[element.codeEvent]=element.descriptionEvent)
        let rezult = await FetchGet('/api/v1/satrequest/request/get/all') || []
        let datarequest = {}
        rezult.forEach(element => datarequest[element.requestId]=element.catalog.goalName)
        console.log(datarequest)
        for (let index = 0; index < this.modellingRezult.events.length; index++) {
          const element = this.modellingRezult.events[index]
          this.dataTable.push({
            time: UnixToDtime(element.time).time,
            code: element.type,
            event: dataevents[element.type] || "нет записи",
            orderId: datarequest[element.orderId] || "нет заявки",
            nodeId: element.node1Id,
            nodeId2: element.node2Id,
            text: element.text,
            value: element.value
          })
        }
        this.PreWrapDefaultTable = false
        this.ShowDefaultTable = true
    },
    ShowLogSMAO(){
        this.dataTable = []
        this.dataLableName = [{label: "data", nameParam: "data"}]
        for (let index = 0; index < this.RezultModelling.smaoLogResponse.length; index++) {
          const element = this.RezultModelling.smaoLogResponse[index];
          this.dataTable.push({data: element}) 
        }
        this.PreWrapDefaultTable = true
        this.ShowDefaultTable = true
    },
    async ReLoadComponent(){
      DisplayLoad(true)
      this.modellingNull = false
      let result = await FetchGet('/api/v1/earth/get/list') || []
      this.earthSize = result.length
      result = await FetchGet('/api/v1/satrequest/request/get/all') || []
      this.purposesJson = result.length || 0
      result = await FetchGet('/api/v1/constellation/get/list') || []
      this.ConstellationJson = result
      DisplayLoad(false)
    }
  },
  async mounted(){
    this.ReLoadComponent()
  }


}
</script>


<style lang="scss" scoped>

</style>