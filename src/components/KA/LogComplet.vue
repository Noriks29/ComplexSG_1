<template>
        <div class="GrafDiv">
          <div id="plotlydiv">
            <!--Карта-->
          </div>
        </div> 
        <div class="DataBody">
          <button @click="selectOrder=undefined" v-show="selectOrder != undefined">Сброс фильтра</button>
          <div class="TableDiv" style="max-height: 40vh; min-height: 40%;">
          <table class="TableDefault">
          <thead>
            <tr><th>Заявка</th><th>Тип</th><th>Событие</th><th>Время</th><th>Описание</th><th>Узел 1</th><th>Узел 2</th></tr>
          </thead>
          <tbody v-for="(data, index) in dataT" :key="index">
            <tr v-for="(dataev, indexev) in data.data" :key="indexev" v-show="selectOrder == undefined || selectOrder == dataev.orderName">
              <td>{{ dataev.orderName }}</td><td>{{ dataev.type }}</td><td>{{ dataev.event }}</td><td>{{ dataev.timeUnix }}</td><td>{{ dataev.text }}</td><td>{{ dataev.node1Name }}</td><td>{{ dataev.node2Name }}</td>
            </tr>
          </tbody>
          </table>
        </div>
        
      </div>
</template>
  
<script>
import Plotly from 'plotly.js-dist'
import { CreateDateTime } from '@/js/WorkWithDTime';


    export default {
      name: 'TableData',
      props: {
        dataTable:{
          type: Array
        },
      },
      data() {
        return {
            dataT: {},
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
          async PrevrapData(){
            this.dataT = {}
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
                  console.log(data)
                  this.selectOrder = data.points[0].y
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