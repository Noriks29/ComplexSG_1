<template>
    <div class="main_contain">
      <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false" :prevrap="PreWrapDefaultTable"/>

      <div class="ContentDiv">
        <h1 class="TitleText">АГУ Внутри кластера</h1>
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

          <div class="Divfieldset">
            <fieldset  @change="ChangeInputRadio">
              <legend>Тип эксперимента:</legend>
              <div>
                <input type="radio" name="experimentType" value="1" checked />
                <label>Распределение заявок</label>
              </div>
              <div>
                <input type="radio" name="experimentType" value="2" />
                <label>Выполнение заявок</label>
              </div>
            </fieldset>
          </div>
        </div>
        <div class="Panel MaxWidth">
          <div class="PanelWork">
            <table class="colum">
              <tr>
                <td>Заявки</td>
                <td colspan="2"><button @click="EventE77E78" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План выполнения</button></td>
                <td colspan="2"><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Невыполнимые</button></td>
              </tr>
              <tr>
                <td><SelectDiv  :dataOption="arr" :valueS="valueSS" :id="'0'"  @valueSelect="SelectChange"/></td>
                <td colspan="2"><button @click="ShowShootingPlan" :class="(modellingRezultSelect.E77.length < 1) ? 'disable' : ''" class="ButtonCommand">План съёмок</button></td>
                <td colspan="2"><button @click="EventE79" :class="(modellingRezultSelect.E79.length < 1) ? 'disable' : ''" class="ButtonCommand">План полёта</button></td>
              </tr>
              <tr>
                <td></td>
                <td colspan="2"><button @click="ShowLogEvent" :class="(modellingRezult.log.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог движка</button></td>
                <td colspan="1"><button @click="ShowEventsLogResponse" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог событий</button></td>
                <td colspan="1"><button @click="ShowLogSMAO" :class="(modellingRezult.Smao.length < 1) ? 'disable' : ''" class="ButtonCommand icon"><img src="../../assets/instructions.png" alt="smaoResponse"></button></td>
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
  export default {
    name: 'KAControl_In',
    data(){
      return{
        earthSize: 0,
        purposesJson: 0,
        ConstellationJson: [],
        ShowDefaultTable: false,
        PreWrapDefaultTable: false,
        ShowE78Table: false,
        ShowE77E78Table: false,
        ShowBookmarkTable: false,
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
          hide: [],
          E79: [],
          Smao: [],
          events: []
        },
        modellingRezultSelect:{
          E77: [],
          E78: [],
          E79: [],
          selectKA: undefined
        },
        modellingNull: false,

        arr: [],
        valueSS: {},
      }
    },
    components:{
      DefaultTable,
      SelectDiv,
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
          this.modellingRezult= {
            log: [],
            E77: [],
            E78: [],
            hide: [],
            E79: [],
            Smao: [],
            events: []
          }
          this.modellingRezultSelect = {
            E77: [],
            E78: [],
            E79: [],
              selectKA: undefined
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
      ChangeInputRadio(target){
        this.modellingSettings[target.target.name] = Number(target.target.value)
      },
      async StartModelling(){
        DisplayLoad(true)
        this.modellingNull = false
        let dataPost = {
            "experimentType": this.modellingSettings.experimentType,
            "modellingMode": this.modellingSettings.modellingMode,
        }
        let rezult = await FetchPost('/api/v1/smao', dataPost) || {engineLogResponse: []}
        console.log("Результат", await rezult)
        if(rezult.engineLogResponse.length > 0){
          this.dataModelling = rezult
          this.ParceModellingRezult()
        }
        else{
          console.log("нет результата")
          this.modellingNull = true
        }
        

        DisplayLoad(false)
      },
      ParceModellingRezult(){
        this.modellingRezult = {
          Smao: [],
          log: [],
          events: [],
          E77: [],
          E78: [],
          E79: [],
          hide: []
        }
        this.modellingRezultSelect = {
          E77: [],
          E78: [],
          selectKA: this.modellingRezultSelect.selectKA
        }
        try{this.modellingRezult.Smao.push(this.dataModelling.smaoLogResponse)} 
          catch (error) {console.log(error)}
        try {this.modellingRezult.events = this.dataModelling.eventsLogResponse} 
          catch (error) {console.log(error)}
        
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
            else if (element.type == "E79"){
              if (element.setSkeleton.flightPlan.length > 0) {
                this.modellingRezult.E79.push({idSender: element.idSender, data: element.setSkeleton.flightPlan})
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
      async ShowEventsLogResponse(){
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
      EventE78(){
        this.ShowE78Table = true
      },
      EventE79(){
        this.dataTable = []
        this.dataLableName = [{lable: "Виток №", nameParam: "numberRev"},{lable: "Начало", nameParam: "timeBegin"},{lable: "Конец", nameParam: "timeEnd"},{lable: "Режим", nameParam: "mode"},{lable: "sunMode", nameParam: "sunMode"}]
        for (let index = 0; index < this.modellingRezultSelect.E79.length; index++) {
          const element = this.modellingRezultSelect.E79[index];
          this.dataTable.push({
            numberRev: element.numberRev,
            mode: element.mode,
            sunMode: element.sunMode,
            timeBegin: UnixToDtime(element.timeBegin).time,
            timeEnd: UnixToDtime(element.timeEnd).time
          }) 
        }
        this.PreWrapDefaultTable = false
        this.ShowDefaultTable = true
      },
      EventE77E78(){
        this.ShowE77E78Table = true
      },
      EventBookmark(){
        this.ShowBookmarkTable = true
      },
      SelectChange(target){
          this.modellingRezultSelect_FillById(target.value)
        },
      modellingRezultSelect_FillById(id){
        this.modellingRezultSelect = {
          E77: [],
          E78: [],
          E79: [],
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
        this.modellingRezult.E79.forEach(E79 =>{
          if (E79.idSender == id) {
            this.modellingRezultSelect.E79 = E79.data
          }
        })
        console.log(this.modellingRezultSelect)
      },
      async ReLoadComponent(){
        DisplayLoad(true)
        this.modellingNull = false
        let result = await FetchGet('/api/v1/earth/get/list') || []
        this.earthSize = result.length
        this.earthList = result

        result = await FetchGet('/api/v1/satrequest/request/get/all') || []
        this.purposesJson = result.length || 0

        result = await FetchGet('/api/v1/constellation/get/list') || []
        this.ConstellationJson = result
        this.arr = []
        for (let i = 0; i < result.length; i++) {
          for (let index = 0; index < result[i].satellites.length; index++) {
            const element = result[i].satellites[index];
            this.arr.push({value: element.idNode, lable: element.idNode + " - " + result[i].constellationName})
          }
        }
        try {
          this.valueSS = {lable: this.arr[0].lable, value: this.arr[0].value}
          this.modellingRezultSelect.selectKA = this.arr[0].value
        } catch (error) {
          console.log(error)
        }
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