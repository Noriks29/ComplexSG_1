<!--Лог движка-->
<template>
    <DataTable :value="dataT" class="p-datatable-sm" sortMode="multiple" 
        stripedRows removableSort scrollable scrollHeight="70vh"
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
        Column,DataTable,VueJsonPretty
      },
      data() {
        return {
            dataT: []
        }
      },
      methods:
        {
          LoadXLSX(){},
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