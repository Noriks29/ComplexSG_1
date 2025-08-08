<template>
        <div class="GrafDiv">
          <div id="plotlydiv">
            <!--Карта-->
          </div>
        </div> 
        <div class="DataBody">
          <button @click="FilterData(undefined)" v-show="selectOrder != undefined">Сброс фильтра</button>
          <DataTable :value="dataNew" class="p-datatable-sm" sortMode="multiple" stripedRows removableSort scrollable scrollHeight="60vh"
          >
            <Column field="orderName" header="Заявка"></Column>
            <Column field="type" header="Тип"></Column>
            <Column field="event" header="Событие"></Column>
            <Column field="timeUnix" header="Время"></Column>
            <Column field="text" header="Описание"></Column>
            <Column field="node1Name" header="Узел 1"></Column>
            <Column field="node2Name" header="Узел 2"></Column>
          </DataTable>
      </div>
</template>
  
<script>
import Plotly from 'plotly.js-dist'
import { CreateDateTime } from '@/js/WorkWithDTime';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

    export default {
      name: 'TableData',
      props: {
        dataTable:{
          type: Array
        },
      },
      components: {
        Column, DataTable
      }, 
      data() {
        return {
            dataT: {},
            dataNew: [],
            selectOrder: undefined
        }
      },
      methods:
        {
          CloseTable(){
            this.$emit('closetable', true)
          },
          SelectRev(){

          },
          LoadXLSX(){
            
          },
          FilterData(target){
            this.dataNew = this.dataTable.filter(item => item.orderName !== null);
            this.dataNew.sort((a,b) => a.orderName.localeCompare(b.orderName))
            this.selectOrder=target
            if(target != undefined){
              this.dataNew = this.dataNew.filter(item => item.orderName == this.selectOrder);
            }
            
          },
          async PrevrapData(){
            this.dataT = {}
            this.dataNew = this.dataTable.filter(item => item.orderName !== null);
            this.dataNew.sort((a,b) => a.orderName.localeCompare(b.orderName))
            
            console.log(this.dataNew)
            this.dataTable.forEach(event => {
              if(event.orderId != 0 && event.orderName != null){
                if(this.dataT[event.orderId] != undefined){
                    this.dataT[event.orderId].data.push(event)
                }
                else{
                    this.dataT[event.orderId]={data: [event], status: 0}
                }
              }
            })
            
            this.CreatePlot()
          },
          CreatePlot(){
              Plotly.newPlot("plotlydiv", [])
              let data = [0]
              if(data.length > 0 ){
                let dataGrapf = [
                    {type: 'bar',name: "Съемка не запланирована",y: [],x: [],orientation: 'h', base: [], showlegend: true,marker: {opacity: 0.5, color: '#DDDDDD',line:{color: 'black'}}},
                    {type: 'bar',name: "Съемка запланирована",y: [],x: [],orientation: 'h', base: [], showlegend: true,marker: {opacity: 0.5, color: 'yellow'}},
                    {type: 'bar',name: "Съемка цели",y: [],x: [],orientation: 'h', base: [], showlegend: true,marker: {opacity: 0.8, color: 'red'}},
                    {type: 'bar',name: "Данные в памяти",y: [],x: [],orientation: 'h', base: [], showlegend: true,marker: {opacity: 0.5, color: 'green'}},
                    {type: 'bar',name: "Передача в КА",y: [],x: [],orientation: 'h', base: [], showlegend: true,marker: {opacity: 1, color: 'blue'}},
                    {type: 'bar',name: "Передача в НП",y: [],x: [],orientation: 'h', base: [], showlegend: true,marker: {opacity: 1, color: 'gray'}},
                ]
                let eventOrderList = new Set();
                for(var key in this.dataT){
                    const element = this.dataT[key].data
                    for (let i = 0; i < element.length; i++) {
                        const eventMain = element[i];
                        let grafidArr = undefined
                        let timeEventMain = eventMain.time
                        for (let j = i+1; j < element.length; j++) {
                          const eventChild = element[j];
                          if(eventMain.type in {1:null, 6:null} && eventChild.type in {1:null, 6:null, 9:null}){
                            grafidArr = 0
                          }
                          else if(eventMain.type == 9 && eventChild.type in {10:null, 9:null}){
                            if(eventChild.type == 9) console.error("Повторение съёмки цели", eventChild)
                            grafidArr = 2
                          }
                          else if(eventMain.type == 10 && eventChild.type in {10:null, 12:null}){
                            if(eventChild.type == 10) console.error("Повторное хранение", eventChild)
                            grafidArr = 3
                          }
                          else if(eventMain.type == 5 && eventChild.type in {9:null, 4:null, 5:null}){
                            if(eventChild.type == 5) console.error("Повторное планирование", eventChild)
                            grafidArr = 1
                          }
                          else if(eventMain.type == 13 && eventChild.type in {13:null, 14:null}){
                            if(eventChild.type == 13) {break;}
                            grafidArr = 4
                          }
                          else if(eventMain.type == 11 && eventChild.type in {11:null, 12:null}){
                            if(eventChild.type == 11) {break}
                            grafidArr = 5
                          }
                          if(grafidArr != undefined){
                            dataGrapf[grafidArr].y.push(eventMain.orderName)
                            eventOrderList.add(eventMain.orderName)
                            if(grafidArr == 0) dataGrapf[grafidArr].x.push(CreateDateTime(1, 2))
                            else dataGrapf[grafidArr].x.push(CreateDateTime(eventChild.time-timeEventMain, 2))
                            dataGrapf[grafidArr].base.push(CreateDateTime(timeEventMain, 1))
                            timeEventMain = eventChild.time
                            grafidArr = undefined
                          }
                        }
                        
                    }

                }
                let grafHeight = 30+40+eventOrderList.size*50
                if(grafHeight < 150) grafHeight = 150
                Plotly.newPlot("plotlydiv", dataGrapf,  {barmode: 'stack', bargap: 0.1, 
                    showlegend: true, margin:{b:40,r:100, t:30,l:150}, height:grafHeight,autosize: true, yaxis:{tickson: "boundaries",ticklen: 20,showdividers: true,dividercolor: 'grey',dividerwidth: 4}},
                    {displayModeBar: true}
                )
                document.getElementById("plotlydiv").on('plotly_click', (data)=>{
                  this.FilterData(data.points[0].y)
                })
              }
          }
      },
      mounted() {
        this.PrevrapData()
      }
    }
  </script>
  
  
  <style lang="scss" scoped>

  </style>