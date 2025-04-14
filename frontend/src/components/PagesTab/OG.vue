<template>
    <div class="main_contain RowSection">
      <CreateOGPanel v-if="PageSettings.status == 2" @closetable="closeTable('CreateOG')"/>
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="@/assets/exit.svg"><span>&#8203;</span>
            </button>
            <h1 class="TitleText">Орбитальные группировки и космические аппараты</h1>
          </div>

    <div class="ContentDiv">
    <div class="Panel LeftPanel">
      <div>Список ОГ</div>
        <div v-for="data, index in dataJson"
          :key="index"
          v-show="!(data.deleted==true)"
          class="ElementCol"
        >
          <div  @click="SelectOGFromList(data)" type="name">{{ data.constellationName }}</div>
          <div  @click="SelectOGFromList(data)" type="type">{{ OGType[data.inputType] }}</div>
          <div class="iconDelete" @click="DeleteRowOG(data)" type="icon"><img  src="@/assets/delete.svg" alt="Удалить"></div>
        </div>
        <div>
          <button class="ButtonCommand" :class="!approved? '' : 'disable'"  @click="PageSettings.status=2"><img src="@/assets/add.png" alt="" class="addButtonIcon">Добавить орбитальную группировку</button>
        </div>
        
        <div class="ButtonApprovedDiv"><button @click="ChangeApproved(!approved)" class="ButtonCommand" :class="approved? 'green' : 'red'">
          <span v-if="approved"><img src="../../assets/edit.svg"></span>
          <span v-else><img src="../../assets/approve.svg"></span>
          <span>{{ approved ?  'Редактировать' : 'Утвердить'}}</span>
        </button></div>
    </div>


    <div class="Panel RightPanel">
          
          <div v-if="PageSettings.status == 0 && selectOG != null">
            <h3>{{ selectOG.constellationName }}</h3>
            {{ selectOG.inputType }} {{ abilityEdit }}
            <div>
              <button class="ButtonCommand" :class="OGEdit? '' : 'disable'"  @click="SaveOGChange">Сохранить изменения</button>
            </div>
            <table class="TableDefault">
              <tr><th>Модель КА</th><th>Имя КА</th>
                <th v-if="KaRole.length">Роль</th>
                <th v-if="selectOG.inputType === 2">Плосколсть</th>
                <th v-if="selectOG.inputType === 2">Позиция</th><th>Большая полуось</th>
                <th>Эксцентриситет</th><th>Наклон</th><th>Долгота восходящего узла</th><th>Аргумент широты перигея</th>
                <th>Истинная аномалия</th>
                <th v-if="abilityEdit" style="width: 50px;" ><span>&#8203;</span></th>
              </tr>
              <tbody>
                <tr
                  v-for="(data, index) in selectOG.satellites"
                  :key="index"
                  :class="abilityEdit ? 'active' :''"
                  @change="ChangeParam"
                  v-show="!(data.deleted==true)"
                >

                  <td :class="!abilityEdit ? 'disable' : ''"><SelectDiv  :dataOption="KaModels" :valueS="{lable: KaLableId[data.modelSat.id], value: data.modelSat}" :id="String(index)" @valueSelect="SelectChangeKA" /></td>
                  <td><input :id="index" name="name" type="text"  :class="!abilityEdit ? 'disable' : ''"
                    :value="data.name"></td>
                  <td v-if="KaRole.length" :class="!abilityEdit ? 'disable' : ''"><SelectDiv  :dataOption="KaRole" :valueS="KaRole[data.role]" :id="String(index)" @valueSelect="SelectRole" /></td>
                  <td v-if="selectOG.inputType === 2">{{ data.plane }}</td>
                  <td v-if="selectOG.inputType === 2">{{ data.position }}</td>
                  <td><input :id="index" name="altitude" type="number"  :class="!abilityEdit ? 'disable' : ''"
                    :value="data.altitude"></td>
                  <td><input :id="index" name="eccentricity" type="number" :class="!abilityEdit ? 'disable' : ''"
                      :value="data.eccentricity"></td>
                  <td><input :id="index" name="incline" 
                      :value="data.incline"></td>
                  <td><input :id="index" name="longitudeAscendingNode" type="number" :class="!abilityEdit ? 'disable' : ''"
                      :value="data.longitudeAscendingNode"></td>
                  <td><input :id="index" name="perigeeWidthArgument" type="number" :class="!abilityEdit ? 'disable' : ''"
                      :value="data.perigeeWidthArgument"></td>
                  <td><input :id="index" name="trueAnomaly" type="number" :class="!abilityEdit ? 'disable' : ''"
                      :value="data.trueAnomaly"></td>
                  <td v-if="abilityEdit" :id="index" @click="DeleteRow(index)" style="width: 50px; text-align: center;"><img class="iconDelete" src="@/assets/delete.svg" alt="Удалить"></td>
                </tr>
                <tr v-if="abilityEdit" class="addRowButton">
                  <td colspan="8"><button @click="AddRow"><img src="@/assets/add.png" alt="" class="addButtonIcon">Добавить КА</button></td>
                </tr> 
              </tbody>
            </table>
          </div>


    </div>
</div>
</div>
</template>
  
  <script>
import {DisplayLoad, FetchGet, FetchPost} from '@/js/LoadDisplayMetod'
import CreateOGPanel from './OG/CreateOGPanel.vue'
import { PagesSettings } from './PagesSettings.js';
import { OGList, ChangeOG, SystemObject, ChangeSystemObject} from '@/js/GlobalData';
import SelectDiv from '../SelectDiv.vue';


  export default {
    name: 'OG',
    mixins: [PagesSettings],
    data() {
      return {
        OGType: {1: "Произвольное построение", 2:"Системное построение", 3:"Загруженно из TLE"},
        dataJson: [],
        PageSettings:{
          status: 0
        },


        KaRole: [{lable:'Нет',value:0},{lable:'Ведомый',value:1},{lable:'Лидер',value:2}], // для редактора ог
        KaModels: [],
        KaLableId: {},
        OGEdit: false,

        selectOG: undefined,
        approved: true,
        abilityEdit: false,
        addRowTable: false,
      }
    },
    components:
    {
      CreateOGPanel,
      SelectDiv
    },
    methods: {
      async closeTable() {
        if(!this.approved){
          this.dataJson = await ChangeOG(await FetchGet('/api/v1/constellation/get/list') || [])
        }
        this.PageSettings.status = 0
      },
      SelectOGFromList(data){
        this.selectOG = data
        if(this.selectOG.inputType in {1:null, 2:null} && !this.approved){
          this.abilityEdit = true
        }
      },
      async DeleteRowOG(data){
        if(!this.approved){
          await FetchPost('/api/v1/constellation/delete/byId',{},'id='+data.id)
          this.selectOG = undefined
          this.dataJson = await FetchGet('/api/v1/constellation/get/list') || []
          ChangeOG(this.dataJson)
        }
      },
      async ChangeApproved(stat){
          this.approved = stat
          
          if(this.approved) this.abilityEdit = false
          try {
            if(this.selectOG.inputType in {1:null, 2:null} && !this.approved){
              this.abilityEdit = true
            }
          } catch (error) {
            this.abilityEdit = false
          }
          await ChangeSystemObject('constellationStatus', stat)
        },

        AddRow(){
            var addedRow = {
                    'altitude' : 0, 'eccentricity' : 0,
                    'incline' : 0, 'longitudeAscendingNode' : 0,
                    'perigeeWidthArgument' : 0, 'trueAnomaly' : 0,
                    'phaseShift': null, plane:null, position:null,
                    'deleted': false, 'satelliteId': undefined,
                    "modelSat": {"id": this.KaModels[0].value},
                    name: "none", role: 0
                };
            this.selectOG.satellites.push(addedRow);   
        },
        ChangeParam(event){
            this.selectOG.satellites[event.target.id][event.target.name] = event.target.value
            this.OGEdit = true
          },
          SelectRole(data){
            this.selectOG.satellites[data.id].role = data.value
            this.OGEdit = true
          },
          SelectChangeKA(data){
            this.selectOG.satellites[data.id].modelSat.id = data.value
            this.OGEdit = true
          },
          DeleteRow(index){
              if (this.selectOG.satellites[index].satelliteId === undefined) {
                this.selectOG.satellites.splice(index,1)
              }
              else{
                this.selectOG.satellites[index].deleted = true
              }
              this.OGEdit = true
          },
          async SaveOGChange() {
            await FetchPost('/api/v1/constellation/update',this.selectOG)
            this.OGEdit = false
          }
    },
    async mounted(){
      DisplayLoad(true)
      this.approved = SystemObject.constellationStatus
      this.dataJson = OGList

      if(SystemObject.typeWorkplace in {1:null, 2:null}){
          this.KaRole = []
      }
      let result = await FetchGet('/api/v1/modelsat/all')
      this.KaModels = []
      for (let index = 0; index < result.length; index++) {
        this.KaModels.push({value:result[index].id, lable: result[index].modelName})
        this.KaLableId[result[index].id] = result[index].modelName
      }

      DisplayLoad(false)
    },
  }
  </script>

<style lang="scss" scoped>
.RightPanel{
  padding: 5px;
}

.ElementCol{
  display: grid;
  grid-template-columns: 4fr 3fr 1fr;
  background: var(--background-Button1);
  color: var(--color-Main);
  border: 1px solid var(--border-button);
  padding: 5px;
  font-size: var(--font-size);
  border-radius: 5px;
  margin: 1px 5px;
  transition: all 0.2s;
  
  div{
    flex: 0 1 auto; 
    padding: 5px 10px;
    &[type="name"]{
      flex-basis: 40%;
    }
    &[type="type"]{
      flex-basis: 40%;
    }
    &[type="icon"]{
      flex-basis: 20%;
    }
  }
}
.ButtonApprovedDiv button{
  display: flex;
  width: 94%;
  justify-content: space-between;
  margin: 3%;
  align-items: center;
  transition: box-shadow 1s ;

  &.red{
    box-shadow: inset -2px -2px 1px 0px red;
  }
  &.green{
    box-shadow: inset 2px 2px 1px 0px green;
  }
}
.SelectDivPanel{
    display: flex;
    flex-direction: column;
    align-items: center;
    .DataTable{
    width: 100%;

  }
}
.iconDelete img{
  width: 30px;
}




</style>
  
