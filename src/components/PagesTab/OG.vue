<template>
    <div class="main_contain RowSection" style="width: 100%;">
    <div>
      <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
        <img src="@/assets/exit.svg"><span>&#8203;</span>
      </button>
    </div>

    <div class="ContentDiv" style="margin-top: 20px;">
    <DataTable :value="valueSelectOG.satellites"
      tableStyle="min-width: 50rem; max-width: 100%" sortMode="multiple" stripedRows removableSort
      ref="dtSat" :exportFilename="'НП_' + new Date().toISOString().slice(0, 10)" scrollable>
      <template #header>
        <Toolbar class="mb-4">
          <template #start>
            <Button icon="pi pi-file-excel" severity="help" @click="LoadXLSX" text label="Exel"/>
          </template>
          <template #center>
            <SelectButton v-model="valueSelectOG" :options="dataJson" optionLabel="constellationName" dataKey="id" aria-labelledby="custom" 
            :pt="{button:{style:'padding: 7px 5px 7px 13px;'}}">
              <template #option="slotProps">
                 <div style="display: flex;align-items: center;">
                  <span style="position: relative;">{{ slotProps.option.constellationName }}</span>
                  <Button icon="pi pi-trash" 
                    class="p-button-rounded p-button-danger p-button-text"  :style="'width: 25px;height: 25px;'"
                    @click.stop="DeleteRowOG(slotProps.option)" @mousedown.stop @mouseup.stop/>
                </div>
              </template>
            </SelectButton>
            <Button icon="pi pi-plus" class="p-button-sm" severity="success" label="" text @click="PageSettings.status=(PageSettings.status+1)%2" />
          </template>
          <template #end>
            <Button icon="pi pi-plus" class="p-button-sm" severity="success" label="Добавить КА" rounded text @click="AddRow" />
          </template>
        </Toolbar>
      </template>
      <Column field="name" header="Имя КА" sortable frozen>
        <template #body="slotProps"><InputText v-model="slotProps.data.name" @input="ChangeParam(slotProps.data)" :style="'width:150px'"/></template>
      </Column>
      <Column field="modelSat" header="Модель КА">
        <template #body="slotProps">
          <Dropdown v-model="slotProps.data.modelSat" :options="KaModels" optionLabel="modelName"  placeholder="Выберите модель"/>
        </template>
      </Column>
      <Column field="role" header="Роль" v-if="PageSettings.RoleUse">
        <template #body="slotProps">
          <Dropdown v-model="slotProps.data.role" :options="KaRole" optionLabel="lable" optionValue="value" placeholder="Выберите модель"/>
        </template>
      </Column>
      <Column field="plane" header="Плосколсть" sortable v-if="valueSelectOG.inputType===2":style="'width:50px'"/>
      <Column field="position" header="Позиция" sortable v-if="valueSelectOG.inputType===2" :style="'width:50px'"/>
      <Column v-for="data,index in {
        'altitude':'Большая полуось','eccentricity':'Эксцентриситет',
        'incline':'Наклон','longitudeAscendingNode':'Долгота восходящего узла',
        'perigeeWidthArgument':'Аргумент широты перигея','trueAnomaly':'Истинная аномалия'
        }" :key="index" :field="index" :header="data">
        <template #body="slotProps"><div class="narrow-input-container"><InputNumber v-model="slotProps.data[index]" @input="ChangeParam(slotProps.data)" :pt="{root: { style: 'width: 100%' },input: { style: 'width: 100px' }}" class="MinInput"/></div></template>
      </Column>
      <Column header="" :exportable="false" headerStyle="width: 3rem">
        <template #body="slotProps">
          <Button 
            icon="pi pi-trash" 
            class="p-button-rounded p-button-danger p-button-text" 
            @click="slotProps.data.deleted = true; DeleteRow()"
          />
        </template>
      </Column>
    </DataTable> 
    <div class="Panel RightPanel">
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
                  <!--<tr><td>Модель КА</td><td><SelectDiv  :dataOption="KaModels" :valueS="KaModels[0]" :id="index" @valueSelect="OG_Param.parametersCalculation.modelSat={id: $event.value}"/></td></tr>-->
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
import SelectDiv from '../SelectDiv.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Toolbar from 'primevue/toolbar';
import SelectButton from 'primevue/selectbutton';
import XLSX from 'xlsx-js-style';
import Dropdown from 'primevue/dropdown';

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
        valueSelectOG : {id:null, satellites:[]} 
        
      }
    },
    components:
    {
      SelectDiv, 
      DataTable, Column, Button, InputNumber, InputText, Toolbar, SelectButton,Dropdown
    },
    methods: {
      async DeleteRowOG(data){
        if(!this.approved){
          await this.$FetchPost('/api/v1/constellation/delete/byId',{},'id='+data.id)
          this.selectOG = {id:null}
          this.dataJson = await this.$GetOGList()
          this.SelectOGFromList(this.dataJson[0])
        }
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
            this.valueSelectOG.satellites.push(addedRow);  
            this.SaveOGChange()
        },
          ChangeParam(event){
              this.SaveOGChange(false)
              console.log(event, 'сделать тут отдельное обновление каждой строчки')
          },
          DeleteRow(){ // ка из ог
              this.SaveOGChange(true)
          },
          async SaveOGChange(reload = true) { //сохранение изменения ог
            await this.$ChangeOGList(this.valueSelectOG)
            if(reload){
              this.dataJson = await this.$GetOGList()
              for (let i = 0; i < this.dataJson.length; i++) {
                const element = this.dataJson[i];
                if(element.id == this.valueSelectOG.id){
                  this.valueSelectOG = element
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
            console.log("fsef")
          },
    },
    async mounted(){
      this.dataJson = await this.$OGList()
      let result = await this.$FetchGet('/api/v1/modelsat/all')
      this.KaModels = []
      for (let index = 0; index < result.length; index++) {
        this.KaModels.push({modelName:result[index].modelName, id:result[index].id, "description": null, "imageFile": null, "operatingParameter": null, "rules": null, "modes": null, "devCatalogs": null, "devices": null, "charges": null})
      }
      this.valueSelectOG = this.dataJson[0]

      let system = await this.$SystemObject()

      if(system.typeWorkplace in {1:null, 2:null}){
          this.PageSettings.RoleUse = false
      }
      this.OG_Param.parametersCalculation.modelSat={id:this.KaModels[0].value}
    },
  }
  </script>

<style lang="scss" scoped>
/* Глобальные стили или scoped */
.narrow-input-container {
  width: 100%;
  display: flex;
  justify-content: center;
  .p-inputnumber {//контроль размеров инпута
    width: 100px !important;
    min-width: 100%;
    flex-direction: column;
  }
}

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
.LoadExel{
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  div{
    display: flex;
    align-items: center;
  }
  img{
    width: 30px;
  }
}
</style>
  
  
