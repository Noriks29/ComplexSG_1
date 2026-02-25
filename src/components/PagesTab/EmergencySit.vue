<template>
    <div class="main_contain">
      <div сlass="HeaderContain">
        <Toolbar class="mb-4">
          <template #start>
            <Button icon="pi pi-plus" severity="success" @click="AddRow" text style="margin-left: 15px;"/>
          </template>
          <template #center>
          </template>
          <template #end>
          </template>
        </Toolbar> 
      </div>
    <div class="ContentDiv">
      <DataTable :value="dataTable" scrollable scrollHeight="60vh"
        tableStyle="min-width: 50rem" sortMode="multiple" stripedRows removableSort :size="'small'">
        <Column field="KA" header="KA">
          <template #body="slotProps">
            <Dropdown v-model="slotProps.data.satelliteId" :options="OG" @change="" optionLabel="name" optionValue="satelliteId" placeholder="Выберите КА"/>
          </template>
        </Column>
        <Column field="time" header="Время">
          <template #body="slotProps">
            <Calendar v-model="slotProps.data.timePr"  @date-select="ChangeTimeInput($event, slotProps.data)" @blur="ChangeTimeInput($event.value, slotProps.data)" dateFormat="yy-mm-dd" timeFormat="HH:mm:ss" showTime hourFormat="24" showIcon iconDisplay="input" inputId="datetime" showSeconds :manualInput="true"/>
          </template>
        </Column>
        <Column field="del" header="">
          <template #body="slotProps">
            <Button icon="pi pi-trash" severity="danger" @click="DeleteRow(slotProps)" text style="margin-left: 15px;"/>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  </template>
  
  <script>
import { PagesSettings } from './PagesSettings';
import { CreateDateTime } from '@/js/WorkWithDTime';


  export default {
    name: 'TargetDZZ',
    mixins: [PagesSettings],
    data(){
      return{
        dataTable: [],
        OG:[],
        EmergencySit: null
      }
    },
    components:{},
    methods: {
        async ReFetch(){

        },
        AddRow(){
          this.dataTable.push({satelliteId: null, time: null})
        },
        DeleteRow(data){
          console.log(data)
          this.dataTable.splice(data.index, 1);
        },
        ChangeTimeInput(value, data){
          for (let i = 0; i < this.dataTable.length; i++) {
            if(this.dataTable[i].satelliteId == data.satelliteId){
            this.dataTable[i].time = Math.floor(Date.parse(value)/1000)
              break
            }
          }
        },
    },
    
    async mounted() {
      this.$showLoad(true)
      let ogData = await this.$OGList().value || []
      ogData.forEach(og => {
        og.satellites.forEach(sat => {
          this.OG.push({satelliteId: sat.satelliteId, name: sat.name})
        })
      })
      this.EmergencySit = await this.$EmergencySit()
      this.dataTable = this.EmergencySit
      this.dataTable.forEach(el => {
        el.timePr = new Date(el.time * 1000) || null
      })
      console.log(this.dataTable)
      this.$showLoad(false)
    }
  }
  </script>

