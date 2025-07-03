<template>
    <DefaultTable v-if="ShowTable=='DefaultTable'" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowTable=null" :prevrap="PreWrapDefaultTable"/>
    <div class="main_contain">
      <div class="ContentDiv">
        <div class="FlexRow Panel">
          <div class="ButtonModelling">
            <button  @click="StartModelling" class="ButtonCommand rightPadding"><img src="../../assets/start.png" alt="" class="iconButton">Старт планирования</button>
            <button v-if="!ExperimentStatus && !experimentEddit" @click="ShowSettings(true)" class="ButtonCommand MaxWidth" >Настройки</button>
            <button v-if="!ExperimentStatus && experimentEddit" @click="ShowSettings(false)" class="ButtonCommand MaxWidth">Закрыть настройки</button>
          </div>
          <div class="TableSystem">
            <table>
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
          <div class="TableSystem">
            <table style="text-align: left;">
              <tr v-for="data, index in modellingSettingsLabel" :key="index"
              ><td>{{ data.name }}:</td><td>{{ data.label[Number(modellingSettings[index])] }}</td></tr>
            </table>
          </div>
          <div class="PanelWork">
          <table class="colum">
            <tbody>
              <tr><td class="tdflexRow">
                <button @click="ShowRezult(true)" :class="(modellingRezult.log.length < 1) ? 'disable' : ''" class="ButtonCommand" v-if="!rezultShow">Результаты моделлирования</button>
                <button @click="ShowRezult(false)" class="ButtonCommand Select" v-else>Скрыть результат</button></td></tr>
              <tr><td class="tdflexRow"><button @click="ShowLogAll" :class="(modellingRezult.log.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог движка</button></td></tr>
              <tr>
                <td class="tdflexRow"><button @click="ShowEventsLogResponse" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог событий</button>
                    <button @click="ShowLogSmao" :class="(modellingRezult.Smao.length < 1) ? 'disable' : ''" class="ButtonCommand icon"><img src="../../assets/instructions.png" alt="smaoResponse"></button></td>
              </tr>
              </tbody>
            </table>
            </div>
        </div>
      </div>
    </div>
</template>
  
<script>

import { UnixToDtime } from '@/js/WorkWithDTime';
import DefaultTable from '../DefaultTable.vue';
import { KaSettings } from './KaSettings';
  export default {
    name: 'ModellingComponent',
    mixins: [KaSettings],
    data(){
      return{
        purposesJson: 0, //колличество заявок
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
          optionPro42: 0
        },
        experimentEddit: false,
        rezultShow:false,
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
      }
    },
    components:{
      DefaultTable
    },
    methods: {
        ShowSettings(status){
            this.$SettingsShowChange(status)
            this.experimentEddit = status
        },
        ReloadSettings(data){
            this.modellingSettings = data
        },
        ShowRezult(status){
          console.log(status)
          this.rezultShow = status
          this.$SettingsShowRezult(status)
        },
      async StartModelling(){
        this.$showLoad(true);
        let dataPost = Object.assign(this.modellingSettings)
        dataPost.chargeSimulation = Number(dataPost.chargeSimulation)
        dataPost.optionPro42 = Number(dataPost.optionPro42)
        let rezult = {}
        if(this.systemStatus.typeWorkplace in {3:null,4:null}){
          rezult = await this.$FetchPost("/api/v1/smao", dataPost) || {engineLogResponse: []}
        }
        else rezult = await this.$FetchPost('/api/v1/smao', dataPost) || {engineLogResponse: []}
        if(rezult.engineLogResponse.length > 0){
          this.dataModelling = rezult
          this.ParceModellingRezult()
        }
        this.$showLoad(false);
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
          let events = await this.$FetchGet('/api/v1/event/codes/all') || []
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
                e.wsUnix = UnixToDtime(Math.floor(e.ws)).time
                e.weUnix = UnixToDtime(Math.floor(e.we)).time
                e.tsUnix = UnixToDtime(Math.floor(e.ts)).time
                e.teUnix = UnixToDtime(Math.floor(e.te)).time
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
        console.log("Результат моделлирования и обработки", this.modellingRezult)
        this.$dataTransfer(this.modellingRezult)
      },
      ShowLogAll(){
        this.dataTable = []
        this.modellingRezult.log.forEach(element =>{
          const e = Object.assign({}, element)
          let deleteName = ['time','type','idReceiver','receiverName','idSender','senderName']
          for (let i = 0; i < deleteName.length; i++) {
            delete e[deleteName[i]]
          }
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
      async ReLoadComponent(){
        this.earthList = await this.$NPList()
        this.ConstellationJson = await this.$OGList()
        let result = await this.$FetchGet('/api/v1/satrequest/request/get/all') || []
        this.purposesJson = result.length
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