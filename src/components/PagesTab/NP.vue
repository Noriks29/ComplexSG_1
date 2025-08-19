<template>
    <div class="main_contain RowSection">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
    <div class="ContentDiv" style="margin-top: 20px;">
    <DataTable :value="dataJson" scrollable scrollHeight="65vh"
      tableStyle="min-width: 50rem" sortMode="multiple" stripedRows removableSort
      ref="dt" :exportFilename="'НП_' + new Date().toISOString().slice(0, 10)">
      <template #header>
        <Toolbar class="mb-4">
          <template #start>
            <Button icon="pi pi-file-excel" severity="help" @click="exportExcel" text label="Exel"/>
          </template>
          <template #end>
            <Button icon="pi pi-plus" class="p-button-sm" severity="success" label="Добавить" rounded text @click="AddRow(0,0)" />
            <Button icon="pi pi-trash" class="p-button-sm" severity="danger" label="Удалить всё" rounded text @click="DeleteAll"/>
          </template>
      </Toolbar>
      </template>
      <Column field="nameEarthPoint" header="Название" sortable>
      <template #body="slotProps">
        <InputText 
          v-model="slotProps.data.nameEarthPoint" 
          @blur="saveChanges(slotProps.data)"
        />
      </template>
    </Column>
      <Column field="latitude" header="Широта" sortable>
      <template #body="slotProps">
        <InputNumber :min="-90" :max="90" mode="decimal" :maxFractionDigits="5"
          v-model="slotProps.data.latitude"  
          @blur="saveChanges(slotProps.data)" 
        />
      </template>
    </Column>
      <Column field="longitude" header="Долгота" sortable>
      <template #body="slotProps">
        <InputNumber :min="-180" :max="180"  mode="decimal" :maxFractionDigits="5"
          v-model="slotProps.data.longitude" 
          @blur="saveChanges(slotProps.data)"
        />
      </template>
    </Column>
      <Column header="" :exportable="false" headerStyle="width: 3rem">
      <template #body="slotProps">
        <Button 
          icon="pi pi-trash" 
          class="p-button-rounded p-button-danger p-button-text" 
          @click="slotProps.data.deleted = true; DeleteRow()"
        />
      </template>
    </Column>
  </DataTable> 
  </div>
  </div>
</template>

<script> 
import { PagesSettings } from './PagesSettings.js';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Toolbar from 'primevue/toolbar';
import XLSX from 'xlsx-js-style';
  export default {
    name: 'NP',
    mixins: [PagesSettings],
    data(){
      return{
        dataJson: [], // локальное хранилище нп
      }
    },
    components:{
      DataTable, Column, Button, InputNumber, InputText, Toolbar
    },
    methods: {
        exportExcel() {
          // 1. Получаем имя файла
          const filename = this.$refs.dt.$props.exportFilename || 'export';
          const headers = [];
          const fields = [];
          this.$refs.dt.$slots.default()
            .filter(col => col.props?.exportable !== false)
            .forEach(col => {
              headers.push(col.props?.header || col.props?.field);
              fields.push(col.props?.field);
            });
          // 3. Подготавливаем данные
          const data = this.dataJson.map(row => {
            const newRow = {};
            fields.forEach(field => {
              newRow[field] = row[field];
            });
            return newRow;
          });
          // 4. Создаем лист Excel
          let style = {
            font: {
              name: 'Calibri',
              sz: 12,
              bold: true,
                  color: {rgb: '000000'} // red font
            },
            border: {
              bottom: { style: 'thin', color: { rgb: '000000' } }
            }}
          // Преобразуем заголовки в массив объектов с стилями
          const styledHeaders = headers.map(text => ({
            v: text,
            t: 's',
            s: style
          }));
          const worksheet = XLSX.utils.json_to_sheet(data, { header: fields });
          XLSX.utils.sheet_add_aoa(worksheet, [styledHeaders], { origin: 'A1' });
          
          // 7. Сохраняем файл
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
          XLSX.writeFile(workbook, `${filename}.xlsx`);
        },
        async AddRow(lng=0,lat=0){
          this.dataJson.push({'nameEarthPoint' : "", 'longitude' : lng, 'latitude' : lat, 'deleted': false});   
          await this.$ChangeNPList(this.dataJson)
          this.dataJson = await this.$GetNPList();
        },
        async saveChanges(data){
          await this.$ChangeNPList(this.dataJson)
          console.log("Позже сделать через отдельный запрос на сохранение изменения одного нп", data)
        },
        async DeleteRow(){
            await this.$ChangeNPList(this.dataJson)
            this.dataJson = await this.$GetNPList();
        },
        async DeleteAll(){
          this.dataJson.forEach(np => {
            np.deleted = true
          })
          await this.$ChangeNPList(this.dataJson)
          this.dataJson = await this.$GetNPList();
        }
    },
    async mounted() {
      this.dataJson = await this.$NPList()
    }
  }
  </script>

<style lang="scss" scoped>
</style>
