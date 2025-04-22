<template>
    <div class="main_contain RowSection">
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
          <button class="ButtonCommand" :class="!approved? '' : 'disable'"  @click="PageSettings.status=1"><img src="@/assets/add.png" alt="" class="addButtonIcon">Добавить орбитальную группировку</button>
        </div>
        <div class="ButtonApprovedDiv" v-if="!modellingStatus">
          <button @click="ChangeApproved(!approved)" class="ButtonCommand" :class="approved? 'green' : 'red'">
          <span v-if="approved"><img src="../../assets/edit.svg"></span>
          <span v-else><img src="../../assets/approve.svg"></span>
          <span>{{ approved ?  'Редактировать' : 'Утвердить'}}</span>
        </button></div>
    </div>


    <div class="Panel RightPanel">
          
          <div v-if="PageSettings.status == 0 && selectOG != null">
            <h3>{{ selectOG.constellationName }}</h3>
            <table class="TableDefault">
              <thead>
                <tr><th>Модель КА</th><th>Имя КА</th>
                  <th v-if="KaRole.length">Роль</th>
                  <th v-if="selectOG.inputType === 2">Плосколсть</th>
                  <th v-if="selectOG.inputType === 2">Позиция</th>
                  <th>Большая полуось</th>
                  <th>Эксцентриситет</th><th>Наклон</th><th>Долгота восходящего узла</th><th>Аргумент широты перигея</th>
                  <th>Истинная аномалия</th>
                  <th v-if="abilityEdit" class="delete"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(data, index) in selectOG.satellites" :key="index"
                  :class="!abilityEdit ? 'disable' :''"
                  @change="ChangeParam"
                  v-show="!(data.deleted==true)"
                >
                  <td :class="!abilityEdit ? 'disable' : ''"><SelectDiv  :dataOption="KaModels" :valueS="{lable: KaLableId[data.modelSat.id], value: data.modelSat}" :id="String(index)" @valueSelect="SelectChangeKA" /></td>
                  <td><input type="text" v-model="data.name"></td>
                  <td v-if="KaRole.length" :class="!abilityEdit ? 'disable' : ''"><SelectDiv  :dataOption="KaRole" :valueS="KaRole[data.role]" :id="String(index)" @valueSelect="SelectRole" /></td>
                  <td v-if="selectOG.inputType === 2">{{ data.plane }}</td>
                  <td v-if="selectOG.inputType === 2">{{ data.position }}</td>
                  <td><input type="number" v-model="data.altitude"></td>
                  <td><input type="number" v-model="data.eccentricity"></td>
                  <td><input type="number" v-model="data.incline"></td>
                  <td><input type="number" v-model="data.longitudeAscendingNode"></td>
                  <td><input type="number" v-model="data.perigeeWidthArgument"></td>
                  <td><input type="number" v-model="data.trueAnomaly"></td>
                  <td v-if="abilityEdit" @click="DeleteRow(index)" class="delete"><img class="iconDelete" src="@/assets/delete.svg" alt="Удалить"></td>
                </tr>
                <tr v-if="abilityEdit" class="addRowButton">
                  <td :colspan="9+Number(selectOG.inputType==2)*2 + Number(KaRole.length > 0)"><button @click="AddRow"><img src="@/assets/add.png" alt="" class="addButtonIcon">Добавить КА</button></td>
                </tr> 
              </tbody>
            </table>
          </div>
          <div v-if="PageSettings.status == 1">
            <div class="flexrow">
              <div class="inputdiv"><input type="text" v-model="OG_Param.constellationName"></div>
              <div class="SelectDivInFlex">
                <SelectDiv  
                    :dataOption="[{value:1,lable: OGType[1]},{value:3,lable: OGType[3]},{value:2,lable: OGType[2]}]" 
                    :valueS="{lable: OGType[1]}"
                    @valueSelect="OG_Param.inputType=$event.value"/>
              </div>
              {{ OG_Param }}
              <div>
                <button @click="AddOG" class="ButtonDefault">Создать</button> 
              </div>
            </div>
            <div v-if="OG_Param.inputType === 2">
              <table class="TableDefault"><tbody>
                  <tr><td>Модель КА</td><td><SelectDiv  :dataOption="KaModels" :valueS="KaModels[0]" :id="index" @valueSelect="OG_Param.parametersCalculation.modelSat={id: $event.value}"/></td></tr>
                  <tr><td>Количество плоскостей</td><td><input type="number" v-model="OG_Param.parametersCalculation.numberOfPlane"></td></tr>
                  <tr><td>Количество позиций в плоскости</td><td><input v-model="OG_Param.parametersCalculation.positionPlane" type="number"></td></tr>
                  <tr><td>Большая полуось</td><td><input v-model="OG_Param.parametersCalculation.altitude" type="number"></td></tr>
                  <tr><td>Эксцентриситет</td><td><input v-model="OG_Param.parametersCalculation.eccentricity" type="number"></td></tr>
                  <tr><td>Наклон</td><td><input v-model="OG_Param.parametersCalculation.incline" type="number"></td></tr>

                  <tr><td colspan="2" class="Title">Долгота восходящего узла плоскостей</td></tr>
                  <tr><td>•	Долгота плоскости 1</td><td><input v-model="OG_Param.parametersCalculation.longitudeOfPlane1" type="number"></td></tr>
                  <tr><td>•	Разнесение плоскостей по долготе</td><td><input v-model="OG_Param.parametersCalculation.spacecraftOfLongitude" type="number"></td></tr>
                  <tr><td>•	Аргумент ширины перигея</td><td><input v-model="OG_Param.parametersCalculation.perigeeWidthArgument" type="number"></td></tr>

                  <tr><td colspan="2" class="Title">Истинная аномалия</td></tr>
                  <tr><td>•	Позиция 1 в плоскости 1</td><td><input v-model="OG_Param.parametersCalculation.firstPositionInPlane1" type="number"></td></tr>
                  <tr><td>•	Разнесение КА в плоскости по</td><td><input v-model="OG_Param.parametersCalculation.spacecraftSpacing" type="number"></td></tr>
                  <tr><td>•	Фазовый сдвиг КА между плоскостями</td><td><input v-model="OG_Param.parametersCalculation.phaseShift" type="number"></td></tr>
                </tbody></table>
            </div>
            <div v-if="OG_Param.inputType == 3">
              <label class="input-file">
                  <input type="file" name="file" id="file-Json" @change="LoadFile" enctype="multipart/form-data">		
                  <span>Загрузить файл</span>
              </label>
              Файл: {{ (OG_Param.file !== undefined) ? OG_Param.file.name : "Не выбран" }}
            </div>
          </div>
    </div>
</div>
</div>
</template>
  
  <script>
import {DisplayLoad, FetchGet, FetchPost, FetchPostFile} from '@/js/LoadDisplayMetod'
import { PagesSettings } from './PagesSettings.js';
import { OGList, ChangeOG, SystemObject, ChangeSystemObject} from '@/js/GlobalData';
import SelectDiv from '../SelectDiv.vue';


  export default {
    name: 'OG',
    mixins: [PagesSettings],
    data() {
      return {
        OGType: {1: "Произвольное построение", 2:"Системное построение", 3:"Загруженно из TLE"}, //список типов созданий ог
        dataJson: [],
        PageSettings:{
          status: 0
        },

        KaRole: [{lable:'Нет',value:0},{lable:'Ведомый',value:1},{lable:'Лидер',value:2}], // для редактора ог
        KaModels: [], //список моделей ка
        KaLableId: {}, // чисто для базового вывода имени ка
        selectOG: undefined, //выбранная группировка ог
        abilityEdit: false, // доступ к редактированию

        approved: true, //утверждено или нет
        
        //далее для добавления ог
        OG_Param:{
          constellationName: undefined,
          inputType: 1,
          arbitraryFormation: true,
          communicationsFormation: null,
          parametersCalculation: {
                  numberOfPlane: 0, positionPlane: 0, altitude: 0, eccentricity: 0, incline: 0, longitudeOfPlane1: 0, spacecraftOfLongitude: 0, perigeeWidthArgument: 0, firstPositionInPlane1: 0, spacecraftSpacing: 0, phaseShift: 0, modelSat:{id:1}
          },
          file: undefined
        },
      }
    },
    components:
    {
      SelectDiv
    },
    methods: {
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
          this.abilityEdit = false
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
            this.SaveOGChange()
        },
        ChangeParam(){
            this.SaveOGChange()
          },
          SelectRole(data){
            this.selectOG.satellites[data.id].role = data.value
            this.SaveOGChange()
          },
          SelectChangeKA(data){
            this.selectOG.satellites[data.id].modelSat.id = data.value
            this.SaveOGChange()
          },
          DeleteRow(index){ // ка из ог
              if (this.selectOG.satellites[index].satelliteId === undefined) {
                this.selectOG.satellites.splice(index,1)}
              else{this.selectOG.satellites[index].deleted = true}
              this.SaveOGChange()
          },
          async SaveOGChange() { //сохранение изменения ог
            await FetchPost('/api/v1/constellation/update',this.selectOG)
            this.dataJson = await ChangeOG(await FetchGet('/api/v1/constellation/get/list') || [])
            for (let i = 0; i < this.dataJson.length; i++) {
              const element = this.dataJson[i];
              if(element.id == this.selectOG.id){
                this.selectOG = element
                break
              }              
            }

          },
          async AddOG(){
            if(this.OG_Param.constellationName != undefined)
            {
              let responce =  {}
              if(this.OG_Param.inputType == 1)
              {
                responce = await FetchPost('/api/v1/constellation/add',this.OG_Param) || {}
              }
              else if(this.OG_Param.inputType == 2) {
                responce = await FetchPost('/api/v1/constellation/calc/planar',this.OG_Param) || {}
              }
              else if(this.OG_Param.inputType == 3){
                const formData = new FormData(); // Создаем FormData
                const file = this.OG_Param.file
                formData.append('file', file); // Добавляем файл
                formData.append('constellationName', this.OG_Param.constellationName); // Добавляем имя
                formData.append('inputType', 3);
                responce = await FetchPostFile("/api/v1/constellation/upload/tle", formData)
              }
              if(responce.type == "SUCCESS"){
                this.dataJson = await ChangeOG(await FetchGet('/api/v1/constellation/get/list') || [])
                this.PageSettings.status = 0
              }
              else{
                alert("Ошибка добавления" + JSON.stringify(responce))
                console.log(responce)
              }
            }
            else{
              alert("Некоректные входные данные - '"+this.OG_Param.constellationName+"' - '"+this.OG_Param.inputType+"'")
            }
          },
          async LoadFile(data){
            if (data.target.files[0]) {
              var file = data.target.files[0];
              this.OG_Param.file = file
            }
          },
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
      this.OG_Param.parametersCalculation.modelSat={id:this.KaModels[0].value}
      DisplayLoad(false)
    },
  }
  </script>

<style lang="scss" scoped>

.ElementCol{
  display: grid;
  grid-template-columns: 4fr 3fr 1fr;
  background: var(--background-Button1);
  border: 1px solid var(--border-button);
  padding: 5px;
  border-radius: 5px;
  margin: 1px 5px;
  transition: all 0.2s;
  div{
    padding: 5px 10px;
  }
}





</style>
  
