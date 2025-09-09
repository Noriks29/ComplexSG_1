<template>
    <Panel :pt="{ 
      header: { style: 'display: none' }, 
      content:{style:'display: flex;padding: 5px;justify-content: space-between;height: 100%;'}, 
      toggleablecontent:{ style:'height: 100%;'} }" style="flex: 1;margin-left:5px;">
          <div class="ButtonModelling">
            <Button v-if="!ExperimentStatus" @click="Experiment(true)" label="Начать эксперимент" severity="success" icon="pi pi-play" iconPos="right"/>
            <Button v-if="ExperimentStatus" @click="StartModelling" label="Старт моделирования" severity="success" icon="pi pi-play" iconPos="right"/>
            <Button v-if="ExperimentStatus" @click="Experiment(false)" label="Закончить эксперимент" severity="danger" icon="pi pi-stop" iconPos="right"/>
            <Button v-if="!ExperimentStatus" @click="ShowSettings" label="Настройки" severity="help" :outlined="experimentEddit" icon="pi pi-sliders-h" iconPos="right"/>
          </div>
          <DataTable :size="'small'" :value="[{name:'Заявки:',count:purposesJson},{name:'НП:',count:earthList.length},{name:'КА:',count:ConstellationCount}]" tableStyle="" :pt="{ thead: { style: 'display: none' }}">
              <Column field="name" style="font-weight: bold;" ></Column>
              <Column field="count"></Column>
          </DataTable>
          <DataTable :size="'small'" :value="modellingSettingsLabel" tableStyle="" :pt="{ thead: { style: 'display: none' }}" scrollable scrollHeight="110px">
              <Column field="name" style="font-weight: bold;" ></Column>
              <Column>
                <template #body="{ data, index }">
                  {{ data.label[Number(modellingSettings[data.param])] }}
                </template>
              </Column>
          </DataTable>
    </Panel>
</template>
  
<script>
import Panel from 'primevue/panel';
import { KaSettings } from './KaSettings';

  export default {
    name: 'ModellingComponent',
    mixins: [KaSettings],
    data(){
      return{
        purposesJson: 0, //колличество заявок
        ConstellationCount: 0, //список ог
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
        modellingSettingsLabel:[
          {param: 'experiment', name: "Тип эксперимента", label:["планирование съемок", "планирование полёта", "моделирование полёта"]},
          {param: 'chargeForecasting',name: "Прогнозирование заряда АКБ", label:["не выполняется", "выполняется, не учитывается", "выполняется, учитывается"]},
          {param: 'chargeSimulation',name: "Расчёт заряда АКБ при моделировании", label:["не используется", "используется"]},
          {param: 'optionPro42',name: "Расчёт Pro42 при моделировании", label:["не используется", "используется"]},
          {param: 'useInteraction',name: "Межспутниковая связь для доставки", label:["не используется", "используется"]},
        ],
      }
    },
    components:{
      Panel
    },
    methods: {
        async ShowSettings(){
          console.log("fesfefsfef")
          this.experimentEddit = !this.experimentEddit
          this.$emit('showSettings', this.experimentEddit)
          await this.$RezultShow(false)
          this.rezultShow = false
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
        let rezult = await this.$FetchPost("/api/v1/smao", dataPost) || {engineLogResponse: []}
        if(rezult.engineLogResponse.length > 0){
          let events = await this.$FetchGet('/api/v1/event/codes/all') || []
          this.$SetModellingRezult(rezult,events)
        }
        this.$showLoad(false);
      },
    },
    async mounted(){
      this.$InitModellingRezult()
      this.earthList = await this.$NPList()
      let OGList = await this.$OGList() || []
      this.ConstellationCount = 0
      OGList.value.forEach(og =>{
        this.ConstellationCount += og.satellites.length
      })
      let result = await this.$FetchGet('/api/v1/satrequest/request/get/all') || []
      this.purposesJson = result.length
      this.modellingSettings = await this.$SetSettings(null)
    }
  }
  </script>


<style lang="scss" scoped>
.ButtonModelling{
    flex: 0 1 auto;
    width: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

</style>