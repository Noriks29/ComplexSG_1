<template>
    <div class="main_contain">
      <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false" :prevrap="PreWrapDefaultTable"/>
      <E78Table v-if="ShowE78Table" :dataTable="modellingRezultSelect.E78" @closetable="ShowE78Table = false"/>
      <E77E78 v-if="ShowE77E78Table" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78" @closetable="ShowE77E78Table = false"/>
      <BookmarkTable v-if="ShowBookmarkTable" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78" @closetable="ShowBookmarkTable = false"/>

      <div class="ContentDiv">
        <h1 class="TitleText">Планирование съемок  {{ systemStatus.typeWorkplace == 2? "и доставка" : ""}}</h1>
        <div class="FlexRow Panel">
          <div class="ButtonModelling">
            <button v-if="!ExperimentStatus && !modellingSettings.experimentEddit" @click="Experiment(true)" class="ButtonCommand rightPadding"><img src="../../assets/start.png" alt="" class="iconButton">Начать эксперимент</button>
            <button v-if="ExperimentStatus" @click="StartModelling" class="ButtonCommand rightPadding"><img src="../../assets/start.png" alt="" class="iconButton">Старт моделирования</button>
            <button v-if="ExperimentStatus" @click="Experiment(false)" class="ButtonCommand rightPadding">Закончить эксперимент</button>
            <button v-if="!ExperimentStatus && !modellingSettings.experimentEddit" @click="modellingSettings.experimentEddit=true" class="ButtonCommand" >Настройки</button>
            <button v-if="!ExperimentStatus && modellingSettings.experimentEddit" @click="modellingSettings.experimentEddit=false" class="ButtonCommand">Закрыть настройки</button>
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
        </div>
        <div class="Panel MaxWidth" style="flex:1;">
          <div class="PanelWork" v-if="!modellingSettings.experimentEddit">
            <table class="colum">
              <tr>
                <td>Заявки</td>
                <td><button @click="EventE77E78" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План выполнения</button></td>
                <td><button @click="EventBookmark" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План закладок</button></td>
                <td><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Невыполнимые</button></td>
                <td><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог выполнения</button></td>
              </tr>
              <tr>
                <td><SelectDiv  :dataOption="arr" :valueS="valueSS" :id="'0'"  @valueSelect="SelectChange"/></td>
                <td><button @click="ShowShootingPlan" :class="(modellingRezultSelect.E77.length < 1) ? 'disable' : ''" class="ButtonCommand">План съёмок</button></td>
                <td><button @click="EventE78" :class="(modellingRezultSelect.E78.length < 1) ? 'disable' : ''" class="ButtonCommand">План доставки</button></td>
                <td><button @click="EventE79" :class="(modellingRezultSelect.E79.length < 1) ? 'disable' : ''" class="ButtonCommand">План полёта</button></td>
                <td><button :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог полёта</button></td>
              </tr>
              <tr>
                <td></td>
                <td colspan="2"><button @click="ShowLog(modellingRezult.log)" :class="(modellingRezult.log.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог движка</button></td>
                <td colspan="1"><button @click="ShowEventsLogResponse" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог событий</button></td>
                <td colspan="1"><button @click="ShowLog(modellingRezult.Smao)" :class="(modellingRezult.Smao.length < 1) ? 'disable' : ''" class="ButtonCommand icon"><img src="../../assets/instructions.png" alt="smaoResponse"></button></td>
              </tr>
            </table>
          </div>
          <div class="PanelSettings" v-else>
            <fieldset>
              <legend>Тип эксперимента:</legend>
              <div><input type="radio" :value="{flightPlanning: 1, planSimulation: 0}" v-model="modellingSettings.experiment"/><label>планирование съемок</label></div>
              <div><input type="radio" :value="{flightPlanning: 0, planSimulation: 1}" v-model="modellingSettings.experiment"/><label>планирование полёта</label></div>
              <div><input type="radio" :value="{flightPlanning: 1, planSimulation: 1}" v-model="modellingSettings.experiment"/><label>моделирование полёта</label></div>
            </fieldset>
            <fieldset>
              <legend>Прогноз заряда АКБ при планировании:</legend>
              <div><input type="radio" :value="0" v-model="modellingSettings.charge"/><label>не выполняется</label></div>
              <div><input type="radio" :value="1" v-model="modellingSettings.charge"/><label>выполняется, не учитывается</label></div>
              <div><input type="radio" :value="2" v-model="modellingSettings.charge"/><label>выполняется, учитывается</label></div>
            </fieldset>
            <fieldset>
              <legend>Моделирование полёта:</legend>
              <div><input type="radio" :value="{chargeSimulation: 0,flightSimulation: 0}" v-model="modellingSettings.simulation"/><label>без АКБ и без Pro</label></div>
              <div><input type="radio" :value="{chargeSimulation: 1,flightSimulation: 0}" v-model="modellingSettings.simulation"/><label>с АКБ и без Pro</label></div>
              <div><input type="radio" :value="{chargeSimulation: 0,flightSimulation: 1}" v-model="modellingSettings.simulation"/><label>без АКБ и с Pro</label></div>
              <div><input type="radio" :value="{chargeSimulation: 1,flightSimulation: 1}" v-model="modellingSettings.simulation"/><label>с АКБ и с Pro</label></div>
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

import { KaSettings } from './KaSettings';

import { NPList, OGList } from '@/js/GlobalData';


  export default {
    name: 'FlightPlaner',
    mixins: [KaSettings],
    data(){
      return{
        purposesJson: 0,
        OGList: [], // подгружаем импорты
        NPList: [], // подгружаем импорты

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
          experiment: {flightPlanning: 1, planSimulation: 0},
          charge: 0,
          simulation: {chargeSimulation: 0,flightSimulation: 0},
          experimentEddit: false
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

        arr: [],
        valueSS: {},
      }
    },
    components:{
      DefaultTable,
      E78Table,
      E77E78,
      SelectDiv,
      BookmarkTable
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
        this.$emit('ChangeExperimentStatus', {status})
      },
      
      ChangeInputRadio(target){
        this.modellingSettings[target.target.name] = Number(target.target.value)
      },
      async StartModelling(){
        DisplayLoad(true)
        let dataPost = {
            "experimentType": this.modellingSettings.experimentType,
            "modellingMode": this.modellingSettings.modellingMode,
        }
        let rezult = await FetchPost('/api/v1/smao', dataPost) || {engineLogResponse: []}
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
              if (element.mainFlightPlan !== null) {
                this.modellingRezult.E79.push({idSender: element.idSender, data: element.mainFlightPlan.flightPlan})
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
    }
  }
  </script>


<style lang="scss" scoped>
.ContentDiv{
  height: 100%;
}
</style>