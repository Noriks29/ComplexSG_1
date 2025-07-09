<template>
    
    <div class="ModellingPanel" :class="RezultShow?'show':''">
      <div class="tdflexRow">
        <p>Сводки</p>
        <button v-if="systemStatus.typeWorkplace==2" @click="ShowTable='E77E78'" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План выполнения заявок</button>
        <button v-if="systemStatus.typeWorkplace==2" @click="ShowTable='BookmarkTable'" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План закладок</button>
        <button v-if="systemStatus.typeWorkplace in {1:null,3:null,4:null}" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" @click="ShowTablePanel('LogComplet')" class="ButtonCommand">Лог выполнения заявок</button>
        <button v-if="systemStatus.typeWorkplace in {3:null,4:null}" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" @click="ShowTablePanel('LogDownload')" class="ButtonCommand">Лог загрузки сеансов связи</button>
        <button v-if="systemStatus.typeWorkplace in {3:null,4:null}" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" @click="ShowTablePanel('StatisticComponent')" class="ButtonCommand">Статистика</button>
      </div>
      <div class="tdflexRow">
        <p>Работа КА</p>
        <SelectDiv  :dataOption="arr" :valueS="valueSS" :id="'0'"  @valueSelect="SelectChange"/>
        <button @click="ShowTablePanel('ShootingPlan')" :class="(modellingRezult.Select.E77.length < 1) ? 'disable' : ''" class="ButtonCommand">План съёмок</button>
        <button v-if="systemStatus.typeWorkplace in {2:null}" @click="ShowTable='E78Table'" :class="(modellingRezult.Select.E78.length < 1) ? 'disable' : ''" class="ButtonCommand">План доставки</button>
        <button @click="ShowTablePanel('FlightplanForm')" :class="(modellingRezult.Select.E79.length < 1) ? 'disable' : ''" class="ButtonCommand">План полёта</button>
        <button @click="ShowTablePanel('FcLog')" :class="(modellingRezult.Select.fcLog.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог полёта</button>
      </div>
      <div class="tdflexRow">
        <p>Система</p>
        <button @click="ShowTablePanel('LogAll')" :class="(modellingRezult.log.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог движка</button>
        <button @click="ShowTablePanel('EventsLogResponse')" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог событий</button>
        <button @click="ShowTablePanel('LogSmao')" :class="(modellingRezult.Smao.length < 1) ? 'disable' : ''" class="ButtonCommand"><img src="../../assets/instructions.png" alt="smaoResponse" width="32"></button>
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
          fcLog:[],
          Select: {
            E77: [],
            E78: [],
            E79: [],
            fcLog:[],
            selectKA: undefined
          }
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
        SelectDiv,
    },
    methods: {
        RezultShowChange(status){
            this.RezultShow = status
        },
        dataTransfer(data){ //доставка данных в компонент с моделлирования
          this.modellingRezult = data
          this.SelectChange(this.valueSS)
        },
        async SelectChange(target){
          this.valueSS = {value: target.value, lable: target.lable}
          await this.$SetModellingRezultSelect(target.value)
          this.modellingRezult = this.$GetModellingRezult()
          this.ShowTablePanel(null)
        },
        ShowTablePanel(mode){
          this.$emit('showRezult', mode)
        },
        
        async modellingRezultSelect_FillById(id){ //выбор данных под ка
        await this.$SetModellingRezultSelect(id)
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
          this.modellingRezult.Select.selectKA = this.arr[0].value
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
    
    border-top: 3px solid var(--color-border1);
    background-color: var(--color-bg-panel);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: 0px;
    overflow: hidden;
    padding: 0px;
    transition: all 0.5s linear;
    &.show{
      padding: 5px;
      overflow-x: hidden;
      overflow-y: auto;
      width: 210px;
    }
  }
  .tdflexRow{
    width: 210px;
    display: flex;
    flex-direction: column;
  }
</style>