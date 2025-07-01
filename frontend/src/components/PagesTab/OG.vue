<template>
    <div class="main_contain RowSection">
    <div>
      <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
        <img src="@/assets/exit.svg"><span>&#8203;</span>
      </button>
    </div>
    <div class="ContentDiv">
    <div class="Panel LeftPanel">
        <div class="FlexColumn">
          <div class="OGList">
            <div v-for="data, index in dataJson"
              :key="index"
              class="ButtonCommand" :class="data.id==selectOG.id?'Select':''"
              @click="SelectOGFromList(data)"
            >
              <div type="name">{{ data.constellationName }}</div>
              <div class="iconDelete" @click="DeleteRowOG(data)" type="icon"><img  src="@/assets/delete.svg" alt="Удалить"></div>
          </div>
            <button class="ButtonCommand"  @click="PageSettings.status=(PageSettings.status+1)%2">
              <img src="@/assets/add.png" alt="" class="addButtonIcon">{{ (PageSettings.status == 1) ? 'Прекратить' : 'Добавить орбитальную группировку' }}
            </button>
          </div>
        </div>
    </div>


    <div class="Panel RightPanel">
          <div v-if="PageSettings.status == 0 && selectOG != null" style="height: 93%;">
            <h3>{{ selectOG.constellationName || "Не выбрана ОГ" }} - {{ OGType[selectOG.inputType] }}</h3>
            <div class="TableDiv" style="max-height: 100%; height: 90%;">
            <table class="TableDefault">
              <thead>
                <tr><th>Модель КА</th><th>Имя КА</th>
                  <th v-if="PageSettings.RoleUse">Роль</th>
                  <th v-if="selectOG.inputType === 2">Плосколсть</th>
                  <th v-if="selectOG.inputType === 2">Позиция</th>
                  <th>Большая полуось</th>
                  <th>Эксцентриситет</th><th>Наклон</th><th>Долгота восходящего узла</th><th>Аргумент широты перигея</th>
                  <th>Истинная аномалия</th>
                  <th v-if="!approved && selectOG.inputType!=3" class="delete"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(data, index) in selectOG.satellites" :key="index"
                  :class="approved ? 'disable' :''"
                  @change="ChangeParam"
                  v-show="!(data.deleted==true)"
                >
                  <td><SelectDiv  :dataOption="KaModels" :valueS="KaModels.filter(x => x.value == data.modelSat.id)[0]" :id="String(index)" @valueSelect="SelectChangeKA" /></td>
                  <td><input type="text" v-model="data.name"                     :disabled="selectOG.inputType==3"></td>
                  <td v-if="PageSettings.RoleUse"><SelectDiv  :dataOption="KaRole" :valueS="KaRole[data.role]" :id="String(index)" @valueSelect="SelectRole" /></td>
                  <td v-if="selectOG.inputType === 2">{{ data.plane }}</td>
                  <td v-if="selectOG.inputType === 2">{{ data.position }}</td>
                  <td><input type="number" v-model="data.altitude"               :disabled="selectOG.inputType==3"></td>
                  <td><input type="number" v-model="data.eccentricity"           :disabled="selectOG.inputType==3"></td>
                  <td><input type="number" v-model="data.incline"                :disabled="selectOG.inputType==3"></td>
                  <td><input type="number" v-model="data.longitudeAscendingNode" :disabled="selectOG.inputType==3"></td>
                  <td><input type="number" v-model="data.perigeeWidthArgument"   :disabled="selectOG.inputType==3"></td>
                  <td><input type="number" v-model="data.trueAnomaly"            :disabled="selectOG.inputType==3"></td>
                  <td v-if="!approved && selectOG.inputType!=3" @click="DeleteRow(index)" class="delete"><img class="iconDelete" src="@/assets/delete.svg" alt="Удалить"></td>
                </tr></tbody><tfoot>
                <tr v-if="!approved && selectOG.inputType!=3" class="addRowButton">
                  <td :colspan="9+Number(selectOG.inputType==2)*2 + PageSettings.RoleUse"><button @click="AddRow"><img src="@/assets/add.png" alt="" class="addButtonIcon">Добавить КА</button></td>
                </tr> 
              </tfoot>
            </table>
          </div>
          </div>
          <div v-if="PageSettings.status == 1">
            <div class="flexrow">
              <div class="inputdiv"><input type="text" v-model="OG_Param.constellationName" placeholder="Введите название"></div>
              <div class="SelectDivInFlex">
                <SelectDiv  
                    :dataOption="[{value:1,lable: OGType[1]},{value:3,lable: OGType[3]},{value:2,lable: OGType[2]}]" 
                    :valueS="{lable: OGType[OG_Param.inputType]}"
                    @valueSelect="OG_Param.inputType=$event.value"/>
              </div>
              <div><button @click="AddOG" class="ButtonCommand">Создать</button> </div>
            </div>
            <div v-if="OG_Param.inputType == 3">
                <label class="input-file">
                    <input type="file" name="file" id="file-Json" @change="LoadFile" enctype="multipart/form-data">		
                    <span>Загрузить файл</span>
                </label>
                Файл: {{ (OG_Param.file !== undefined) ? OG_Param.file.name : "Не выбран" }}
              </div>
            <div v-if="OG_Param.inputType === 2" class="TableDiv">
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
          </div>
    </div>
</div>
</div>
</template>
  
  <script>
import { PagesSettings } from './PagesSettings.js';
import { CreateDateTime } from '@/js/WorkWithDTime';
import XLSX from 'xlsx-js-style';
import SelectDiv from '../SelectDiv.vue';


  export default {
    name: 'OG',
    mixins: [PagesSettings],
    data() {
      return {
        OGType: {1: "Произвольное построение", 2:"Системное построение", 3:"Загруженно из TLE"}, //список типов созданий ог
        dataJson: [],
        PageSettings:{
          status: 0,
          saveEXELmode: true,
          RoleUse:true
        },
        KaRole: [{lable:'Нет',value:0},{lable:'Ведомый',value:1},{lable:'Лидер',value:2}], // для редактора ог
        KaModels: [], //список моделей ка
        KaLableId: {}, // чисто для базового вывода имени ка
        selectOG: {id:null}, //выбранная группировка ог
        approved: false, //утверждено или нет
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
        this.selectOG = {id:null}
        if(data != undefined){
          this.selectOG = data
          this.OGTimePrevrap()
          console.log("select", data)
        }
      },
      OGTimePrevrap(){
        this.selectOG.satellites.forEach(element => {
          element.timeTLE = CreateDateTime(element.tleTime)
        });
      },
      async DeleteRowOG(data){
        if(!this.approved){
          await this.$FetchPost('/api/v1/constellation/delete/byId',{},'id='+data.id)
          this.selectOG = {id:null}
          this.dataJson = await this.$GetOGList()
          this.SelectOGFromList(this.dataJson[0])
        }
      },
      async ChangeApproved(stat){
          this.approved = stat
          try {
            if(!this.approved){
              this.approved = true
            }
          } catch (error) {
            this.approved = false
          }
          //await ChangeSystemObject('constellationStatus', stat)
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
        ChangeParam(event){
            if(event.target.nodeName != 'SELECT')
              this.SaveOGChange()
          },
          SelectRole(data){
            this.selectOG.satellites[data.id].role = data.value
            this.SaveOGChange()
          },
          SelectChangeKA(data){
            this.selectOG.satellites[data.id].modelSat.id = data.value
            //this.selectOG.satellites[data.id].modelSat.modelName = data.lable
            this.SaveOGChange()
          },
          async DeleteRow(index){ // ка из ог
              this.selectOG.satellites[index].deleted = true
              await this.SaveOGChange(true)
          },
          async SaveOGChange(reload = true) { //сохранение изменения ог
            await this.$ChangeOGList(this.selectOG)
            if(reload){
              this.dataJson = await this.$GetOGList()
              for (let i = 0; i < this.dataJson.length; i++) {
                const element = this.dataJson[i];
                if(element.id == this.selectOG.id){
                  this.selectOG = element
                  this.OGTimePrevrap()
                  break
                }              
              }
            }
          },
          async AddOG(){
            if(this.OG_Param.constellationName != undefined)
            {
              let responce =  {}
              if(this.OG_Param.inputType == 1)
              {
                responce = await this.$FetchPost('/api/v1/constellation/add',this.OG_Param) || {}
              }
              else if(this.OG_Param.inputType == 2) {
                responce = await this.$FetchPost('/api/v1/constellation/calc/planar',this.OG_Param) || {}
              }
              else if(this.OG_Param.inputType == 3){
                const formData = new FormData(); // Создаем FormData
                const file = this.OG_Param.file
                formData.append('file', file); // Добавляем файл
                formData.append('constellationName', this.OG_Param.constellationName); // Добавляем имя
                formData.append('inputType', 3);
                responce = await this.$FetchPostFile("/api/v1/constellation/upload/tle", formData)
              }
              if(responce.type == "SUCCESS"){
                this.dataJson = await this.$GetOGList()
                this.PageSettings.status = 0
                this.SelectOGFromList(this.dataJson[this.dataJson.length-1])
                await this.$reloadSystem()
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
          LoadXLSX(){
          const workbook = XLSX.utils.book_new();
          let data = [["Модель КА","Имя КА","Роль","Плосколсть","Позиция","Большая полуось","Эксцентриситет","Наклон","Долгота восходящего узла",
            "Аргумент широты перигея","Истинная аномалия"]]
            console.log(this.dataJson)
            let dataLoad = []
            if(this.PageSettings.saveEXELmode){
              dataLoad = this.dataJson
            }
            else{
              dataLoad = [this.selectOG]
            }
            if(dataLoad.length == 1 && this.selectOG == undefined){
              alert("группировка не выбрана")
              return
            } 
            dataLoad.forEach(dataOGExel => {
              if(dataLoad.length > 1) data.push([dataOGExel.constellationName])
              dataOGExel.satellites.forEach(element => {
              data.push([this.KaLableId[element.modelSat.id],element.name,this.KaRole[element.role].lable,
              element.plane,element.position,element.altitude,element.eccentricity,element.incline,element.longitudeAscendingNode,
              element.perigeeWidthArgument,element.trueAnomaly])
            });
            })
            
          let worksheet = XLSX.utils.aoa_to_sheet(data); // Создаем таблицу в файле с данными из массива
          workbook.SheetNames.push('Data'); // Добавляем лист с названием First list
          let style = {
            font: {
              name: 'Calibri',
              sz: 12,
              bold: true,
                  color: {rgb: '000000'} // red font
            },
            border: {
              bottom: { style: 'thin', color: { rgb: '000000' } }
            }}
          let keylist = Object.keys(worksheet)
          for (let keyid = 0; keyid < keylist.length; keyid++) {
            const key = keylist[keyid];
            console.log(worksheet[key].v, keylist, data[0])
            try {
              if (data[0].indexOf(worksheet[key].v) != -1) {
                worksheet[key].s = style
              }
            } catch (error) {
              console.log(error)
            }
          }
          console.log(worksheet)
          workbook.Sheets['Data'] = worksheet;
          XLSX.writeFile(workbook, 'ОП.xlsx');
        },
    },
    async mounted(){
      this.dataJson = await this.$OGList()
      let result = await this.$FetchGet('/api/v1/modelsat/all')
      this.KaModels = []
      for (let index = 0; index < result.length; index++) {
        this.KaModels.push({value:result[index].id, lable: result[index].modelName})
      }
      this.selectOG = this.dataJson[0]
      this.SelectOGFromList(this.dataJson[0])
      let system = await this.$SystemObject()

      if(system.typeWorkplace in {1:null, 2:null}){
          this.PageSettings.RoleUse = false
      }
      this.OG_Param.parametersCalculation.modelSat={id:this.KaModels[0].value}
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

.flexrow{
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  .inputdiv input{
    border-bottom: 1px solid white;
  }
}

.OGList{
  display: flex;
  .ButtonCommand{
    padding: 10px 20px;
    display: flex;
    align-items: center;
    width: auto !important;
    flex: none !important;
    .addButtonIcon{
      top: auto;
    }
  }
}
</style>
  
  
