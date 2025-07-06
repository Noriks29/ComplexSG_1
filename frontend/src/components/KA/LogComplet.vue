<template>
    <div class="DataTable">
        <div class="closebutton"><button @click="CloseTable">
            <img src="../../assets/close.svg"><span>&#8203;</span>
          </button>
        </div>
        <div class="DataBody">
            <div class="TableDiv">
          <table class="TableDefault">
          <thead>
            <tr><th>Заявка</th><th>Тип</th><th>Время</th><th>Описание</th><th>Узел 1</th><th>Узел 2</th></tr>
          </thead>
          <tbody v-for="(data, index) in dataT" :key="index">
            <tr v-for="(dataev, indexev) in data.data" :key="indexev">
              <td>{{ dataev.orderName }}</td><td>{{ dataev.type }}</td><td>{{ dataev.timeUnix }}</td><td>{{ dataev.text }}</td><td>{{ dataev.node1Name }}</td><td>{{ dataev.node2Name }}</td>
            </tr>
          </tbody>
          </table>
        </div>
        <div class="GrafDiv">
          <div id="plotlydiv">
            <!--Карта-->
          </div>
        </div>
        
      </div>
      </div>
</template>
  
<script>
import { SystemObject} from '@/js/GlobalData'
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
          PrevrapData(){
            console.log(this.dataTable, SystemObject)
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
              let dataPlotly = []
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
                
                for(var key in this.dataT){
                    const element = this.dataT[key].data
                    for (let i = 0; i < element.length; i++) {
                        let flag = false
                        const eventMain = element[i];
                        
                        if(eventMain.type in {1:null, 6:null}){
                            for (let j = i+1; j < element.length; j++) {
                                const eventChild = element[j];
                                console.log(CreateDateTime(eventChild.time-eventMain.time, 2), CreateDateTime(eventMain.time, 2))
                                if(eventChild.type in {1:null, 6:null, 9:null}){
                                  console.log("fssefesfesfefes",eventChild.time-eventMain.time, eventMain, eventChild.time, CreateDateTime(eventMain.time, 2) )
                                    if(eventChild.type != 9) console.error("Повторение появление", eventChild)
                                    dataGrapf[0].y.push(eventMain.orderName)
                                    dataGrapf[0].x.push(CreateDateTime(eventChild.time-eventMain.time, 2))
                                    dataGrapf[0].base.push(CreateDateTime(eventMain.time, 1))
                                    flag = true
                                    break
                                }
                            }
                        }
                        else if(eventMain.type == 9){
                            for (let j = i+1; j < element.length; j++) {
                                const eventChild = element[j];
                                console.log(CreateDateTime(eventChild.time-eventMain.time, 2), CreateDateTime(eventMain.time, 1))
                                if(eventChild.type in {10:null, 9:null}){
                                    if(eventChild.type == 9) console.error("Повторение съёмки цели", eventChild)
                                    dataGrapf[2].y.push(eventMain.orderName)
                                    dataGrapf[2].x.push(CreateDateTime(eventChild.time-eventMain.time, 2))
                                    dataGrapf[2].base.push(CreateDateTime(eventMain.time, 1))
                                    flag = true
                                    break
                                }
                            }
                        }
                        else if(eventMain.type == 10){
                            for (let j = i+1; j < element.length; j++) {
                                const eventChild = element[j];
                                console.log(CreateDateTime(eventChild.time-eventMain.time, 2), CreateDateTime(eventMain.time, 1))
                                if(eventChild.type in {10:null, 12:null}){
                                    if(eventChild.type == 10) console.error("Повторное хранение", eventChild)
                                    dataGrapf[3].y.push(eventMain.orderName)
                                    dataGrapf[3].x.push(CreateDateTime(eventChild.time-eventMain.time, 2))
                                    dataGrapf[3].base.push(CreateDateTime(eventMain.time, 1))
                                    flag = true
                                    break
                                }
                            }
                        }
                        else if(eventMain.type == 5){
                            for (let j = i+1; j < element.length; j++) {
                                const eventChild = element[j];
                                console.log(CreateDateTime(eventChild.time-eventMain.time, 2), CreateDateTime(eventMain.time, 1))
                                if(eventChild.type in {9:null, 4:null, 5:null}){
                                    if(eventChild.type == 5) console.error("Повторное планирование", eventChild)
                                    dataGrapf[1].y.push(eventMain.orderName)
                                    dataGrapf[1].x.push(CreateDateTime(eventChild.time-eventMain.time, 2))
                                    dataGrapf[1].base.push(CreateDateTime(eventMain.time, 1))
                                    flag = true
                                    break
                                }
                            }
                        }
                        else if(eventMain.type == 13){
                            for (let j = i+1; j < element.length; j++) {
                                const eventChild = element[j];
                                console.log(CreateDateTime(eventChild.time-eventMain.time, 2), CreateDateTime(eventMain.time, 1))
                                if(eventChild.type in {13:null, 14:null}){
                                    if(eventChild.type == 13) console.error("Повторный старт передачи в КА", eventChild)
                                    dataGrapf[4].y.push(eventMain.orderName)
                                    dataGrapf[4].x.push(CreateDateTime(eventChild.time-eventMain.time, 2))
                                    dataGrapf[4].base.push(CreateDateTime(eventMain.time, 1))
                                    flag = true
                                    break
                                }
                            }
                        }
                        else if(eventMain.type == 11){
                            for (let j = i+1; j < element.length; j++) {
                                const eventChild = element[j];
                                console.log(CreateDateTime(eventChild.time-eventMain.time, 2), CreateDateTime(eventMain.time, 1))
                                if(eventChild.type in {11:null, 12:null}){
                                    if(eventChild.type == 11) console.error("Повторный старт передачи в НП", eventChild)
                                    dataGrapf[5].y.push(eventMain.orderName)
                                    dataGrapf[5].x.push(CreateDateTime(eventChild.time-eventMain.time, 2))
                                    dataGrapf[5].base.push(CreateDateTime(eventMain.time, 1))
                                    flag = true
                                    break
                                }
                            }
                        }
                        else{flag = true}
                        if(!flag){
                          /*
                            let graf = 0
                            if(eventMain.type == 9){graf = 2}
                            else if(eventMain.type == 10){graf = 3}
                            else if(eventMain.type == 5){graf = 1}
                            else if(eventMain.type == 13){graf = 4}
                            else if(eventMain.type == 11){graf = 5}
                            console.error("Событие без завершения", eventMain, graf)
                            dataGrapf[graf].y.push(eventMain.orderName)
                            dataGrapf[graf].x.push(CreateDateTime(SystemObject.modelingEnd-eventMain.time, 1))
                            dataGrapf[graf].base.push(CreateDateTime(eventMain.time, 2))*/
                        }
                    }

                }

                dataPlotly = dataGrapf
                Plotly.newPlot("plotlydiv", dataPlotly,  {barmode: 'stack', bargap: 0.1, 
                    showlegend: true, margin:{b:40,r:100, t:30,l:150}, height:500,autosize: true, yaxis:{tickson: "boundaries",ticklen: 20,showdividers: true,dividercolor: 'grey',dividerwidth: 4}},
                    {displayModeBar: true}
                )
                document.getElementById("plotlydiv").on('plotly_click', (data)=>{
                  console.log(data)
                  if(data.points[0].data.name == "Сеанс связи с НП"){
                    var pn='',
                    tn='',
                    colors=[];
                    for(var i=0; i < data.points.length; i++){
                      pn = data.points[i].pointNumber;
                      tn = data.points[i].curveNumber;
                      colors = data.points[i].data.marker.color;
                    }
                    for (let col = 0; col < colors.length; col++) {
                      colors[col] = 'gray'
                    }
                    colors[pn] = '#C54C82';

                    var update = {'marker':{color: colors, size:16}};
                    Plotly.restyle('plotlydiv', update, [tn]);
                  }
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