<template>
  <Panel :pt="{ header: { style: 'display: none' }, content:{style:'display: flex;padding: 5px;'} }">
          <table class="TableDefault" :class="modellingStatus?'DisableForModelling':''"><tbody>
          <tr><td>
            <FloatLabel>
              <Calendar v-model="dataCalendar.startTime"  @date-select="ChangeTimeInput($event, 'startTime')" @input="ChangeTimeInput($event.target.value, 'startTime')" :invalid="!dataCalendar.startTime" dateFormat="yy-mm-dd" timeFormat="HH:mm:ss" showTime hourFormat="24" showIcon iconDisplay="input" inputId="datetime" showSeconds :manualInput="true"/>
              <label for="startTime">Начальное время расчетов</label>
            </FloatLabel>
          </td>
          <td>
            <FloatLabel>
              <Calendar v-model="dataCalendar.modelingBegin"  @date-select="ChangeTimeInput($event, 'modelingBegin')" @input="ChangeTimeInput($event.target.value, 'modelingBegin')" :invalid="!dataCalendar.modelingBegin" dateFormat="yy-mm-dd" timeFormat="HH:mm:ss" showTime hourFormat="24" showIcon iconDisplay="input" inputId="datetime" showSeconds :manualInput="true"/>
              <label for="modelingBegin">Старт моделирования</label>
            </FloatLabel>
          </td></tr>
          <tr><td>
            <FloatLabel>
              <InputNumber v-model="dataSystem.step" @input="systemChange=true" inputId="step" showButtons :invalid="!dataSystem.step"/>
              <label for="step">Шаг моделлирования</label>
            </FloatLabel>
          </td>
          <td>
            <FloatLabel>
              <Calendar v-model="dataCalendar.modelingEnd"  @date-select="ChangeTimeInput($event, 'modelingEnd')" @input="ChangeTimeInput($event.target.value, 'modelingEnd')" :invalid="!dataCalendar.modelingEnd" dateFormat="yy-mm-dd" timeFormat="HH:mm:ss" showTime hourFormat="24" showIcon iconDisplay="input" inputId="datetime" showSeconds :manualInput="true"/>
              <label for="modelingEnd">Конец моделирования</label>
            </FloatLabel>
          </td>
        </tr>
        </tbody></table>
        <div>
          <Button icon="pi pi-save" :disabled="!systemChange" @click="SaveSystem"/>
        </div>
    </Panel>
  </template>
  
<script>
import { PagesSettings } from './PagesSettings';
import Calendar from 'primevue/calendar';
import FloatLabel from 'primevue/floatlabel';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Panel from 'primevue/panel';
  export default {
    name: 'SystemWindow',
    mixins: [PagesSettings],
    components:{
      Calendar,
      FloatLabel,
      InputNumber,
      Button,
      Panel
    },
    data(){
      return{
        dataSystem:{},
        systemChange: false,
        dataCalendar: {
          modelingEnd: null,modelingBegin:null,startTime:null
        }
      }
    },
    methods: {
      ChangeTimeInput(value, param){
        console.log(value)
        this.systemChange = true
        this.dataSystem[param] = Math.floor(Date.parse(value)/1000)
        console.log(Math.floor(Date.parse(value)/1000))
      },
      async SaveSystem(){
        await this.$ChangeSystemObject(null, null, this.dataSystem)
        this.systemChange = false
      },
      
      async reload(){
        this.dataSystem = await this.$SystemObject()
        this.dataCalendar.modelingEnd =  new Date(this.dataSystem.modelingEnd * 1000) || null
        this.dataCalendar.modelingBegin =  new Date(this.dataSystem.modelingBegin * 1000) || null
        this.dataCalendar.startTime =  new Date(this.dataSystem.startTime * 1000) || null
      }
    },
    async created(){
      this.reload()
    },
  }
  </script>

<style lang="scss" scoped>
.p-float-label{
  display: flex;
  flex-direction: column;
  margin: 20px 5px 0px;
}
.p-button{
  height: calc(100% - 20px);
  margin-top: 20px;
}


.TableDefault{
  background: none;
  text-align: left;
  filter: none;
  tr{
    background: none;
  }
  #step{
    width: calc(100% - 10px);
    padding: 5px;
  }
}
.ButtonUpload{
  padding: 30px 10px;
  img{
    width: 20px;
  }
}
</style>
