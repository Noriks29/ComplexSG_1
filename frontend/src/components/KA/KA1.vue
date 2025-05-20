<template>
    <div class="main_contain">
      <DefaultTable v-if="ShowTable=='DefaultTable'" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowTable=null" :prevrap="PreWrapDefaultTable"/>
      <E78Table v-if="ShowTable=='E78Table'" :dataTable="modellingRezultSelect.E78" @closetable="ShowTable=null"/>
      <E77E78 v-if="ShowTable=='E77E78'" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78" @closetable="ShowTable=null"/>
      <BookmarkTable v-if="ShowTable=='BookmarkTable'" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78" @closetable="ShowTable=null"/>
      <FlightplanForm v-if="ShowTable=='FlightplanForm'" :dataTable="modellingRezultSelect.E79" @closetable="ShowTable=null"/>
      <LogDownload v-if="ShowTable=='LogDownload'" :dataTable="modellingRezult.events" @closetable="ShowTable=null"/>
      <LogComplet v-if="ShowTable=='LogComplet'" :dataTable="modellingRezult.events" @closetable="ShowTable=null" />
      
      <div class="ContentDiv">
        <h1 class="TitleText">{{nameModell}}</h1>
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
        <div class="Panel MaxWidth">
          <div class="PanelWork" v-if="!modellingSettings.experimentEddit">
            <table class="colum">
              <tr>
                <td>Заявки</td>
                <td class="tdflexRow">
                  <button v-if="systemStatus.typeWorkplace==2" @click="ShowTable='E77E78'" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План выполнения заявок</button>
                  <button v-if="systemStatus.typeWorkplace==2" @click="ShowTable='BookmarkTable'" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План закладок</button>
                  <button v-if="systemStatus.typeWorkplace in {1:null,3:null,4:null}" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" @click="ShowTable='LogComplet'" class="ButtonCommand">Лог выполнения заявок</button>
                  <button v-if="systemStatus.typeWorkplace in {3:null,4:null}" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" @click="ShowTable='LogDownload'" class="ButtonCommand">Лог загрузки сеансов связи</button>
                  <button v-if="systemStatus.typeWorkplace in {3:null,4:null}" :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог передачи данных в сеансе связи</button>
                  <button v-if="systemStatus.typeWorkplace in {3:null,4:null}" :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Сроки доставки данных</button>
                </td>
              </tr>
              <tr>
                <td><SelectDiv  :dataOption="arr" :valueS="valueSS" :id="'0'"  @valueSelect="SelectChange"/></td>
                <td class="tdflexRow">
                  {{ ShowTable  }}
                  <button @click="ShowShootingPlan" :class="(modellingRezultSelect.E77.length < 1) ? 'disable' : ''" class="ButtonCommand">План съёмок</button>
                  <button v-if="systemStatus.typeWorkplace in {2:null}" @click="ShowTable='E78Table'" :class="(modellingRezultSelect.E78.length < 1) ? 'disable' : ''" class="ButtonCommand">План доставки</button>
                  <button @click="ShowTable='FlightplanForm'" :class="(modellingRezultSelect.E79.length < 1) ? 'disable' : ''" class="ButtonCommand">План полёта</button>
                  <button @click="ShowFcLog" :class="(modellingRezultSelect.fcLog.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог полёта</button>
                </td>
              </tr>
              <tr>
                <td></td>
                <td class="tdflexRow">
                  <button @click="ShowLogAll" :class="(modellingRezult.log.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог движка</button>
                  <button @click="ShowEventsLogResponse" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог событий</button>
                  <button @click="ShowLogSmao" :class="(modellingRezult.Smao.length < 1) ? 'disable' : ''" class="ButtonCommand icon"><img src="../../assets/instructions.png" alt="smaoResponse"></button>
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
import LogDownload from './LogDownload.vue';
import LogComplet from './LogComplet.vue';

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
        PreWrapDefaultTable: false,
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
        nameModell: ''
      }
    },
    components:{
      DefaultTable,
      E78Table,
      E77E78,
      SelectDiv,
      BookmarkTable,
      FlightplanForm,
      LogDownload,
      LogComplet
    },
    methods: {
      Experiment(status){
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
      async ParceModellingRezult(){
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
        try{this.modellingRezult.Smao.push(this.dataModelling.smaoLogResponse)} //лог движка 
          catch (error) {console.error(error)}
        try {//лог событий
          let events = await FetchGet('/api/v1/event/codes/all') || []
          let dataevents = {}
          events.forEach(element => dataevents[element.codeEvent]=element.descriptionEvent)
          this.dataModelling.logResponse.logDataArray.forEach(element => {
            const e = Object.assign({}, element);
            e.timeUnix = UnixToDtime(e.time).time
            e.event = dataevents[e.type]
            this.modellingRezult.events.push(e)
          })
        }catch (error) {console.error(error)}

        try { //обработка лога полёта
          this.modellingRezult.fcLog = []
          this.dataModelling.logResponse.fcLogArray.forEach(element => {
            element.timeBegin = UnixToDtime(element.timeBegin).time
            element.timeEnd = UnixToDtime(element.timeEnd).time
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
        
        this.dataModelling.engineLogResponse.forEach(element => { //обработка других событий
          try {
            element.time = this.CreateDateTime(element.time)
            this.modellingRezult.log.push(element)
            if(element.type == "E77"){ //план съёмок 
              let oneE77 = {idSender:  element.idSender, data: []}
              for (let index = 0; index < element.visualFormsData.visualFormsDataShooting.length; index++) {
                const e = Object.assign({}, element.visualFormsData.visualFormsDataShooting[index]);
                e.wsUnix = UnixToDtime(e.ws).time
                e.weUnix = UnixToDtime(e.we).time
                e.tsUnix = UnixToDtime(e.ts).time
                e.teUnix = UnixToDtime(e.te).time
                e.pitch =  Math.round(e.pitch * 100) / 100
                e.roll =  Math.round(e.roll * 100) / 100
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
                let E79Create = []
                element.mainFlightPlan.flightPlan.forEach(E79D =>{
                  const e = Object.assign({}, E79D);
                  e.timeUnix = UnixToDtime(e.timeBegin).time +' - '+ UnixToDtime(e.timeEnd).time
                  E79Create.push(e)
                })
                this.modellingRezult.E79.push({idSender: element.idSender, data: E79Create})
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
      ShowShootingPlan(){ // E77 план съёмок
        this.dataTable = this.modellingRezultSelect.E77
        this.dataLableName = [
          {lable: "Заявка", nameParam: "orderId"},
          {lable: "Цель", nameParam: "targetName"},
          {lable: "Начало видимости", nameParam: "wsUnix"},
          {lable: "Окончание видимости", nameParam: "weUnix"},
          {lable: "Разворот", nameParam: "transition"},
          {lable: "Начало съёмки", nameParam: "tsUnix"},
          {lable: "Окончаниие съёмки", nameParam: "teUnix"},
          {lable: "Тангаж", nameParam: "pitch"},
          {lable: "Крен", nameParam: "roll"}
        ]
        this.PreWrapDefaultTable = false
        this.ShowTable='DefaultTable'
      },
      ShowLogAll(){
        this.dataTable = []
        this.modellingRezult.log.forEach(element =>{
          const e = Object.assign({}, element)
          delete e['time']
          delete e['type']
          this.dataTable.push({
            time: element.time,
            type: element.type,
            data: e,
            name: element.senderName || element.receiverName || ''
          })
        })
        this.dataLableName = [
          {lable: "Время", nameParam: "time", style:'white-space: nowrap;'},
          {lable: "Код", nameParam: "type"},
          {lable: 'Источник', nameParam:'name', style:'text-align: left;'},
          {lable: "data", nameParam: "data", style:'text-align: left;'}
        ]
        this.PreWrapDefaultTable = false
        this.ShowTable='DefaultTable'
      },
      ShowLogSmao(){
        this.dataTable = [] 
        this.modellingRezult.Smao.forEach(element => {
          this.dataTable.push({data: element})
        })
        this.dataLableName = [
          {lable: "data", nameParam: "data", style:'text-align: left;'}
        ]
        this.PreWrapDefaultTable = true
        this.ShowTable='DefaultTable'
      },
      async ShowEventsLogResponse(){ //Лог событий
        this.dataTable = this.modellingRezult.events
        this.dataLableName = [
          {lable: "Время", nameParam: "timeUnix"},
          {lable: "Код", nameParam: "type"},
          {lable: "Событие", nameParam: "event"},
          {lable: "Заявка", nameParam: "orderName"},
          {lable: "Узел 1", nameParam: "node1Name"},
          {lable: "Узел 2", nameParam: "node2Name"},
          {lable: "Коментарий", nameParam: "text"},
          {lable: "Значение", nameParam: "value"}
        ]
        this.PreWrapDefaultTable = false
        this.ShowTable='DefaultTable'
      },
      ShowFcLog(){
        this.dataTable = this.modellingRezultSelect.fcLog
        this.dataLableName = [{lable:"Начало",nameParam:'timeBegin'},{lable:"Конец",nameParam:'timeEnd'},{lable:"С/Т",nameParam:'light'},
          {lable:"Режим",nameParam:'mode'},{lable:"Цель",nameParam:'orderName'},{lable:"Нацеливание",nameParam:'timeTarget'},
          {lable:"Связь с НП",nameParam:'timeGs'},{lable:"Межспутниковая связь",nameParam:'timeIs'},{lable:"АКБ",nameParam:'charge'}
        ]
        this.PreWrapDefaultTable = false
        this.ShowTable='DefaultTable'
      },
      SelectChange(target){
          this.modellingRezultSelect_FillById(target.value)
        },
      modellingRezultSelect_FillById(id){ //выбор данных под ка
        this.modellingRezultSelect = {
          E77: [],
          E78: [],
          E79: [],
          fcLog: [],
          selectKA: id
        }
        this.modellingRezult.E77.forEach(E77 =>{
          if (E77.idSender == id) {this.modellingRezultSelect.E77 = E77.data}
        })
        this.modellingRezult.E78.forEach(E78 =>{
          if (E78.idSender == id) {this.modellingRezultSelect.E78 = E78.dataDownPlan.partsPlan}
        })
        this.modellingRezult.E79.forEach(E79 =>{
          if (E79.idSender == id) {this.modellingRezultSelect.E79 = E79.data}
        })
        this.modellingRezult.fcLog.forEach(fcLog =>{
          if (fcLog.idSender == id) {this.modellingRezultSelect.fcLog = fcLog.data}
        })
        console.log(this.modellingRezultSelect)
      },
      async ReLoadComponent(){
        this.earthList = NPList
        this.ConstellationJson = OGList
        let result = await FetchGet('/api/v1/satrequest/request/get/all') || []
        this.purposesJson = result.length
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
        } catch (error) {console.error(error)}
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
      this.nameModell = localStorage.getItem('modname')
      document.addEventListener('keydown', (event) => {
            if (event.code == 'Escape') {
                this.ShowTable = null
            }
          });
    }
  }
  </script>


<style lang="scss" scoped>
.ContentDiv{
  height: 90vh;

  .tdflexRow{
    display: flex;
  }
}
</style>