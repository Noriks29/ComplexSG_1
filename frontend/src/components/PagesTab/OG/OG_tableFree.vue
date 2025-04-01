<template>
    <div class="DataTable">
        <div class="closebutton"><button @click="CloseTable">
          <img src="@/assets/close.svg"><span>&#8203;</span>
        </button></div>
        <div class="scroll-table">
          <h3>Для сохранения изменений окно необходимо закрыть</h3>
        <table class="TableDefault">
        <thead>

          <tr>
            <th>Модель КА</th>
            <th>Имя КА</th>
            <th v-if="KaRole.length">Роль</th>
            <th v-if="dataJsonOG.inputType === 2">Плосколсть</th>
            <th v-if="dataJsonOG.inputType === 2">Позиция</th>
            <th>Большая полуось</th>
            <th>Эксцентриситет</th>
            <th>Наклон</th>
            <th>Долгота восходящего узла</th>
            <th>Аргумент широты перигея</th>
            <th>Истинная аномалия</th>
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

            <td :class="approved ? 'disable' : ''"><SelectDiv  :dataOption="KaModels" :valueS="{lable: KaLableId[data.modelSat.id], value: data.modelSat}" :id="String(index)" @valueSelect="SelectChangeKA" /></td>
            <td><input :id="index" name="name" type="text"  :class="approved ? 'disable' : ''"
              :value="data.name"></td>
            <td v-if="KaRole.length" :class="approved ? 'disable' : ''"><SelectDiv  :dataOption="KaRole" :valueS="KaRole[data.role]" :id="String(index)" @valueSelect="SelectRole" /></td>
            <td v-if="dataJsonOG.inputType === 2">{{ data.plane }}</td>
            <td v-if="dataJsonOG.inputType === 2">{{ data.position }}</td>
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
            <td v-if="!approved" :id="index" @click="DeleteRow(index)" style="width: 50px; text-align: center;"><img class="iconDelete" src="@/assets/delete.svg" alt="Удалить"></td>
          </tr>
          <tr v-if="!approved" class="addRowButton">
            <td colspan="8"><button @click="AddRow"><img src="@/assets/add.png" alt="" class="addButtonIcon">Добавить КА</button></td>
          </tr> 
        </tbody>
      </table>
    </div>
    </div>     
    </div>
  </template>
  
  <script>
  
  import {FetchGet, FetchPost} from '@/js/LoadDisplayMetod'
  import SelectDiv from '@/components/SelectDiv.vue';
  import { SystemObject } from '@/js/GlobalData';
  
    export default {
      name: 'TableData',
      props: {
        dataOGLocal:{
          type: Object
        },
      },
      components:{
        SelectDiv
      },

      data() {
        return {
          dataJson: [],
          dataJsonOG: {},
          KaModels: [],
          KaLableId: {},
          approved: false,
          KaRole: [{lable:'Нет',value:0},{lable:'Ведомый',value:1},{lable:'Лидер',value:2}]
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
            this.dataJson.push(addedRow);   
          },
          ChangeParam(event){
            this.dataJson[event.target.id][event.target.name] = event.target.value
          },
          SelectRole(data){
            this.dataJson[data.id].role = data.value
          },
          SelectChangeKA(data){
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
            await FetchPost('/api/v1/constellation/update',this.dataJsonOG)
          }
          
      },
      async mounted() {
        this.dataJsonOG = this.dataOGLocal
        this.dataJson = this.dataJsonOG.satellites
        this.approved = SystemObject.constellationStatus
        if(SystemObject.typeWorkplace in {1:null, 2:null}){
          this.KaRole = []
        }
        let result = await FetchGet('/api/v1/modelsat/all')
        this.KaModels = []
        for (let index = 0; index < result.length; index++) {
          this.KaModels.push({value:result[index].id, lable: result[index].modelName})
          this.KaLableId[result[index].id] = result[index].modelName

        }
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