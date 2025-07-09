<template>
  <div class="main_contain RowSection">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
    <div class="ContentDiv" style="margin-top: 30px;" >
        <div class="Panel LeftPanel">
        </div>
        <div class="Panel RightPanel" >
          <LogComplet v-if="ShowMode=='LogComplet'" :dataTable="modellingRezult.events"/>
          <LogDownload v-if="ShowMode=='LogDownload'" :dataTable="modellingRezult.events"/>
          <FlightplanForm v-if="ShowMode=='FlightplanForm'" :dataTable="modellingRezult.Select.E79"/>
          <DefaultTable v-if="ShowMode=='DefaultTable'" :dataLableName="dataLableName" :dataTable="dataTable" :prevrap="PreWrapDefaultTable"/>
          <ShootingPlan v-if="ShowMode=='ShootingPlan'" :dataTable="modellingRezult.Select.E77"/>
          <E78Table v-if="ShowMode=='E78Table'" :dataTable="modellingRezult.Select.E78"/>
          <E77E78 v-if="ShowMode=='E77E78'" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78"/>
          <BookmarkTable v-if="ShowMode=='BookmarkTable'" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78"/>
          <div class="PanelSettings"  @change="ChangeSettings" v-if="ShowMode=='Settings'">

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
import LogComplet from './LogComplet.vue';
import LogDownload from './LogDownload.vue';
import FlightplanForm from './FlightplanForm.vue';
import DefaultTable from '../DefaultTable.vue';
import ShootingPlan from './ShootingPlan.vue';
import E78Table from './E78Table.vue';
import E77E78 from './E77E78.vue';
import BookmarkTable from './BookmarkComponent.vue';
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
      BookmarkTable
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
        else if(Panel == "EventsLogResponse")this.ShowEventsLogResponse()
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
        this.ShowMode='DefaultTable'
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
        this.ShowMode='DefaultTable'
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