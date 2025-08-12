<!--Лог движка-->
<template>
    <Toolbar class="mb-4" :style="'width: 100%;padding: 0px;'">
      <template #end>
        <Button icon="pi pi-file-excel" severity="help" @click="exportExcel" text label="Exel"/>
      </template>
    </Toolbar>
    <DataTable :value="dataTable" class="p-datatable-sm" sortMode="multiple" 
        stripedRows removableSort scrollable scrollHeight="70vh" tableStyle="min-width: 50rem"
        ref="dt" :exportFilename="'Лог_Событий_' + new Date().toISOString().slice(0, 10)"
        >
            <Column field="timeUnix" header="Время"></Column>
            <Column field="type" header="Код"></Column>
            <Column field="event" header="Событие"></Column>
            <Column field="orderName" header="Заявка"></Column>
            <Column field="node1Name" header="Узел 1"></Column>
            <Column field="node2Name" header="Узел 2"></Column>
            <Column field="text" header="Коментарий"></Column>
            <Column field="value" header="Значение"></Column>
    </DataTable>
</template>
  
  <script>
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import Button from 'primevue/button';
    import Toolbar from 'primevue/toolbar';
    import XLSX from 'xlsx-js-style';

    import { UnixToDtime } from '@/js/WorkWithDTime'
    export default {
      name: 'StatisticComponent',
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
            dataT: []
        }
      },
      methods:
        {
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
            const data = this.dataT.map(row => {
              const newRow = {};
              fields.forEach(field => {
                if(field == 'data') newRow[field] = JSON.stringify(row[field]) 
                else newRow[field] = String(row[field]);
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
          UnixToDtimeL(time){
            return UnixToDtime(time, true, false).time
          },
          PrevrapData(){
            this.dataTable.forEach(element =>{
                const e = Object.assign({}, element)
                let deleteName = ['time','type','idReceiver','receiverName','idSender','senderName']
                for (let i = 0; i < deleteName.length; i++) {
                    delete e[deleteName[i]]
                }
                this.dataT.push({
                    time: element.time,
                    type: element.type,
                    data: e,
                    dataNormal: element,
                    name: element.senderName || element.receiverName || '',
                    showJson: false
                })
            })
          },
      },
      mounted() {
        //this.PrevrapData()
      }
    }
  </script>
  
  
  <style lang="scss" scoped>
.TableJsonTd{
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
}
:deep(.vjs-tree-node.is-highlight),
:deep(.vjs-tree-node:hover) {
  background-color: transparent !important;
}
  </style>