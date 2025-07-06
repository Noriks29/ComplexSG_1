<template>
    <div class="DataTable">
        <div class="closebutton"><button @click="CloseTable">
            <img src="../../assets/close.svg"><span>&#8203;</span>
          </button>
        </div>
        <div class="DataBody">
        <div class="GrafDiv">
          <div id="plotlydiv">
            <!--Карта-->
          </div>
          <div id="plotlydivCharge">
            <!--Карта-->
          </div>
        </div>
        
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
            dataT: [],
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
            console.log(this.dataTable)

            this.CreatePlot()
          },
          async CreatePlot(){
              let dataPlotly = []
              Plotly.newPlot("plotlydiv", [])
              Plotly.newPlot("plotlydivCharge", [], {title: 'не готов', showlegend: false, margin:{b:30,r:10, t:30,l:30}, height:150})
              let data = [0]
              let SystemObject = this.$SystemObject()
              
              if(data.length > 0 ){
                let dataGrapf = {type: 'bar',name: "Пустой",y: [[],[]],x: [],orientation: 'h', base: [], showlegend: false,hoverinfo: 'none',
                  marker: {opacity: 0.0}
                }
                let dataGrapf1 = {type: 'bar',name: "Данные в памяти МКА",y: [[],[]],x: [],orientation: 'h', base: [], showlegend: true,
                  marker: {opacity: 0.6, color: 'blue'}
                }
                let dataGrapf2 = {type: 'bar',name: "Межспутниковая связь",y: [[],[]],x: [],orientation: 'h', base: [], showlegend: true,
                  marker: {opacity: 0.6, color: 'green'}
                }
                let dataGrapf3 = {type: 'bar',name: "Сеанс связи с НП",y: [[],[]],x: [],orientation: 'h', base: [], showlegend: true,
                  marker: {opacity: 0.8, color: []}
                }
                let satlist = {}
                let OGList = await this.$OGList()
                OGList.forEach(OG => {
                    OG.satellites.forEach(sat => {
                        dataGrapf.y[0].push(OG.constellationName)
                        dataGrapf.y[1].push(sat.name)
                        dataGrapf.base.push(CreateDateTime(SystemObject.modelingBegin,1))
                        dataGrapf.x.push(CreateDateTime(1, 2))
                        satlist[sat.satelliteId] = {og: OG.constellationName, sat: sat.name}
                    })
                })
                for(var key in satlist){
                  let timeData = null
                  let timeToNP = null
                  let timeSCSC = null
                  this.dataTable.forEach(element => {
                    if(element.node1Id == key){
                      if(element.type in {10:null, 41:null, 42:null}){
                        if(timeData != null){
                          dataGrapf1.y[0].push(satlist[key].og)
                          dataGrapf1.y[1].push(satlist[key].sat)
                          dataGrapf1.base.push(CreateDateTime(timeData,1))
                          dataGrapf1.x.push(CreateDateTime(element.time-timeData, 2))
                        }
                        if(element.type == 42){
                          timeData = null
                        }
                        else timeData = element.time
                      }
                      else if(element.type in {43:null, 44:null}){
                        if(timeToNP != null){
                          dataGrapf3.y[0].push(satlist[key].og)
                          dataGrapf3.y[1].push(satlist[key].sat)
                          dataGrapf3.base.push(CreateDateTime(timeToNP,1))
                          dataGrapf3.x.push(CreateDateTime(element.time-timeToNP, 2))
                          dataGrapf3.marker.color.push("gray")
                        }
                        if(element.type == 44){
                          timeToNP = null
                        }
                        else timeToNP = element.time
                      }
                      else if(element.type in {45:null, 46:null}){
                        if(timeSCSC != null){
                          dataGrapf2.y[0].push("Связь")
                          dataGrapf2.y[1].push(satlist[key].sat)
                          dataGrapf2.base.push(CreateDateTime(timeSCSC,1))
                          dataGrapf2.x.push(CreateDateTime(element.time-timeSCSC, 2))
                        }
                        if(element.type == 46){
                          timeSCSC = null
                        }
                        else timeSCSC = element.time
                      }
                    }
                  })
                }
                console.log(dataGrapf1)

                dataPlotly = [dataGrapf,dataGrapf1,dataGrapf3,dataGrapf2]
                Plotly.newPlot("plotlydiv", dataPlotly,  {barmode: 'stack', bargap: 0.1, 
                    showlegend: true, margin:{b:40,r:100, t:30,l:150}, height:50+dataGrapf.y[0].length*50,autosize: true, yaxis:{tickson: "boundaries",ticklen: 20,showdividers: true,dividercolor: 'grey',dividerwidth: 4}},
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