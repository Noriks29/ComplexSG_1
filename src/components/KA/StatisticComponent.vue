<template>
  <Toolbar class="mb-4" :style="'width: 100%;padding: 0px;'">
    <template #center>
      <div style="margin-right: 10px;"><Button @click="viewmode=0" label="Выполнение заявок" :outlined="viewmode !== 0"/></div>
      <div><Button @click="viewmode=1" label="Оценки эффективности" :outlined="viewmode !== 1"/></div>
    </template>
    <template #end>
      <Button icon="pi pi-file-excel" severity="help" @click="exportExcel" text label="Exel"/>
    </template>
  </Toolbar>
  <DataTable :value="TimeStatistic" v-if="viewmode==0" scrollable stripedRows :size="'small'" scrollHeight="30vh">
      <Column field="name" header=""/>
      <Column field="valueDelay" header="Ожидание съемки"><template #body="slotProps">{{UnixToDtimeL(slotProps.data.valueDelay)}}</template></Column>
      <Column field="valuePost" header="Время доставки"><template #body="slotProps">{{UnixToDtimeL(slotProps.data.valuePost)}}</template></Column>
  </DataTable>
  <DataTable :value="targetEvent" v-if="viewmode==0" scrollable stripedRows :size="'small'" scrollHeight="60vh" style="margin-top: 20px;">
      <Column field="name" header="Заявка"/>
      <Column field="data.status" header="Выполнена"><template #body="slotProps">{{slotProps.data.data.status?'Да':'Нет'}}</template></Column>
      <Column field="data.timeDelay" header="Ожидание съемки"><template #body="slotProps">{{UnixToDtimeL(slotProps.data.data.timeDelay)}}</template></Column>
      <Column field="data.timePost" header="Время доставки"><template #body="slotProps">{{UnixToDtimeL(slotProps.data.data.timePost)}}</template></Column>
      <Column field="data.timeTransferSum" header="Время передачи"><template #body="slotProps">{{UnixToDtimeL(slotProps.data.data.timeTransferSum)}}</template></Column>
      <Column field="losts" header="Потери, Мбайт"><template #body="slotProps">{{Math.round(slotProps.data.losts)}}</template></Column>
  </DataTable>
  <DataTable :value="notTransmittedData" v-if="viewmode==0" scrollable stripedRows :size="'small'" scrollHeight="60vh" style="margin-top: 20px;">
      <Column field="cluster" header="Кластер"/>
      <Column field="satName" header="КА"/>
      <Column field="orderName" header="Заявка"/>
      <Column field="dataVolume" header="Обьём потери Мбайт"><template #body="slotProps">{{Math.round(slotProps.data.dataVolume)}}</template></Column>
  </DataTable>
  
  <DataTable :value="TableReall" v-if="viewmode==1" scrollable stripedRows :size="'small'" scrollHeight="30vh" >
      <Column field="label" header="Окно видимости"/>
      <Column field="target" header="Кол-во заявок"/>
      <Column field="percent" header="% заявок"/>
  </DataTable>
  <DataTable :value="KPIOG" v-if="viewmode==1" scrollable stripedRows :size="'small'" scrollHeight="60vh" style="margin-top: 20px;">
      <Column field="cluster" header="Кластер"/>
      <Column field="orderCount" header="Кол-во заявок"/>
  </DataTable>
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
            targetEvent: [],
            TimeStatistic: [{name: 'Минимальное', valueDelay: Infinity, valuePost: Infinity},
              {name: 'Среднее', valueDelay: null, valuePost: null},
              {name: 'Максимальное', valueDelay: -Infinity, valuePost: -Infinity},
            ],
            KPIOG: [],
            TableReall:[{label: 1, target: 0, percent: null},{label: 2, target: 0, percent: null},{label: 3, target: 0, percent: null},{label: "Не запланировано", target: 0, percent: null}],
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
            let KPIOGData = {}
            OGlist.forEach(og => {
              og.satellites.forEach(sat => {
                SatOgList[sat.name] = og.constellationName
              })
              KPIOGData[og.constellationName] = 0
            })
            let DataforTargetEvent = {}
            console.log(dataT)
            dataT.forEach(event => {
                if(event.orderName != null){
                    if(!(event.orderName in DataforTargetEvent)){
                        DataforTargetEvent[event.orderName] = {
                          events:[], status: false, timeDelayStart: null, timeDelay: null, timePostStart: null, timePost: null, events7: 0,
                          timeTransferStart: null, timeTransferSum: null
                        }
                    }
                    DataforTargetEvent[event.orderName].events.push(event)
                    if(event.type == 9){
                        DataforTargetEvent[event.orderName].status = true
                        
                        if(KPIOGData[SatOgList[event.node1Name]] == undefined) KPIOGData[SatOgList[event.node1Name]] = 0
                        KPIOGData[SatOgList[event.node1Name]] += 1
                        if(DataforTargetEvent[event.orderName].timeDelayStart != null) DataforTargetEvent[event.orderName].timeDelay = event.time - DataforTargetEvent[event.orderName].timeDelayStart
                    }
                    else if(event.type == 1 && DataforTargetEvent[event.orderName].timeDelayStart == null){
                        DataforTargetEvent[event.orderName].timeDelayStart = event.time
                    }
                    else if(event.type == 10 || event.type == 41){DataforTargetEvent[event.orderName].timePostStart = event.time}
                    else if(event.type == 11){DataforTargetEvent[event.orderName].timeTransferStart = event.time}
                    else if(event.type == 12){
                      DataforTargetEvent[event.orderName].timePost = event.time - DataforTargetEvent[event.orderName].timePostStart
                      if(DataforTargetEvent[event.orderName].timeTransferStart != null){
                        DataforTargetEvent[event.orderName].timeTransferSum += event.time - DataforTargetEvent[event.orderName].timeTransferStart
                      }
                    }
                    else if(event.type == 7){DataforTargetEvent[event.orderName].events7 += 1}
                }
            })
            let PostCount = 0; let PostSumm = 0
            let DelayCount = 0; let DelaySumm = 0
            let targetCounter = 0
            for (var i in DataforTargetEvent){
                if(DataforTargetEvent[i].timeDelay > 0){
                  this.TimeStatistic[0].valueDelay = Math.min(this.TimeStatistic[0].valueDelay, DataforTargetEvent[i].timeDelay)
                  this.TimeStatistic[2].valueDelay = Math.max(this.TimeStatistic[2].valueDelay, DataforTargetEvent[i].timeDelay)
                  DelayCount += 1; DelaySumm+= DataforTargetEvent[i].timeDelay
                }
                if(DataforTargetEvent[i].timePost > 0){
                  this.TimeStatistic[0].valuePost = Math.min(this.TimeStatistic[0].valuePost, DataforTargetEvent[i].timePost)
                  this.TimeStatistic[2].valuePost = Math.max(this.TimeStatistic[2].valuePost, DataforTargetEvent[i].timePost)
                  PostCount += 1; PostSumm += DataforTargetEvent[i].timePost
                }
                if(DataforTargetEvent[i].status){
                    if(DataforTargetEvent[i].events7 == 0){this.TableReall[0].target+=1}
                    else if(DataforTargetEvent[i].events7 == 1){this.TableReall[1].target+=1}
                    else if(DataforTargetEvent[i].events7 > 1){this.TableReall[2].target+=1}
                    else this.TableReall[3].target += 1
                }
                else {
                  this.TableReall[3].target += 1
                }
                targetCounter +=1
            }
            for (let i = 0; i < 4; i++) {
              this.TableReall[i].percent = Math.round(this.TableReall[i].target/targetCounter*100)
            }
            this.TimeStatistic[1].valueDelay = DelaySumm/DelayCount 
            this.TimeStatistic[1].valuePost = PostSumm/PostCount

            for(var i in KPIOGData){
              this.KPIOG.push({cluster: i, orderCount: KPIOGData[i]})
            }

            for (var i in DataforTargetEvent) {
              let postData = {name: i, data: DataforTargetEvent[i], losts: 0}
              console.log(postData)
              for (let j = 0; j < this.notTransmittedData.length; j++) {
                if(i == this.notTransmittedData[j].orderName) postData.losts += this.notTransmittedData[j].dataVolume
              }
              this.targetEvent.push(postData)
            }
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