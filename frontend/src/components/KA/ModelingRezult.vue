<template>
    <div class="ModellingPanel" v-if="SettingsShow">
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
        SettingsShow: true,
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
        SettingsShowChange(stat){
            this.SettingsShow = stat
        },
    },
    async mounted(){

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