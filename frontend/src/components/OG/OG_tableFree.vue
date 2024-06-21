<template>
    <div class="DataTable">
      <div class="PanelDefault">
        <div class="closebutton"><button @click="CloseTable">
          <img src="../../assets/close.svg"><span>&#8203;</span>
        </button></div>
        <div class="scroll-table">
        <table class="TableDefault">
        <thead>

          <tr>
            <th style="width: 80px;">ID</th>
            <th>Высота</th>
            <th>Эксцентриситет</th>
            <th>Наклон</th>
            <th>Долгота восходящего узла</th>
            <th>Аргумент ширины перигея</th>
            <th>Истинная аномалия</th>
            <th v-if="!approved" class="small"><span>&#8203;</span></th>
          </tr>
        </thead>
      </table>
      <div class="scroll-table-body">
      <table class="TableDefault">
        <tbody>
          <tr
            v-for="(data, index) in dataJson"
            :key="index"
            :class="!approved ? 'active' :''"
            @change="ChangeParam"
            v-show="!(data.deleted==true)"
          >

            <td class="input_imitation" >{{ data.idNode }}</td>
            <td><input :id="index" name="altitude"
              :value="data.altitude"></td>
            <td><input :id="index" name="eccentricity" 
                :value="data.eccentricity"></td>
            <td><input :id="index" name="incline" 
                :value="data.incline"></td>
            <td><input :id="index" name="longitudeAscendingNode" 
                :value="data.longitudeAscendingNode"></td>
            <td><input :id="index" name="perigeeWidthArgument" 
                :value="data.perigeeWidthArgument"></td>
            <td><input :id="index" name="trueAnomaly"
                :value="data.trueAnomaly"></td>
            <td v-if="!approved" :id="index" @click="DeleteRow(index)"  class="small" style="text-align: center;"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
          <tr v-if="!approved" class="addRowButton">
            <td colspan="8"><button @click="AddRow">Добавить КА</button></td>
          </tr> 
        </tbody>
      </table>
    </div>
    </div>
      </div>
        
    </div>
  </template>
  
  <script>
  
  import {FetchPost} from '../../js/LoadDisplayMetod.js'
  
    export default {
      name: 'TableData',
      props: {
        dataOGLocal:{
          type: Object
        },
        approved:{
          type: Boolean
        },

      },

      data() {
        return {
          dataJson: [],
          dataJsonOG: {},
          TableDisplay: false,
          datasave: true
        }
      },
      methods:
        {
          async CloseTable(){
            await this.SatartSave()
            this.$emit('closetable', true)
          },
          AddRow(){
            var addedRow = {
                    'altitude' : 0, 'eccentricity' : 0,
                    'incline' : 0, 'longitudeAscendingNode' : 0,
                    'perigeeWidthArgument' : 0, 'trueAnomaly' : 0,
                    'phaseShift': null, plane:null, position:null,
                    'deleted': false, 'satelliteId': undefined
                };
            this.dataJson.push(addedRow);   

          },
          ChangeParam(event){
            switch(event.target.name){
              case "altitude":{
                this.dataJson[event.target.id].altitude = Number(event.target.value)
                break;
              }
              case "eccentricity":{
                this.dataJson[event.target.id].eccentricity = Number(event.target.value)
                break;
              }
              case "incline":{
                this.dataJson[event.target.id].incline = Number(event.target.value)
                break;
              }
              case "longitudeAscendingNode":{
                this.dataJson[event.target.id].longitudeAscendingNode = Number(event.target.value)
                break;
              }
              case "perigeeWidthArgument":{
                this.dataJson[event.target.id].perigeeWidthArgument = Number(event.target.value)
                break;
              }
              case "trueAnomaly":{
                this.dataJson[event.target.id].trueAnomaly = Number(event.target.value)
                break;
              }
              default:
                alert( "Ошибка!" );
            }
            
          },
          DeleteRow(index){
              if (this.dataJson[index].satelliteId === undefined) {
                this.dataJson.splice(index,1)
              }
              else{
                this.dataJson[index].deleted = true
              }
          },
          async SatartSave() {
            console.log(this.dataJsonOG)
            let responce = await FetchPost('/api/v1/constellation/update',this.dataJsonOG)
            console.log(responce)
            
          }
          
      },
      mounted() {
        this.dataJsonOG = this.dataOGLocal
        console.log(this.dataJsonOG)
        this.dataJson = this.dataJsonOG.satellites
      }
    }
  </script>
  
  
  <style lang="scss" scoped>

  .input_imitation{
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
    width: 80px;
  }
  td{
    vertical-align: middle;
  }
  input{
    width: 100%;
    height: 100%;
  }
  .closebutton{
    display: flex;
    margin: 20px;
    flex-direction: row-reverse;
    button{
      background: none;
      border: none;
      img{
        width: 25px;
      }
    }
  }
  .DataTable{
    backdrop-filter: blur(10px);
    position: fixed;
    top: 1%;
    left: 0;
    width: 100%;
    z-index: 4;
    max-width: 100%;
    .TableDefault{
      filter: drop-shadow(2px 4px 6px black);
  
    }
    .PanelTable{
      position: sticky;
      bottom: 20px;
      margin: 0px 5%;
      width: 90%;
    }
  }
  .PanelDefault{
    width: 95%;
    padding: 5px;
  
  }
  .scroll-table-body {
    height: 75vh;
  }

  .iconDelete{
    width: 60% !important; 
    height: 100% !important;
  }
  th{
    text-align: center !important;
  }
  </style>