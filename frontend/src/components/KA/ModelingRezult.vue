<template>
    <DefaultTable v-if="ShowTable=='DefaultTable'" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowTable=null" :prevrap="PreWrapDefaultTable"/>
    <div class="ModellingPanel" v-if="RezultShow">
          <div class="PanelSettings">
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
                  <button @click="ShowShootingPlan" :class="(modellingRezultSelect.E77.length < 1) ? 'disable' : ''" class="ButtonCommand">План съёмок</button>
                  <button v-if="systemStatus.typeWorkplace in {2:null}" @click="ShowTable='E78Table'" :class="(modellingRezultSelect.E78.length < 1) ? 'disable' : ''" class="ButtonCommand">План доставки</button>
                  <button @click="ShowTable='FlightplanForm'" :class="(modellingRezultSelect.E79.length < 1) ? 'disable' : ''" class="ButtonCommand">План полёта</button>
                  <button @click="ShowFcLog" :class="(modellingRezultSelect.fcLog.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог полёта</button>
                </td>
              </tr>
            </table>
          </div>
          </div>
</template>
  
<script>
import SelectDiv from '../SelectDiv.vue';

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
        SelectDiv
    },
    methods: {
        SettingsShowRezult(stat){
            this.RezultShow = stat
        },
        dataTransfer(data){
          this.modellingRezult = data
          this.modellingRezultSelect_FillById(this.modellingRezultSelect.selectKA)
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
        })
        this.dataLableName = [{lable:"Начало",nameParam:'timeBegin'},{lable:"Конец",nameParam:'timeEnd'},{lable:"С/Т",nameParam:'lightName'},
          {lable:"Режим",nameParam:'modeName'},{lable:"Цель",nameParam:'orderName'},
          {lable:"Связь с НП",nameParam:'gsContactName'},{lable:"Передача в НП",nameParam:'timeGs'},{lable:"Межспутниковая связь",nameParam:'timeIs'},{lable:"АКБ",nameParam:'charge'}
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