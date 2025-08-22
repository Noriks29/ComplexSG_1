<template>
  <Toolbar class="mb-4" :style="'width: 100%;padding: 0px;'">
    <template #center>
      <div style="margin-right: 10px;"><Button @click="viewmode=0" label="Выполнение заявок" :outlined="viewmode == 0"/></div>
      <div><Button @click="viewmode=1" label="Оценки эффективности" :outlined="viewmode == 1"/></div>
    </template>
    <template #end>
      <Button icon="pi pi-file-excel" severity="help" @click="exportExcel" text label="Exel"/>
    </template>
  </Toolbar>
  <DataTable :value="TimeStatistic" v-if="viewmode==0" scrollable stripedRows>
      <Column field="name" header=""/>
      <Column field="valueDelay" header="Ожидание съемки"><template #body="slotProps">{{UnixToDtimeL(slotProps.data.valueDelay)}}</template></Column>
      <Column field="valuePost" header="Время доставки"><template #body="slotProps">{{UnixToDtimeL(slotProps.data.valuePost)}}</template></Column>
  </DataTable>
  <DataTable :value="targetEvent" v-if="viewmode==0" scrollable stripedRows>
      <Column field="events" header="Заявка"><template #body="slotProps">{{slotProps.data.events[0].orderName}}</template></Column>
      <Column field="status" header="Выполнена"><template #body="slotProps">{{slotProps.data.status?'Да':'Нет'}}</template></Column>
      <Column field="timeDelay" header="Ожидание съемки"><template #body="slotProps">{{UnixToDtimeL(slotProps.data.timeDelay)}}</template></Column>
      <Column field="timePost" header="Время доставки"><template #body="slotProps">{{UnixToDtimeL(slotProps.data.timePost)}}</template></Column>
  </DataTable>
  <DataTable :value="notTransmittedData" v-if="viewmode==0" scrollable stripedRows>
      <Column field="cluster" header="Кластер"/>
      <Column field="satName" header="КА"/>
      <Column field="orderName" header="Заявка"/>
      <Column field="dataVolume" header="Обьём потери"/>
  </DataTable>

    <div class="ContentDiv">
        <div class="Panel RightPanel" >
          <div v-if="viewmode == 1" class="TableDiv" style="max-height: 85vh; min-height: 80%;">
          <table class="TableDefault">
          <thead><tr><th>Окно видимости</th><th>Кол-во заявок</th><th>% заявок</th></tr></thead>
            <tbody>
                <tr><th>1</th><td>{{ TableReallocation.target1 }}</td><td>{{ (Math.round(TableReallocation.target1 / TableReallocation.targetCount*100)) || '0' }}</td></tr>
                <tr><th>2</th><td>{{ TableReallocation.target2 }}</td><td>{{ (Math.round(TableReallocation.target2 / TableReallocation.targetCount*100)) || '0' }}</td></tr>
                <tr><th>3</th><td>{{ TableReallocation.target3 }}</td><td>{{ (Math.round(TableReallocation.target3 / TableReallocation.targetCount*100)) || '0' }}</td></tr>
                <tr><th>Не запланировано</th><td>{{ TableReallocation.targetNone }}</td><td>{{ (Math.round(TableReallocation.targetNone / TableReallocation.targetCount*100)) || '0' }}</td></tr>
            </tbody>
          </table>
          <table class="TableDefault TopM">
          <thead><tr><th>Кластер</th><th>Кол-во заявок</th></tr></thead>
          <tbody>
                <tr v-for="data, index in KPIOG" :key="index">
                  <td>{{ index }}</td> <td>{{ data.orderCount }}</td>
                </tr>
              
            </tbody>
          </table>
        </div>
        </div>  
    </div>
</template>
  
  <script>

    import { UnixToDtime } from '@/js/WorkWithDTime'
    export default {
      name: 'StatisticComponent',
      props: {
        dataTable:{
          type: Array
        },
      },
      data() {
        return {
            targetEvent: {},
            TimeStatistic: [{name: 'Минимальное', valueDelay: Infinity, valuePost: Infinity},
              {name: 'Среднее', valueDelay: null, valuePost: null},
              {name: 'Максимальное', valueDelay: -Infinity, valuePost: -Infinity},
            ],
            KPIOG: {},
            TableReallocation: {targetCount:0, target1: 0, target2: 0, target3: 0, targetNone: 0},
            viewmode: 0,

            notTransmittedData: []
        }
      },
      methods:
        {
          LoadXLSX(){},
          CreatePlot(){},
          UnixToDtimeL(time){
            if((!time || time == Infinity || time == -Infinity) && time !== 0) return '-'
            return UnixToDtime(time, true, false).time
          },
          PrevrapData(){
            let dataT = []
            dataT = dataT.concat(this.dataTable.events)
            let OGlist = this.$OGList()
            this.notTransmittedData = this.dataTable.smaoTables.notTransmittedData
            
            let SatOgList = {}
            OGlist.forEach(og => {
              og.satellites.forEach(sat => {
                SatOgList[sat.name] = og.constellationName
              })
              this.KPIOG[og.constellationName] = {orderCount: 0}
            })
            dataT.forEach(event => {
                if(event.orderName != null){
                    if(!(event.orderName in this.targetEvent)){
                        this.targetEvent[event.orderName] = {events:[], status: false, timeDelayStart: null, timeDelay: null, timePostStart: null, timePost: null, events7: 0 }
                    }
                    this.targetEvent[event.orderName].events.push(event)
                    if(event.type == 9){
                        this.targetEvent[event.orderName].status = true
                        
                        if(this.KPIOG[SatOgList[event.node1Name]] == undefined) this.KPIOG[SatOgList[event.node1Name]] = {orderCount: 0}
                        this.KPIOG[SatOgList[event.node1Name]].orderCount += 1
                        if(this.targetEvent[event.orderName].timeDelayStart != null) this.targetEvent[event.orderName].timeDelay = event.time - this.targetEvent[event.orderName].timeDelayStart
                    }
                    else if(event.type == 1 && this.targetEvent[event.orderName].timeDelayStart == null){
                        this.targetEvent[event.orderName].timeDelayStart = event.time
                    }
                    else if(event.type == 10){this.targetEvent[event.orderName].timePostStart = event.time}
                    else if(event.type == 12){this.targetEvent[event.orderName].timePost = event.time - this.targetEvent[event.orderName].timePostStart}
                    else if(event.type == 7){this.targetEvent[event.orderName].events7 += 1}
                }
            })
            let PostCount = 0; let PostSumm = 0
            let DelayCount = 0; let DelaySumm = 0
            for (var i in this.targetEvent){
                if(this.targetEvent[i].timeDelay > 0){
                  this.TimeStatistic[0].valueDelay = Math.min(this.TimeStatistic[0].valueDelay, this.targetEvent[i].timeDelay)
                  this.TimeStatistic[2].valueDelay = Math.max(this.TimeStatistic[0].valueDelay, this.targetEvent[i].timeDelay)
                  DelayCount += 1; DelaySumm+= this.targetEvent[i].timeDelay
                }
                if(this.targetEvent[i].timePost > 0){
                  this.TimeStatistic[0].valuePost = Math.min(this.TimeStatistic[0].valuePost, this.targetEvent[i].timePost)
                  this.TimeStatistic[2].valuePost = Math.max(this.TimeStatistic[0].valuePost, this.targetEvent[i].timePost)
                  PostCount += 1; PostSumm += this.targetEvent[i].timePost
                }
                if(this.targetEvent[i].status){
                    this.TableReallocation.targetCount+=1
                    if(this.targetEvent[i].events7 == 0){this.TableReallocation.target1+=1}
                    else if(this.targetEvent[i].events7 == 1){this.TableReallocation.target2+=1}
                    else if(this.targetEvent[i].events7 > 1){this.TableReallocation.target3+=1}
                    else this.TableReallocation.targetNone += 1
                }
                else {
                  this.TableReallocation.targetNone += 1
                  this.TableReallocation.targetCount+=1
                }
            }
            this.TimeStatistic[1].valueDelay = DelaySumm/DelayCount 
            this.TimeStatistic[1].valuePost = PostSumm/PostCount
          },
      },
      mounted() {
        this.PrevrapData()
      }
    }
  </script>
  
  
  <style lang="scss" scoped>
.TopM{
        margin-top: 40px;

        tr{
          td{
            text-align: center !important;
          }
        }
}
  </style>