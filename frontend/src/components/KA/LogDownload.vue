<template>
    <div class="DataTable">
        <div class="closebutton"><button @click="CloseTable">
            <img src="../../assets/close.svg"><span>&#8203;</span>
          </button>
        </div>
        Добавить графические блоки на данные в памяти, сеансы связи, сделать межспутниковую связь указателем на ка + блоками у обоих ка. Сделать выбор блока ка https://plotly.com/javascript/plotlyjs-events/ здесь много про это. Двух уровневые блоки от сюда https://plotly.com/javascript/axes/

        <div class="DataBody">
            {{ dataTable }}
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
import { OGList, SystemObject} from '@/js/GlobalData'
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
            console.log(this.dataTable, OGList, SystemObject)

            this.CreatePlot()
          },
          CreatePlot(){
              let dataPlotly = []
              Plotly.newPlot("plotlydiv", [])
              Plotly.newPlot("plotlydivCharge", [], {title: 'не готов', showlegend: false, margin:{b:30,r:10, t:30,l:30}, height:150})
              let data = [0]
              
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
                
                OGList.forEach(OG => {
                    OG.satellites.forEach(sat => {
                        dataGrapf.y[0].push(OG.constellationName)
                        dataGrapf.y[1].push(sat.name)
                        dataGrapf.base.push(CreateDateTime(SystemObject.modelingBegin,1))
                        dataGrapf.x.push(CreateDateTime(0, 2))
                        satlist[sat.satelliteId] = {og: OG.constellationName, sat: sat.name}
                    })
                })
                for(var key in satlist){
                  console.log(key)
                  dataGrapf3.marker.color.push("gray")
                  dataGrapf1.y[0].push(satlist[key].og) // тестовые данные 
                  dataGrapf1.y[1].push(satlist[key].sat)
                  dataGrapf1.base.push(CreateDateTime(SystemObject.modelingBegin+(Number(key)*dataGrapf1.base.length),1))
                  dataGrapf1.x.push(CreateDateTime(key, 2))
                  dataGrapf2.y[0].push(satlist[key].og)
                  dataGrapf2.y[1].push(satlist[key].sat)
                  dataGrapf2.base.push(CreateDateTime(SystemObject.modelingBegin+(Number(key)*dataGrapf1.base.length)+Number(key),1))
                  dataGrapf2.x.push(CreateDateTime(key, 2))
                  dataGrapf3.y[0].push(satlist[key].og)
                  dataGrapf3.y[1].push(satlist[key].sat)
                  dataGrapf3.base.push(CreateDateTime(SystemObject.modelingEnd-(Number(key)*dataGrapf1.base.length),1))
                  dataGrapf3.x.push(CreateDateTime(Number(key)*dataGrapf1.base.length, 2))
                }
                console.log(dataGrapf1)

                dataPlotly = [dataGrapf,dataGrapf1,dataGrapf2,dataGrapf3]
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