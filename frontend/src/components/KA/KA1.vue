<template>
    <div class="main_contain">
      <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false" :prevrap="PreWrapDefaultTable"/>
      <E78Table v-if="ShowE78Table" :dataTable="modellingRezultSelect.E78" @closetable="ShowE78Table = false"/>
      <E77E78 v-if="ShowE77E78Table" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78" @closetable="ShowE77E78Table = false"/>
      <BookmarkTable v-if="ShowBookmarkTable" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78" @closetable="ShowBookmarkTable = false"/>
      <FlightplanForm v-if="ShowTable=='FlightplanForm'" :dataTable="modellingRezultSelect.E79" @closetable="ShowTable=null"/>
      <div class="ContentDiv">
        <h1 class="TitleText">Планирование съемок</h1>
        <div class="FlexRow Panel">
          <div class="ButtonModelling">
            <button v-if="!ExperimentStatus && !modellingSettings.experimentEddit" @click="Experiment(true)" class="ButtonCommand rightPadding"><img src="../../assets/start.png" alt="" class="iconButton">Начать эксперимент</button>
            <button v-if="ExperimentStatus" @click="StartModelling" class="ButtonCommand rightPadding"><img src="../../assets/start.png" alt="" class="iconButton">Старт моделирования</button>
            <button v-if="ExperimentStatus" @click="Experiment(false)" class="ButtonCommand rightPadding">Закончить эксперимент</button>
          </div>
          <div class="TableSystem">
            <table>
              <tr><td>Начальное время расчетов:</td><td v-html="CreateDateTime(systemStatus.startTime)"></td></tr>
              <tr><td>Начало горизонта моделирования:</td><td v-html="CreateDateTime(systemStatus.modelingBegin)"></td></tr>
              <tr><td>Окончание горизонта моделирования:</td><td v-html="CreateDateTime(systemStatus.modelingEnd)"></td></tr>
              <tr><td>Количество заявок:</td><td>{{ purposesJson }}</td></tr>
              <tr><td>Количество НП:</td><td>{{ earthList.length }}</td></tr>
              <tr><td>Количество КА:</td><td></td></tr>
              <tr 
                v-for="(data, index) in ConstellationJson"
                :key="index"
              >
              <td>- {{ data.constellationName }}:</td><td>{{ data.satellites.length }} КА</td>
              </tr>
            </table>
          </div>

          <div class="TableSystem" style="flex: 2 0 auto;">
            <table style="text-align: left;">
              <tr><td colspan="2">
                <button v-if="!ExperimentStatus && !modellingSettings.experimentEddit" @click="modellingSettings.experimentEddit=true" class="ButtonCommand MaxWidth" >Настройки</button>
                <button v-if="!ExperimentStatus && modellingSettings.experimentEddit" @click="modellingSettings.experimentEddit=false" class="ButtonCommand MaxWidth">Закрыть настройки</button></td></tr>
              <tr v-for="data, index in modellingSettingsLabel" :key="index"
              
              ><td>{{ data.name }}:</td><td>{{ data.label[Number(modellingSettings[index])] }}</td></tr>
            </table>
          </div>
        </div>
        <div class="Panel MaxWidth" style="flex:1;">
          <div class="PanelWork" v-if="!modellingSettings.experimentEddit">
            <table class="colum">
              <tr>
                <td>Заявки</td>
                <td class="tdflexRow">
                  <button v-if="systemStatus.typeWorkplace==2" @click="EventE77E78" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План выполнения заявок</button>
                  <button v-if="systemStatus.typeWorkplace==2" @click="EventBookmark" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План закладок</button>
                  <button v-if="systemStatus.typeWorkplace in {1:null,3:null,4:null}" :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог выполнения заявок</button>
                  <button v-if="systemStatus.typeWorkplace in {3:null,4:null}" :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог загрузки сеансов связи</button>
                  <button v-if="systemStatus.typeWorkplace in {3:null,4:null}" :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог передачи данных в сеансе связи</button>
                  <button v-if="systemStatus.typeWorkplace in {3:null,4:null}" :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Сроки доставки данных</button>
                </td>
              </tr>
              <tr>
                <td><SelectDiv  :dataOption="arr" :valueS="valueSS" :id="'0'"  @valueSelect="SelectChange"/></td>
                <td class="tdflexRow">
                  {{ ShowTable  }}
                  <button @click="ShowShootingPlan" :class="(modellingRezultSelect.E77.length < 1) ? 'disable' : ''" class="ButtonCommand">План съёмок</button>
                  <button v-if="systemStatus.typeWorkplace in {2:null}" @click="EventE78" :class="(modellingRezultSelect.E78.length < 1) ? 'disable' : ''" class="ButtonCommand">План доставки</button>
                  <button @click="ShowTable='FlightplanForm'" :class="(modellingRezultSelect.E79.length < 1) ? 'disable' : ''" class="ButtonCommand">План полёта</button>
                  <button @click="ShowFcLog" :class="(modellingRezultSelect.fcLog.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог полёта</button>
                </td>
              </tr>
              <tr>
                <td></td>
                <td class="tdflexRow">
                  <button @click="ShowLog(modellingRezult.log)" :class="(modellingRezult.log.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог движка</button>
                  <button @click="ShowEventsLogResponse" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог событий</button>
                  <button @click="ShowLog(modellingRezult.Smao)" :class="(modellingRezult.Smao.length < 1) ? 'disable' : ''" class="ButtonCommand icon"><img src="../../assets/instructions.png" alt="smaoResponse"></button>
                </td>
              </tr>
            </table>
          </div>
          <div class="PanelSettings" v-else  @change="ValidateDataPostModellingSettings">
            <fieldset v-if="systemStatus.typeWorkplace in {1:null, 3:null}">
              <legend>Тип эксперимента:</legend>
              <div><input type="radio" :value="0" v-model="modellingSettings.experiment"/><label>планирование съемок</label></div>
              <div><input type="radio" :value="1" v-model="modellingSettings.experiment"/><label>планирование полёта</label></div>
              <div><input type="radio" :value="2" v-model="modellingSettings.experiment"/><label>моделирование полёта</label></div>
            </fieldset>
            <fieldset v-if="systemStatus.typeWorkplace in {1:null,2:null,3:null} && modellingSettings.flightPlanning == 1">
                <legend>Прогноз заряда АКБ при планировании:</legend>
                <div><input type="radio" :value="0" v-model="modellingSettings.chargeForecasting"/><label>не выполняется</label></div>
                <div><input type="radio" :value="1" v-model="modellingSettings.chargeForecasting"/><label>выполняется, не учитывается</label></div>
                <div><input type="radio" :value="2" v-model="modellingSettings.chargeForecasting"/><label>выполняется, учитывается</label></div>
              </fieldset>
              <fieldset v-if="systemStatus.typeWorkplace in {1:null, 3:null} && modellingSettings.planSimulation == 1">
                <legend>Моделирование полёта:</legend>
                <div><input type="checkbox" v-model="modellingSettings.chargeSimulation"/><label>Использование АКБ</label></div>
                <div><input type="checkbox" v-model="modellingSettings.optionPro42"/><label>Использование Pro</label></div>
              </fieldset>
            <fieldset v-if="systemStatus.typeWorkplace in {3:null, 4:null}">
              <legend>Межспутниковая связь для доставки данных:</legend>
              <div><input type="radio" :value="0" v-model="modellingSettings.useInteraction" true-value="1" false-value="0"/><label>не используется</label></div>
              <div><input type="radio" :value="1" v-model="modellingSettings.useInteraction"/><label>используется</label></div>
            </fieldset>
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
import BookmarkTable from './BookmarkComponent.vue';
import FlightplanForm from './FlightplanForm.vue';

import { KaSettings } from './KaSettings';
import { NPList, OGList } from '@/js/GlobalData';


  export default {
    name: 'FlightPlaner',
    mixins: [KaSettings],
    data(){
      return{
        purposesJson: 0, //колличество заявок
        OGList: [], // подгружаем импорты
        NPList: [], // подгружаем импорты
        ConstellationJson: [], //список ог
        ShowTable: null, //переменная для отображения таблиц
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
          experiment: 0,
          flightPlanning: 0,
          planSimulation: 0,
          chargeForecasting: 0,
          useInteraction: 0,
          chargeSimulation: 0,
          optionPro42: 0,
          experimentEddit: false
        },
        modellingSettingsLabel:{
          experiment: {name: "Тип эксперимента", label:["планирование съемок", "планирование полёта", "моделирование полёта"]},
          flightPlanning: {name: "Планирование полёта", label:["не выполняется", "выполняется"]},
          planSimulation: {name: "Моделлирование выполнения плана", label:["не выполняется", "выполняется"]},
          chargeForecasting: {name: "Прогнозирование заряда АКБ", label:["не выполняется", "выполняется, не учитывается", "выполняется, учитывается"]},
          chargeSimulation: {name: "Расчёт заряда АКБ при моделировании", label:["не используется", "используется"]},
          optionPro42: {name: "Расчёт Pro42 при моделировании", label:["не используется", "используется"]},
          useInteraction: {name: "Межспутниковая связь для доставки", label:["не используется", "используется"]},
        },
        modellingRezult: {
          log: [],
          E77: [],
          E78: [],
          hide: [],
          E79: [],
          Smao: [],
          events: [],
          fcLog:[]
        },
        modellingRezultSelect:{
          E77: [],
          E78: [],
          E79: [],
          fcLog:[],
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
      SelectDiv,
      BookmarkTable,
      FlightplanForm
    },
    methods: {
      Experiment(status){
        if(status){
          /*
          if(!this.systemStatus.earthStatus){
            alert("НП не утверждены")
            return
          }
          if(!this.systemStatus.constellationStatus){
            alert("КА и ОГ не утверждены")
            return
          }
          if(OGList.length < 1){
            alert("Нет КА")
            return
          }
          if(NPList.length < 1){
            alert("Нет НП")
            return
          }
          if(this.purposesJson < 1){
            alert("Нет заявок")
            return
          }*/
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
            events: [],
            fcLog: []
          }
          this.modellingRezultSelect = {
            E77: [],
            E78: [],
            E79: [],
            fcLog: [],
            selectKA: undefined
          }

        }
        this.$emit('ChangeExperimentStatus', {status})
      },
      ValidateDataPostModellingSettings(){
        console.log(this.modellingSettings)
        if(this.modellingSettings.experiment < 1){
          this.modellingSettings.chargeForecasting = 0
          this.modellingSettings.flightPlanning = 0
        }
        if(this.modellingSettings.experiment < 2){
          this.modellingSettings.chargeSimulation = 0
          this.modellingSettings.planSimulation = 0
          this.modellingSettings.optionPro42 = 0
        }
        if(this.modellingSettings.experiment >= 1) this.modellingSettings.flightPlanning = 1
        if(this.modellingSettings.experiment >= 2) this.modellingSettings.planSimulation = 1

      },
      
      ChangeInputRadio(target){
        this.modellingSettings[target.target.name] = Number(target.target.value)
      },
      async StartModelling(){
        DisplayLoad(true)
        let dataPost = Object.assign(this.modellingSettings)
        dataPost.chargeSimulation = Number(dataPost.chargeSimulation)
        dataPost.optionPro42 = Number(dataPost.optionPro42)
        let rezult = {}
        if(this.systemStatus.typeWorkplace in {3:null,4:null}){
          rezult = await FetchPost("/api/v1/smao", dataPost) || {engineLogResponse: []}
        }
        else rezult = await FetchPost('/api/v1/smao', dataPost) || {engineLogResponse: []}
        if(rezult.engineLogResponse.length > 0){
          this.dataModelling = rezult
          this.ParceModellingRezult()
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
          hide: [],
          fcLog:[]
        }
        try{this.modellingRezult.Smao.push(this.dataModelling.smaoLogResponse)} 
          catch (error) {console.error(error)}
        try {this.modellingRezult.events = this.dataModelling.logResponse.logDataArray} 
          catch (error) {console.error(error)}
        try { //обработка лога полёта
          this.modellingRezult.fcLog = []
          this.dataModelling.logResponse.fcLogArray.forEach(element => {
            element.timeBegin = this.CreateDateTime(element.timeBegin, false)
            element.timeEnd = this.CreateDateTime(element.timeEnd, false)
            let flag = true
            for (let index = 0; index < this.modellingRezult.fcLog.length; index++)
              if(element.idSender == this.modellingRezult.fcLog[index].idSender){
                this.modellingRezult.fcLog[index].data.push(element)
                flag = false
                break
              }
            if(flag) this.modellingRezult.fcLog.push({idSender: element.idSender, data:[element]})
          })
        }catch (error) {console.error(error)}
        
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
              if (element.mainFlightPlan !== null) {
                this.modellingRezult.E79.push({idSender: element.idSender, data: element.mainFlightPlan.flightPlan})
              }
            }
          } catch (error) {
            console.error(error, element)
            this.modellingRezult.log.push("-!-!-!-!-ОШИБКА обработки на строке - " + element)
          }
        });
        this.modellingRezultSelect_FillById(this.modellingRezultSelect.selectKA)
        console.log("Результат моделлирования и обработки", this.modellingRezult, this.modellingRezultSelect)
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
        for (let index = 0; index < this.modellingRezult.events.length; index++) {
          const element = this.modellingRezult.events[index]
          this.dataTable.push({
            time: UnixToDtime(element.time).time,
            code: element.type,
            event: dataevents[element.type],
            orderId: element.orderName,
            nodeId: element.node1Name,
            nodeId2: element.node2Name,
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
        this.dataLableName = [{lable: "Виток", nameParam: "nRev"},{lable: "Время", nameParam: "time"},{lable: "C/T", nameParam: "light"},{lable: "Съёмка", nameParam: "shootingName"},
        {lable: "Связь с НП", nameParam: "gsName"},
        {lable: "Режим", nameParam: "mode"},{lable: "Заряд АКБ", nameParam: "charge"}]
        for (let index = 0; index < this.modellingRezultSelect.E79.length; index++) {
          const element = this.modellingRezultSelect.E79[index];
          this.dataTable.push({
            shootingName: element.shootingName || '-',
            light: element.light,
            charge: element.charge,
            nRev: element.nRev,
            gsName: element.gsName || '-',
            mode: element.mode,
            time: UnixToDtime(element.timeBegin).time +' - '+ UnixToDtime(element.timeEnd).time
          }) 
        }
        this.PreWrapDefaultTable = false
        this.ShowDefaultTable = true
      },
      ShowFcLog(){
        this.dataTable = this.modellingRezultSelect.fcLog
        this.dataLableName = [{lable:"Начало",nameParam:'timeBegin'},{lable:"Конец",nameParam:'timeEnd'},{lable:"С/Т",nameParam:'light'},
          {lable:"Режим",nameParam:'light'},{lable:"Цель",nameParam:'orderName'},{lable:"Нацеливание",nameParam:'timeTarget'},
          {lable:"Связь с НП",nameParam:'timeGs'},{lable:"Межспутниковая связь",nameParam:'timeIs'},{lable:"АКБ",nameParam:'charge'}
        ]
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
          fcLog: [],

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
        this.modellingRezult.fcLog.forEach(fcLog =>{
          if (fcLog.idSender == id) {
            this.modellingRezultSelect.fcLog = fcLog.data
          }
        })
        console.log(this.modellingRezultSelect)
      },
      async ReLoadComponent(){
        this.earthList = NPList
        this.ConstellationJson = OGList
        let result = await FetchGet('/api/v1/satrequest/request/get/all') || []
        this.purposesJson = result.length || 0
        this.arr = []
        for (let i = 0; i < this.ConstellationJson.length; i++) {
          for (let index = 0; index < this.ConstellationJson[i].satellites.length; index++) {
            const element = this.ConstellationJson[i].satellites[index];
            this.arr.push({value: element.satelliteId, lable: element.name})
          }
        }
        try {
          this.valueSS = {lable: this.arr[0].lable, value: this.arr[0].value}
          this.modellingRezultSelect.selectKA = this.arr[0].value
        } catch (error) {
          console.log(error)
        }
      }
    },
    async mounted(){
      this.ReLoadComponent()
      if (this.systemStatus.typeWorkplace in {2:null}) {
        this.modellingSettings.experiment = 1
      }
      if (this.systemStatus.typeWorkplace in {4:null}) {
        this.modellingSettings.experiment = 2
        this.modellingSettings.chargeForecasting = 2
        this.modellingSettings.chargeSimulation = 1
      }
      this.ValidateDataPostModellingSettings()
    }
  }
  </script>


<style lang="scss" scoped>
.ContentDiv{
  height: 100%;

  .tdflexRow{
    display: flex;
  }
}
</style>