<template>
  <div class="main_contain RowSection">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
    <StatisticComponent v-if="ShowMode=='StatisticComponent'" :dataTable="modellingRezult.events"/>
    <LogAll v-if="ShowMode=='LogAll'" :dataTable="modellingRezult.log"/>
    <EventLog v-if="ShowMode=='EventLog'" :dataTable="modellingRezult.events"/>
    <LogDownload v-if="ShowMode=='LogDownload'" :dataTable="modellingRezult.events"/>

    <div class="ContentDiv" v-else style="margin-top: 30px;" >
        <div class="Panel RightPanel" >
          <LogComplet v-if="ShowMode=='LogComplet'" :dataTable="modellingRezult.events"/>
          <FlightplanForm v-if="ShowMode=='FlightplanForm'" :dataTable="modellingRezult.Select.E79"/>
          <DefaultTable v-if="ShowMode=='DefaultTable'" :dataLableName="dataLableName" :dataTable="dataTable" :prevrap="PreWrapDefaultTable"/>
          <ShootingPlan v-if="ShowMode=='ShootingPlan'" :dataTable="modellingRezult.Select.E77"/>
          <E78Table v-if="ShowMode=='E78Table'" :dataTable="modellingRezult.Select.E78"/>
          <E77E78 v-if="ShowMode=='E77E78'" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78"/>
          <BookmarkTable v-if="ShowMode=='BookmarkTable'" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78"/>

          <div class="PanelSettings" @change="ChangeSettings" v-if="ShowMode=='Settings'">
            <!-- Тип эксперимента -->
            <Panel v-if="systemStatus.typeWorkplace in {1:null, 3:null}" header="Тип эксперимента:" toggleable>
              <div class="field-radiobutton">
                <RadioButton name="experiment" :value="0" v-model="modellingSettings.experiment" inputId="experiment1" />
                <label for="experiment1">планирование съемок</label>
              </div>
              <div class="field-radiobutton">
                <RadioButton name="experiment" :value="1" v-model="modellingSettings.experiment" inputId="experiment2" />
                <label for="experiment2">планирование полёта</label>
              </div>
              <div class="field-radiobutton">
                <RadioButton name="experiment" :value="2" v-model="modellingSettings.experiment" inputId="experiment3" />
                <label for="experiment3">моделирование полёта</label>
              </div>
            </Panel>

            <!-- Прогноз заряда АКБ -->
            <Panel v-if="systemStatus.typeWorkplace in {1:null,2:null,3:null} && modellingSettings.flightPlanning == 1" 
                  header="Прогноз заряда АКБ при планировании:" toggleable>
              <div class="field-radiobutton">
                <RadioButton name="chargeForecasting" :value="0" v-model="modellingSettings.chargeForecasting" inputId="charge1" />
                <label for="charge1">не выполняется</label>
              </div>
              <div class="field-radiobutton">
                <RadioButton name="chargeForecasting" :value="1" v-model="modellingSettings.chargeForecasting" inputId="charge2" />
                <label for="charge2">выполняется, не учитывается</label>
              </div>
              <div class="field-radiobutton">
                <RadioButton name="chargeForecasting" :value="2" v-model="modellingSettings.chargeForecasting" inputId="charge3" />
                <label for="charge3">выполняется, учитывается</label>
              </div>
            </Panel>

            <!-- Моделирование полёта -->
            <Panel v-if="systemStatus.typeWorkplace in {1:null, 3:null} && modellingSettings.planSimulation == 1" 
                  header="Моделирование полёта:" toggleable>
              <div class="field-checkbox">
                <Checkbox v-model="modellingSettings.chargeSimulation" inputId="chargeSim" binary />
                <label for="chargeSim">Использование АКБ</label>
              </div>
              <div class="field-checkbox">
                <Checkbox v-model="modellingSettings.optionPro42" inputId="optionPro" binary />
                <label for="optionPro">Использование Pro</label>
              </div>
            </Panel>

            <!-- Межспутниковая связь -->
            <Panel v-if="systemStatus.typeWorkplace in {3:null, 4:null}" 
                  header="Межспутниковая связь для доставки данных:" toggleable>
              <div class="field-radiobutton">
                <RadioButton name="useInteraction" :value="0" v-model="modellingSettings.useInteraction" inputId="interaction1" />
                <label for="interaction1">не используется</label>
              </div>
              <div class="field-radiobutton">
                <RadioButton name="useInteraction" :value="1" v-model="modellingSettings.useInteraction" inputId="interaction2" />
                <label for="interaction2">используется</label>
              </div>
            </Panel>
          </div>

        </div>  
    </div>
  </div>
</template>
  
<script>
import LogComplet from './LogComplet.vue';
import LogDownload from './LogDownload.vue';
import FlightplanForm from './FlightplanForm.vue';
import DefaultTable from '../DefaultTable.vue';
import ShootingPlan from './ShootingPlan.vue';
import E78Table from './E78Table.vue';
import E77E78 from './E77E78.vue';
import BookmarkTable from './BookmarkComponent.vue';

import StatisticComponent from './StatisticComponent.vue';
import LogAll from './LogAll.vue';
import EventLog from './EventLog.vue';

import Panel from 'primevue/panel';
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
  export default {
    name: 'ModelingPanel',
    data(){
      return{
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
        modellingRezult: {
            log: [],
            E77: [],
            E78: [],
            hide: [],
            E79: [],
            Smao: [],
            events: [],
            fcLog:[],
            Select:{
              E77: [],
              E78: [],
              E79: [],
              fcLog:[],
              selectKA: undefined
            }
        },
        ShowMode: 'Settings',
        SettingsShow: true,
        PreWrapDefaultTable: false,
        dataLableName: [{label: "data", nameParam: "data"}],
        dataTable: [],
      }
    },
    props:{
        systemStatus:{
            type: Object
        },
        ModelingRezultMode:{
            type: String
        },
    },
    components:{
      LogComplet,LogDownload,FlightplanForm,
      DefaultTable,ShootingPlan,
        E78Table,
      E77E78,
      BookmarkTable,
      StatisticComponent,
      LogAll,EventLog,

      Panel,
      RadioButton,
      Checkbox
    },
    watch: {
      ModelingRezultMode(newreload) {
        this.ValidateShowPanel(newreload)
        this.modellingRezult = this.$GetModellingRezult()
      },
    },
    methods: {
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
      async ChangeSettings(){
        this.modellingSettings = await this.$SetSettings(this.modellingSettings)
        this.$ReloadSettings()
      },
      ValidateShowPanel(Panel){
        if(Panel == "FcLog")this.ShowFcLog()
        else if(Panel == "LogAll")this.ShowLogAll()
        else if(Panel == "EventLog")this.ShowEventLog()
        else if(Panel == "LogSmao")this.ShowLogSmao()
        else if(Panel == "Settings"){
          this.modellingSettings = this.$GetSettings()
          this.ShowMode = "Settings"
        }

        else this.ShowMode = Panel
      },
      ShowFcLog(){
        this.dataTable = this.modellingRezult.Select.fcLog
        this.dataTable.forEach(element => {
          element.lightName = element.light ? 'Свет':'Тень'
          element.charge100 = Math.floor(element.charge * 100)/100
        })
        this.dataLableName = [{lable:"Начало",nameParam:'timeBegin'},{lable:"Конец",nameParam:'timeEnd'},{lable:"С/Т",nameParam:'lightName'},
          {lable:"Режим",nameParam:'modeName'},{lable:"Цель",nameParam:'orderName'},
          {lable:"Связь с НП",nameParam:'gsContactName'},{lable:"Передача в НП",nameParam:'timeGs'},{lable:"Межспутниковая связь",nameParam:'timeIs'},{lable:"Заряд АКБ",nameParam:'charge100'}
        ]
        this.PreWrapDefaultTable = false
        this.ShowMode='DefaultTable'
      },
      ShowLogAll(){
        this.ShowMode = 'LogAll'
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
        this.ShowMode='DefaultTable'
      },
      async ShowEventLog(){ //Лог событий
        this.ShowMode = 'EventLog'
        /*
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
        this.ShowMode='DefaultTable'*/
      },

    },
    async mounted(){
      this.modellingRezult = await this.$GetModellingRezult()
      console.log(this.modellingRezult, "Результат получен компонентом")
      this.ValidateShowPanel(this.ModelingRezultMode)
    }
  }
  </script>


<style lang="scss" scoped>


.PanelSettings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-radiobutton,
.field-checkbox {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}

.field-radiobutton label,
.field-checkbox label {
  margin-left: 0.5rem;
}


  .PanelSettings{
    display: flex;
    height: 100%;
    text-align: left;
    flex-direction: column;
    fieldset{
      flex: 1;
    }
  }

  .ModellingPanel{
    position: absolute;
    right: 0px;
    overflow: auto;
    max-width: 40%;
    border-left: 3px solid var(--color-border1);
    background-color: var(--color-bg-panel);
    padding: 2px 10px;
    z-index: 1;
    min-width: 30%;
    height: calc(100% - 4px);
    animation: 0.5s ease-out 0s 1 slideInFromRight;
  }
</style>