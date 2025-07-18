<template>
    <div class="ContentDiv">
        <div class="Panel LeftPanel">
            <div class="FlexColumn">
              <div><button @click="viewmode=0" class="ButtonCommand" :class="viewmode==0?'Select':''">Выполнение заявок</button></div>
              <div><button @click="viewmode=1" class="ButtonCommand" :class="viewmode==1?'Select':''">Оценки эффективности</button></div>
            </div>
        </div>
        <div class="Panel RightPanel" >
          <div v-if="viewmode == 0" class="TableDiv" style="max-height: 85vh; min-height: 80%;">
            <table class="TableDefault">
              <thead><tr><th></th><th>Ожидание съемки</th><th>Время доставки</th></tr></thead>
              <tbody>
                <tr><th>Среднее</th><td>{{ UnixToDtimeL(dataStatistic.timeDelay/dataStatistic.timeDelayCount) }}</td><td>{{ UnixToDtimeL(dataStatistic.timePost/dataStatistic.timePostCount) }}</td></tr>
                <tr><th>Минимальное</th><td>{{ UnixToDtimeL(dataStatistic.timeDelayMin) }}</td><td>{{ UnixToDtimeL(dataStatistic.timePostMin) }}</td></tr>
                <tr><th>Максимальное</th><td>{{ UnixToDtimeL(dataStatistic.timeDelayMax) }}</td><td>{{ UnixToDtimeL(dataStatistic.timePostMax) }}</td></tr>
              </tbody>
            </table>
            <table class="TableDefault SelectModeTable TopM">
              <thead><tr><th>Заявка</th><th>Выполнена</th><th>Ожидание съемки</th><th>Время доставки</th></tr></thead>
              <tbody>
                <tr v-for="data, index in targetEvent" :key="index" @click="TableSelect=index" :class="index==TableSelect?'select':''">
                    <td>{{ data.events[0].orderName}}</td><td>{{ data.status}}</td><td>{{ UnixToDtimeL(data.timeDelay)}}</td><td>{{ UnixToDtimeL(data.timePost)}}</td>
                </tr>
              </tbody>
            </table>
            <table class="TableDefault TopM" v-if="TableSelect != undefined">
              <thead><tr><th>Время</th><th>Код</th><th>Событие</th><th>Заявка</th><th>Узел</th></tr></thead>
              <tbody>
                <tr v-for="data, index in targetEvent[TableSelect].events" :key="index">
                    <td>{{ data.timeUnix }}</td><td>{{ data.type }}</td><td>{{ data.event }}</td><td>{{ data.orderName }}</td><td>{{ data.node1Name }}</td>
                </tr>
              </tbody>
            </table>
          </div>

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
          <thead><tr><th>Кластер</th><th>Кластер</th><th>Время начала</th><th>Длитель-ность</th><th>% использования</th></tr></thead>
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
            dataStatistic: {
                timeDelay: 0, timeDelayCount: 0, timeDelayMin: 99999999999999999999, timeDelayMax: 0,
                timePost: 0, timePostCount: 0, timePostMin: 99999999999999999999, timePostMax: 0
            },
            KPIOG: {},
            TableSelect: undefined,
            TableReallocation: {targetCount:0, target1: 0, target2: 0, target3: 0, targetNone: 0},
            viewmode: 0,
        }
      },
      methods:
        {
          LoadXLSX(){},
          CreatePlot(){},
          UnixToDtimeL(time){
            return UnixToDtime(time, true, false).time
          },
          PrevrapData(){
            let dataT = []
            dataT = dataT.concat(this.dataTable)
            let OGlist = this.$OGList()
            
            
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
            for (var i in this.targetEvent){
                if(this.targetEvent[i].timeDelay > 0){
                    this.dataStatistic.timeDelay += this.targetEvent[i].timeDelay
                    this.dataStatistic.timeDelayCount += 1
                    this.dataStatistic.timeDelayMin = Math.min(this.dataStatistic.timeDelayMin, this.targetEvent[i].timeDelay)
                    this.dataStatistic.timeDelayMax = Math.max(this.dataStatistic.timeDelayMax, this.targetEvent[i].timeDelay)
                }
                if(this.targetEvent[i].timePost > 0){
                    this.dataStatistic.timePost += this.targetEvent[i].timePost
                    this.dataStatistic.timePostCount += 1
                    this.dataStatistic.timePostMin = Math.min(this.dataStatistic.timePostMin, this.targetEvent[i].timePost)
                    this.dataStatistic.timePostMax = Math.max(this.dataStatistic.timePostMax, this.targetEvent[i].timePost)
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
                console.log(dataT, "fsfesfsefesfesf", OGlist, SatOgList,this.KPIOG)
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
}
  </style>