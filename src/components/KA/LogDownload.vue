<template>
  <Toolbar class="mb-4" :style="'width: 100%;padding: 0px;'">
      <template #end>
        <Button icon="pi pi-file-excel" severity="help" @click="exportExcel" text label="Exel (не работает)"/>
      </template>
  </Toolbar>
  <DataTable :value="processedData" class="p-datatable-sm" rowGroupMode="rowspan" 
            :groupRowsBy="groupKey" scrollable scrollHeight="500px"
            ref="dt" :exportFilename="'Лог_доставки_' + new Date().toISOString().slice(0, 10)">
    <Column field="typeContact" header="Тип контакта">
      <template #body="slotProps">
        {{ slotProps.data.typeContactDisplay }}
      </template>
      <template #groupheader="slotProps">
        <strong>Группа: {{ slotProps.data.typeContactDisplay }}</strong>
      </template>
    </Column>
    
    <Column field="timeRangeDisplay" header="Временной диапазон">
      <template #body="slotProps">
        {{ slotProps.data.timeRangeDisplay }}
      </template>
    </Column>
    
    <Column field="node1" header="Узел 1"></Column>
    <Column field="order" header="Заявка"></Column>
    <Column field="node2" header="Узел 2"></Column>
    <Column field="ts" header="Начало">
      <template #body="slotProps">
        {{ formatTime(slotProps.data.ts) }}
      </template>
    </Column>
    <Column field="te" header="Конец">
      <template #body="slotProps">
        {{ formatTime(slotProps.data.te) }}
      </template>
    </Column>
  </DataTable>
</template>
  
<script>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import XLSX from 'xlsx-js-style';
    export default {
      name: 'TableData',
      props: {
        dataTable:{
          type: Array
        },
      },
      components: {
        Column,DataTable,Button,Toolbar
      },
      data() {
        return {
            dataT: [],
        }
      },
      computed: {
        processedData() {
          // 1. Группируем данные
          const groups = {};
          this.dataT.forEach(item => {
            const key = `${item.typeContact}_${item.valueTimeStart}_${item.valueTimeEnd}`;
            if (!groups[key]) {
              groups[key] = {
                typeContact: item.typeContact,
                typeContactDisplay: item.typeContact,
                valueTimeStart: item.valueTimeStart,
                valueTimeEnd: item.valueTimeEnd,
                timeRangeDisplay: this.formatTimeRange(item.valueTimeStart, item.valueTimeEnd),
                items: []
              };
            }
            groups[key].items.push(item);
          });
          // 2. Создаем плоский массив для таблицы
          const result = [];
          Object.values(groups).forEach(group => {
            // Добавляем заголовок группы
            result.push({
              ...group,
              isGroupHeader: true,
              node1: '',
              order: '',
              node2: '',
              ts: '',
              te: ''
            });
            
            // Добавляем элементы группы
            result.push(...group.items.map(item => ({
              ...item,
              typeContactDisplay: '',
              timeRangeDisplay: '',
              isGroupHeader: false
            })));
          }); 
          return result;
        }
      },
      methods:
        {
          groupKey(row) {
            return row.isGroupHeader 
              ? `${row.typeContact}_${row.valueTimeStart}_${row.valueTimeEnd}`
              : '';
          },
          formatTime(timestamp) {
            if (!timestamp || timestamp === 0) return '-';
            const date = new Date(timestamp * 1000);
            return date.toLocaleTimeString('ru-RU');
          },
          formatTimeRange(start, end) {
            if (start === 0 || end === 0) return 'Не указано';
            return `${this.formatTime(start)} - ${this.formatTime(end)}`;
          },
          exportExcel(){
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
            console.log(headers,fields)
            const data = this.dataT.map(row => {
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
          PrevrapData(){
            console.log(this.dataTable)
            let filterData = this.dataTable.filter(el => [11,12,13,14].includes(el.type));
            filterData.forEach(event => {
              if(event.type == 11){
                this.dataT.push({
                  typeContact: event.cluster, value: event.value, 
                  valueTimeEnd: event.valueTimeEnd, valueTimeStart: event.valueTimeStart, 
                  node1: event.node1Name, node2: event.node2Name, order: event.orderName,
                  ts: event.time, te: null,
                })
              }
              else if(event.type == 13){
                this.dataT.push({
                  typeContact: 'Связь', value: event.value, 
                  valueTimeEnd: event.valueTimeEnd, valueTimeStart: event.valueTimeStart, 
                  node1: event.node1Name, node2: event.node2Name, order: event.orderName,
                  ts: event.time, te: null,
                })
              }
              else if(event.type in {12:null, 14:null}){
                for (let i = this.dataT.length-1; i >= 0; i--) {
                  if(this.dataT[i].node1 == event.node1Name &&
                    this.dataT[i].value == event.value &&
                    this.dataT[i].order == event.orderName){
                      this.dataT[i].te = event.time
                      break
                    } 
                }
              }
            })
            console.log(this.dataT)

          },
      },
      mounted() {
        this.PrevrapData()
      }
    }
  </script>
  
  
  <style lang="scss" scoped>

  </style>