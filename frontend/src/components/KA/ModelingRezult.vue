<template>
    <DefaultTable v-if="ShowTable=='DefaultTable'" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowTable=null" :prevrap="PreWrapDefaultTable"/>
    <E78Table v-if="ShowTable=='E78Table'" :dataTable="modellingRezultSelect.E78" @closetable="ShowTable=null"/>
    <E77E78 v-if="ShowTable=='E77E78'" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78" @closetable="ShowTable=null"/>
    <BookmarkTable v-if="ShowTable=='BookmarkTable'" :dataTable1="modellingRezult.E77" :dataTable2="modellingRezult.E78" @closetable="ShowTable=null"/>
    <FlightplanForm v-if="ShowTable=='FlightplanForm'" :dataTable="modellingRezultSelect.E79" @closetable="ShowTable=null"/>
    <LogDownload v-if="ShowTable=='LogDownload'" :dataTable="modellingRezult.events" @closetable="ShowTable=null"/>
    <LogComplet v-if="ShowTable=='LogComplet'" :dataTable="modellingRezult.events" @closetable="ShowTable=null" />
    <div class="ModellingPanel" v-if="RezultShow">
      <div class="tdflexRow">
        <p>Сводки</p>
        <button v-if="systemStatus.typeWorkplace==2" @click="ShowTable='E77E78'" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План выполнения заявок</button>
        <button v-if="systemStatus.typeWorkplace==2" @click="ShowTable='BookmarkTable'" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План закладок</button>
        <button v-if="systemStatus.typeWorkplace in {1:null,3:null,4:null}" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" @click="ShowTable='LogComplet'" class="ButtonCommand">Лог выполнения заявок</button>
        <button v-if="systemStatus.typeWorkplace in {3:null,4:null}" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" @click="ShowTable='LogDownload'" class="ButtonCommand">Лог загрузки сеансов связи</button>
        <button v-if="systemStatus.typeWorkplace in {3:null,4:null}" :class="(modellingRezult.hide.length < 1) ? 'disable' : ''" class="ButtonCommand">Статистика</button>
      </div>
      
      <div class="tdflexRow">
        <p>Работа КА</p>
        <SelectDiv  :dataOption="arr" :valueS="valueSS" :id="'0'"  @valueSelect="SelectChange"/>
        <button @click="ShowShootingPlan" :class="(modellingRezultSelect.E77.length < 1) ? 'disable' : ''" class="ButtonCommand">План съёмок</button>
        <button v-if="systemStatus.typeWorkplace in {2:null}" @click="ShowTable='E78Table'" :class="(modellingRezultSelect.E78.length < 1) ? 'disable' : ''" class="ButtonCommand">План доставки</button>
        <button @click="ShowTable='FlightplanForm'" :class="(modellingRezultSelect.E79.length < 1) ? 'disable' : ''" class="ButtonCommand">План полёта</button>
        <button @click="ShowFcLog" :class="(modellingRezultSelect.fcLog.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог полёта</button>
      </div>
      <div class="tdflexRow">
        <p>Система</p>
        <button @click="ShowLogAll" :class="(modellingRezult.log.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог движка</button>
        <button @click="ShowEventsLogResponse" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог событий</button>
        <button @click="ShowLogSmao" :class="(modellingRezult.Smao.length < 1) ? 'disable' : ''" class="ButtonCommand"><img src="../../assets/instructions.png" alt="smaoResponse" width="32"></button>
      </div>
  </div>
</template>
  
<script>
import SelectDiv from '../SelectDiv.vue';
import DefaultTable from '../DefaultTable.vue';
import E78Table from './E78Table.vue';
import E77E78 from './E77E78.vue';
import BookmarkTable from './BookmarkComponent.vue';
import FlightplanForm from './FlightplanForm.vue';
import LogDownload from './LogDownload.vue';
import LogComplet from './LogComplet.vue';
  export default {
    name: 'ModelingRezult',
    data(){
      return{
        RezultShow: false,
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

        ShowTable: null, //переменная для отображения таблиц
        PreWrapDefaultTable: false,
        dataLableName: [{label: "data", nameParam: "data"}],
        dataTable: [],
      }
    },
    props:{
        systemStatus:{
            type: Object
        },
    },
    components:{
        SelectDiv,DefaultTable,
        E78Table,
      E77E78,
      BookmarkTable,
      FlightplanForm,
      LogDownload,
      LogComplet
    },
    methods: {
        SettingsShowRezult(stat){
            this.RezultShow = stat
        },
        dataTransfer(data){
          this.modellingRezult = data
          this.modellingRezultSelect_FillById(this.modellingRezultSelect.selectKA)
        },
        SelectChange(target){
          this.modellingRezultSelect_FillById(target.value)
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
        console.log('modellingRezultSelect',this.modellingRezultSelect)
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
      ShowFcLog(){
        this.dataTable = this.modellingRezultSelect.fcLog
        this.dataTable.forEach(element => {
          element.lightName = element.light ? 'Свет':'Тень'
          element.charge100 = Math.floor(element.charge * 100)/100
        })
        this.dataLableName = [{lable:"Начало",nameParam:'timeBegin'},{lable:"Конец",nameParam:'timeEnd'},{lable:"С/Т",nameParam:'lightName'},
          {lable:"Режим",nameParam:'modeName'},{lable:"Цель",nameParam:'orderName'},
          {lable:"Связь с НП",nameParam:'gsContactName'},{lable:"Передача в НП",nameParam:'timeGs'},{lable:"Межспутниковая связь",nameParam:'timeIs'},{lable:"АКБ",nameParam:'charge100'}
        ]
        this.PreWrapDefaultTable = false
        this.ShowTable='DefaultTable'
      },
      async ReLoadComponent(){
        this.ConstellationJson = this.$OGList()
        let result = await this.$FetchGet('/api/v1/satrequest/request/get/all') || []
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
      await this.ReLoadComponent()
      document.addEventListener('keydown', (event) => {
            if (event.code == 'Escape') {
                this.ShowTable = null
            }
          });
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
    overflow: auto;
    border-top: 3px solid var(--color-border1);
    background-color: var(--color-bg-panel);
    animation: 0.5s ease-out 0s 1 slideInFromRight;
    padding: 5px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .tdflexRow{
    display: flex;
    flex-direction: column;
  }
</style>