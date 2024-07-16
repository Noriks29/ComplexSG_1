<template>
    <div class="DataTable">
        <div class="closebutton"><button @click="CloseTable">
          <img src="../../assets/close.svg"><span>&#8203;</span>
        </button></div>
        <div class="scroll-table">
        <table class="TableDefault">
        <thead>

          <tr>
            <th style="width: 50px;">ID</th>
            <th>Модель КА</th>
            <th v-if="dataJsonOG.arbitraryFormation === false">Плосколсть</th>
            <th v-if="dataJsonOG.arbitraryFormation === false">Позиция</th>
            <th>Высота</th>
            <th>Эксцентриситет</th>
            <th>Наклон</th>
            <th>Долгота восходящего узла</th>
            <th>Аргумент ширины перигея</th>
            <th v-if="dataJsonOG.arbitraryFormation === false">Фазовый сдвиг</th>
            <th v-else>Истинная аномалия</th>
            <th v-if="!approved" style="width: 50px;" ><span>&#8203;</span></th>
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

            <td style="width: 50px; text-align: center;">{{ data.idNode }}</td>
            <td :class="approved ? 'disable' : ''"><SelectDiv  :dataOption="KaModels" :valueS="KaModels[data.modelSat.id-1]" :id="index" @valueSelect="SelectChangeKA" /></td>
            <td v-if="dataJsonOG.arbitraryFormation === false">{{ data.plane }}</td>
            <td v-if="dataJsonOG.arbitraryFormation === false">{{ data.position }}</td>
            <td><input :id="index" name="altitude" type="number"  :class="approved ? 'disable' : ''"
              :value="data.altitude"></td>
            <td><input :id="index" name="eccentricity" type="number" :class="approved ? 'disable' : ''"
                :value="data.eccentricity"></td>
            <td><input :id="index" name="incline" 
                :value="data.incline"></td>
            <td><input :id="index" name="longitudeAscendingNode" type="number" :class="approved ? 'disable' : ''"
                :value="data.longitudeAscendingNode"></td>
            <td><input :id="index" name="perigeeWidthArgument" type="number" :class="approved ? 'disable' : ''"
                :value="data.perigeeWidthArgument"></td>
            <td><input :id="index" name="trueAnomaly" type="number" :class="approved ? 'disable' : ''"
                :value="data.trueAnomaly"></td>
            <td v-if="!approved" :id="index" @click="DeleteRow(index)" style="width: 50px; text-align: center;"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
          <tr v-if="!approved" class="addRowButton">
            <td colspan="8"><button @click="AddRow">Добавить КА</button></td>
          </tr> 
        </tbody>
      </table>
    </div>
    </div>     
    </div>
  </template>
  
  <script>
  
  import {FetchGet, FetchPost} from '../../js/LoadDisplayMetod.js'
  import SelectDiv from '../SelectDiv.vue';
  
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
      components:{
        SelectDiv
      },

      data() {
        return {
          dataJson: [],
          dataJsonOG: {},
          TableDisplay: false,
          datasave: true,
          KaModels: []
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
                    'deleted': false, 'satelliteId': undefined,
                    "modelSat": {"id": this.KaModels[0].value}
                };
            console.log(addedRow, this.KaModels)
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
          SelectChangeKA(data){
            console.log(data)
            this.dataJson[data.id].modelSat.id = data.value

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
      async mounted() {
        this.dataJsonOG = this.dataOGLocal
        console.log(this.dataJsonOG)
        this.dataJson = this.dataJsonOG.satellites
        let result = await FetchGet('/api/v1/modelsat/all')
        this.KaModels = []
        for (let index = 0; index < result.length; index++) {
          this.KaModels.push({value: result[index].id, lable:  result[index].modelName});
        }
        console.log(this.KaModels)

      }
    }
  </script>
  
  
  <style lang="scss" scoped>

  td{
    vertical-align: middle;
    padding: 0px 15px !important;
  }
  input{
    width: 100%;
    height: 32px;
    font-size: 14px;
    padding: 0px;
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
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0%;
    left: 0;
    width: 98%;
    z-index: 4;
    max-width: 98%;
    height: 100vh;
    padding: 1%;
    font-size: 14px !important;
    .TableDefault{
      filter: drop-shadow(2px 4px 6px black);
      border-spacing: 0px;
      background: #0e0e0e;
      background: linear-gradient(140deg, #282828 0%, #1c1c1c 15%, #0a0a0a 100%);
      padding-bottom: 10px;
    }
    .PanelTable{
      position: sticky;
      bottom: 20px;
      margin: 0px 5%;
      width: 90%;
    }
  }
  .scroll-table-body {
    height: 75vh;
  }

  .iconDelete{
    width: 30px; 
  }
  th{
    text-align: center !important;
  }
  .addRowButton button{
                    background: none;
                    border: none;
                    width: 100%;
                    height: 100%;
                    padding: 10px 0px;
                    font-size: 14px;
                    color: white;
                    margin: 10px 0px;
                  }
  .disable{
    pointer-events: none;
  }
  </style>