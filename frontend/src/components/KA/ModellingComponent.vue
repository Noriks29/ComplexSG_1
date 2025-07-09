<template>
    <div class="main_contain">
      <div class="ContentDiv">
        <div class="FlexRow Panel">
          <div class="ButtonModelling">
            <button v-if="!ExperimentStatus" @click="Experiment(true)" class="ButtonCommand">Начать эксперимент</button>
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
        experimentEddit: false,
        rezultShow:false,
        modellingSettingsLabel:{
          experiment: {name: "Тип эксперимента", label:["планирование съемок", "планирование полёта", "моделирование полёта"]},
          chargeForecasting: {name: "Прогнозирование заряда АКБ", label:["не выполняется", "выполняется, не учитывается", "выполняется, учитывается"]},
          chargeSimulation: {name: "Расчёт заряда АКБ при моделировании", label:["не используется", "используется"]},
          optionPro42: {name: "Расчёт Pro42 при моделировании", label:["не используется", "используется"]},
          useInteraction: {name: "Межспутниковая связь для доставки", label:["не используется", "используется"]},
        },
      }
    },
    methods: {
        async ShowSettings(status){
            this.$emit('showSettings', status)
            await this.$RezultShow(false)
            this.rezultShow = false
            this.experimentEddit = status
        },
        ReloadSettings(data){
            this.modellingSettings = data
        },
        ShowRezult(status){
          this.$emit('showSettings', false)
          this.experimentEddit = false
          this.rezultShow = status
          this.$RezultShow(status)
        },
        Experiment(status){
          this.ShowRezult(status)
          this.$InitModellingRezult()
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
          this.$SetModellingRezult(rezult,events)
        }
        this.$showLoad(false);
      },
      async ReLoadComponent(){
        this.$InitModellingRezult()
        this.earthList = await this.$NPList()
        this.ConstellationJson = await this.$OGList()
        let result = await this.$FetchGet('/api/v1/satrequest/request/get/all') || []
        this.purposesJson = result.length
      },
    },
    async mounted(){
      this.ReLoadComponent()
      this.modellingSettings = await this.$SetSettings(null)
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