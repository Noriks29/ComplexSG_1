<!--Лог движка-->
<template>
    <Toolbar class="mb-4" :style="'width: 100%;padding: 0px;'">
      <template #end>
        <Button icon="pi pi-file-excel" severity="help" @click="exportExcel" text label="Exel"/>
      </template>
    </Toolbar>
    <DataTable :value="dataT" class="p-datatable-sm" sortMode="multiple" 
        stripedRows removableSort scrollable scrollHeight="70vh"
        ref="dt" :exportFilename="'Лог_движка_' + new Date().toISOString().slice(0, 10)"
        >
            <Column field="time" header="Время"></Column>
            <Column field="type" header="Код"></Column>
            <Column field="name" header="Источник"></Column>
            <Column field="data" header="Данные">
                <template #body="{ data }">
                    <div class="TableJsonTd">
                        <div  v-if="!data.showJson" :style="data.showJson?'white-space: pre-wrap;':''">{{ data.data }}</div>
                        <!--<div  v-if="!data.showJson" :style="data.showJson?'white-space: pre-wrap;':''">{{ data.data }}</div>-->
                        <vue-json-pretty v-else :data="data.dataNormal" :showDoubleQuotes="false"  :highlightSelected="false" />
                        <i :class="'pi pi-chevron-'+(data.showJson?'down':'right')" @click="data.showJson=!data.showJson"></i>
                    </div>

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

    import VueJsonPretty from 'vue-json-pretty';
    import 'vue-json-pretty/lib/styles.css';

    import { UnixToDtime } from '@/js/WorkWithDTime'
    export default {
      name: 'StatisticComponent',
      props: {
        dataTable:{
          type: Array
        },
      },
      components: {
        Column,DataTable,VueJsonPretty,Button,Toolbar
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
        this.PrevrapData()
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