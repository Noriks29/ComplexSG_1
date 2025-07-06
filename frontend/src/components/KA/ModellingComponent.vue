<template>
    <div class="main_contain">
      <div class="ContentDiv">
        <div class="FlexRow Panel">
          <div class="ButtonModelling">
            <button v-if="!ExperimentStatus && !modellingSettings.experimentEddit" @click="Experiment(true)" class="ButtonCommand">Начать эксперимент</button>
            <button v-if="ExperimentStatus" @click="StartModelling" class="ButtonCommand">Старт моделирования</button>
            <button v-if="ExperimentStatus" @click="Experiment(false)" class="ButtonCommand">Закончить эксперимент</button>
            <button v-if="!ExperimentStatus && !experimentEddit" @click="ShowSettings(true)" class="ButtonCommand">Настройки</button>
            <button v-if="!ExperimentStatus && experimentEddit" @click="ShowSettings(false)" class="ButtonCommand Select">Закрыть настройки</button>
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
        </div>
      </div>
    </div>
</template>
  
<script>

import { UnixToDtime } from '@/js/WorkWithDTime';
import { KaSettings } from './KaSettings';
  export default {
    name: 'ModellingComponent',
    mixins: [KaSettings],
    data(){
      return{
        purposesJson: 0, //колличество заявок
        ConstellationJson: [], //список ог
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
        rezultShow:false,
        modellingSettingsLabel:{
          experiment: {name: "Тип эксперимента", label:["планирование съемок", "планирование полёта", "моделирование полёта"]},
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
    methods: {
        ShowSettings(status){
            this.$emit('showSettings', status)
            this.$SettingsShowRezult(false)
            this.rezultShow = false
        },
        ReloadSettings(data){
            this.modellingSettings = data
        },
        ShowRezult(status){
          this.$emit('showSettings', false)
          this.rezultShow = status
          this.$SettingsShowRezult(status)
        },
        Experiment(status){
          this.ShowRezult(status)
          this.$InitModellingRezult()
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
        this.$emit('ChangeExperimentStatus', {status})
      },
      async StartModelling(){
        this.$showLoad(true);
        this.$InitModellingRezult()
        let dataPost = Object.assign(this.modellingSettings)
        dataPost.chargeSimulation = Number(dataPost.chargeSimulation)
        dataPost.optionPro42 = Number(dataPost.optionPro42)
        let rezult = {engineLogResponse: []}
        if(this.systemStatus.typeWorkplace in {3:null,4:null}){
          rezult = await this.$FetchPost("/api/v1/smao", dataPost) || {engineLogResponse: []}
        }
        else rezult = await this.$FetchPost('/api/v1/smao', dataPost) || {engineLogResponse: []}
        if(rezult.engineLogResponse.length > 0){
          let events = await this.$FetchGet('/api/v1/event/codes/all') || []
          console.log(events)
          this.ParceModellingRezult(rezult)
        }
        this.$showLoad(false);
      },
      async ParceModellingRezult(rezult){
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
        try{this.modellingRezult.Smao.push(rezult.smaoLogResponse)} //лог движка 
          catch (error) {console.error(error)}
        try {//лог событий
          let events = await this.$FetchGet('/api/v1/event/codes/all') || []
          let dataevents = {}
          events.forEach(element => dataevents[element.codeEvent]=element.descriptionEvent)
          rezult.logResponse.logDataArray.forEach(element => {
            const e = Object.assign({}, element);
            e.timeUnix = UnixToDtime(e.time).time
            e.event = dataevents[e.type]
            this.modellingRezult.events.push(e)
          })
        }catch (error) {console.error(error)}

        try { //обработка лога полёта
          this.modellingRezult.fcLog = []
          rezult.logResponse.fcLogArray.forEach(element => {
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
        
        rezult.engineLogResponse.forEach(element => { //обработка других событий
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
.ButtonModelling{
  overflow: auto;
}

</style>