<template>
    <div class="main_contain RowSection">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
          
          
    <div class="ContentDiv" style="margin-top: 30px;" >
    <div class="Panel RightPanel">
      <Toolbar class="mb-4">
        <template #start>
        </template>
        <template #end>
          <Button icon="pi pi-plus" class="p-button-sm" severity="success" label="Добавить" rounded text @click="AddRow()" />
        </template>
      </Toolbar>
      <DataTable :value="dataJson"
          tableStyle="min-width: 50rem" sortMode="multiple" stripedRows removableSort
          ref="dtDZZcatalog" :exportFilename="'События_' + new Date().toISOString().slice(0, 10)">
          <Column field="id" header="ID" sortable/>
          <Column field="codeEvent" header="Код">
            <template #body="slotProps"><div class="narrow-input-container">
              <InputNumber v-model="slotProps.data.codeEvent" showButtons @input="SaveChange($event)" :invalid="!slotProps.data.codeEvent && slotProps.data.codeEvent !== 0" :pt="{root: { style: 'width: 100%' },input: { style: 'width: 100px' }}" class="MinInput"/>
            </div></template>
          </Column>
          <Column field="descriptionEvent" header="Событие">
            <template #body="slotProps"><div class="narrow-input-container">
              <InputText v-model="slotProps.data.descriptionEvent" @input="SaveChange(slotProps.data)" :invalid="!slotProps.data.descriptionEvent"/>
            </div></template>
          </Column>
          <Column header="" :exportable="false" headerStyle="width: 3rem">
            <template #body="slotProps">
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" 
                @click="slotProps.data.deleted = true; DeleteRow()"/>
            </template>
          </Column>
      </DataTable>
    </div>
    </div>
    </div>
  </template>
  
  <script>
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputNumber from 'primevue/inputnumber';
  import Button from 'primevue/button';
  import Toolbar from 'primevue/toolbar';
  import InputText from 'primevue/inputtext';
  export default {
    name: 'LogEventList',
    data(){
      return{
        dataJson: []
      }
    },
    components: {
      DataTable,Column,InputNumber,Button,Toolbar,InputText
    },
    props:{
    systemStatus:{
          type: Object
        },
        modellingStatus:{
          type: Boolean
        }
    },
    methods: {
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
      async setPost() {
          this.$showLoad(true)
          await this.$FetchPost("/api/v1/event/code/add", this.dataJson)
          await this.ReFetch()
          this.$showLoad(false)
        },
        async AddRow(){
          var addedRow = {'id' : undefined, 'codeEvent' : "", 'descriptionEvent' : "", 'deleted': false};
          this.dataJson.push(addedRow);
          this.setPost()
        },
        SaveChange(){
          this.setPost()
        },
        async DeleteRow(){
          await this.setPost()
        },
        async ReFetch(){
          this.dataJson = await this.$FetchGet('/api/v1/event/codes/all') || []
        }
      
    },
    mounted() {
      this.ReFetch()
    }
  }
  </script>

  <style lang="scss" scoped>
  .narrow-input-container {
  width: 100%;
  display: flex;
  justify-content: center;
  .p-inputnumber, .p-inputtext {//контроль размеров инпута
    width: 100px !important;
    min-width: 100%;
    flex-direction: column;
  }
}
  .description{
        width: 30vw;
    }

</style>