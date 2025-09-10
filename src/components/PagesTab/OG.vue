<template>
<div class="main_contain">
      <div сlass="HeaderContain">
        <Toolbar class="mb-4">
          <template #start>
            <Button icon="pi pi-file-excel" severity="help" @click="LoadXLSX" text label="Exel" :disabled="valueSelectOG == undefined" />
          </template>
          <template #center>
            <SelectButton v-model="valueSelectOG" :options="dataOGSelect" optionLabel="name" optionValue="id" dataKey="id" aria-labelledby="custom" 
            :pt="{button:{style:'padding: 7px 5px 7px 13px;'}}">
              <template #option="slotProps">
                 <div style="display: flex;align-items: center;">
                  <span style="position: relative;">{{ slotProps.option.name }}</span>
                  <Button icon="pi pi-trash" 
                    class="p-button-rounded p-button-danger p-button-text"  :style="'width: 25px;height: 25px;'"
                    @click.stop="DeleteRowOG(slotProps.option.id)" @mousedown.stop @mouseup.stop/>
                </div>
              </template>
            </SelectButton>
            <Button icon="pi pi-plus" class="p-button-sm" severity="success" label="ОГ" text @click="valueSelectOG = undefined" />
          </template>
          <template #end>
            <Button icon="pi pi-plus" class="p-button-sm" severity="success" label="Добавить КА" rounded text @click="AddRow" :disabled="valueSelectOG == undefined" />
          </template>
        </Toolbar> 
      </div>
    <div class="ContentDiv">
    <span>{{ valueSelectOG!==undefined?PageSettings.OGType[dataJson[valueSelectOG].inputType-1].lable:''}}</span>
    <DataTable :value="dataJson[valueSelectOG].satellites" v-if="valueSelectOG != undefined" scrollable scrollHeight="58vh"
      tableStyle="min-width: 50rem; max-width: 100%" sortMode="multiple" stripedRows removableSort
      ref="dtSat" :exportFilename="'OG_' + new Date().toISOString().slice(0, 10)">
      <Column field="name" header="Имя КА" sortable frozen>
        <template #body="slotProps">
          <InputText :disabled="dataJson[valueSelectOG].inputType==3" v-model="slotProps.data.name" @blur="ChangeParam(slotProps.data)" :style="'width:150px'"/>
        </template>
      </Column>
      <Column field="modelSat" header="Модель КА">
        <template #body="slotProps">
          <Dropdown v-model="slotProps.data.modelSat" :options="KaModels" @change="ChangeParam(slotProps.data)" optionLabel="modelName"  placeholder="Выберите модель"/>
        </template>
      </Column>
      <Column field="role" header="Роль" v-if="PageSettings.RoleUse">
        <template #body="slotProps">
          <Dropdown v-model="slotProps.data.role" :options="PageSettings.KaRole" @change="ChangeParam(slotProps.data)" optionLabel="lable" optionValue="value" placeholder="Выберите модель"/>
        </template>
      </Column>
      <Column field="plane" header="Плосколсть" sortable v-if="dataJson[valueSelectOG].inputType===2":style="'width:50px'"/>
      <Column field="position" header="Позиция" sortable v-if="dataJson[valueSelectOG].inputType===2" :style="'width:50px'"/>
      <Column v-for="data,index in {
        'altitude':'Большая полуось','eccentricity':'Эксцентриситет',
        'incline':'Наклон','longitudeAscendingNode':'Долгота восходящего узла',
        'perigeeWidthArgument':'Аргумент широты перигея','trueAnomaly':'Истинная аномалия'
        }" :key="index" :field="index" :header="data">
        <template #body="slotProps">
          <div class="narrow-input-container">
            <InputNumber :disabled="dataJson[valueSelectOG].inputType==3" v-model="slotProps.data[index]" @blur="ChangeParam(slotProps.data)" :pt="{root: { style: 'width: 100%' },input: { style: 'width: 100px' }}" class="MinInput"  mode="decimal" :maxFractionDigits="5"/>
          </div>
        </template>
      </Column>
      <Column header="" :exportable="false" headerStyle="width: 3rem" v-if="dataJson[valueSelectOG].inputType != 3">
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
          <div v-if="valueSelectOG == undefined">
            <div class="flexrow">
                <FloatLabel>
                  <InputText v-model="OG_Param.constellationName" inputId="constellationName" :invalid="!OG_Param.constellationName"/>
                  <label for="constellationName">Название</label>
                </FloatLabel>
                <FloatLabel>
                  <Dropdown v-model="OG_Param.inputType" :options="PageSettings.OGType" optionLabel="lable" optionValue="value" inputId="inputType"/>
                  <label for="inputType">Тип</label>
                </FloatLabel>
              <div><Button label="Создать" severity="success" raised @click="AddOG"/></div>
            </div>
            <div v-if="OG_Param.inputType == 3">
                <FileUpload mode="basic" name="file" accept=".txt,text/plain" :maxFileSize="1000000" :customUpload="true" @select="LoadFile" :auto="true" :chooseLabel="OG_Param.file?OG_Param.file.name:'Выбрать файл'" />
                Файл: {{ (OG_Param.file !== undefined) ? OG_Param.file.name : "Не выбран" }}
              </div>
            <div v-if="OG_Param.inputType === 2" >
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
import XLSX from 'xlsx-js-style';

  export default {
    name: 'OG',
    mixins: [PagesSettings],
    data() {
      return {
        
        dataJson: [],
        dataOGSelect:[],
        valueSelectOG : undefined,
        PageSettings:{
          RoleUse:true,
          OGType: [{value:1, lable:"Произвольное построение"},{value:2, lable:"Системное построение"},{value:3, lable:"Загруженно из TLE"}],
          KaRole: [{lable:'Нет',value:0},{lable:'Ведомый',value:1},{lable:'Лидер',value:2}],
        },
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
      }
    },
    components:{},
    methods: {
      async DeleteRowOG(id){
        if(!this.approved){
          await this.$FetchPost('/api/v1/constellation/delete/byId',{},'id='+this.dataJson[id].id)
          await this.$GetOGList()
          this.CreateSelectOGArray()
          this.valueSelectOG = undefined
          this.$showToast('','info',"Ог удалена");
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
            this.dataJson[this.valueSelectOG].satellites.push(addedRow);  
            this.$ChangeOGList(this.valueSelectOG, true)
        },
          ChangeParam(data){
            //console.log(data) возможно сделать обновление построчным
            this.$ChangeOGList(this.valueSelectOG)
          },
          async DeleteRow(){ // ка из ог
            await this.$ChangeOGList(this.valueSelectOG, true)
          },
          async AddOG(){
            try {
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
                await this.$GetOGList()
                this.CreateSelectOGArray()
                this.valueSelectOG = this.dataJson.length-1
                await this.$reloadSystem()
                this.$showToast('','info',"Ог добавлена");
              }
              else{
                this.$showToast('','error',"Ошибка добавления");
                console.log(responce)
              }
            }
            else{
              this.$showToast('Некоректные данные добавления ОГ','error',"Ошибка добавления");
              console.error("Некоректные входные данные - '"+this.OG_Param.constellationName+"' - '"+this.OG_Param.inputType+"'")
            }
            } catch (error) {
              console.error(error);
              this.$showToast('Неизвестная ошибка','error',"Ошибка добавления");
            }
          },
          async LoadFile(data){
            if (data.files[0]) {
              var file = data.files[0];
              this.OG_Param.file = file
            }
          },
          LoadXLSX(){
            const filename = this.$refs.dtSat.$props.exportFilename || 'export';
            const headers = [];
            const fields = [];
            this.$refs.dtSat.$slots.default()
              .filter(col => col.props?.exportable !== false)
              .forEach(col => {
                if(col.props != null){
                  headers.push(col.props?.header || col.props?.field);
                  fields.push(col.props?.field);
                }
                else if(typeof col.children == "object" && col.children.length > 0){
                  col.children.forEach(colChild => {
                    headers.push(colChild.props?.header);
                    fields.push(colChild.props?.field);
                  })
                }
              });
            // 3. Подготавливаем данные
            const data = this.dataJson[this.valueSelectOG].satellites.map(row => {
              const newRow = {};
              fields.forEach(field => {
                if(field == 'modelSat') newRow[field] = row.modelSat.modelName;
                else if(field == 'role') newRow[field] = this.PageSettings.KaRole[row.role].lable;
                else newRow[field] = row[field];
              });
              return newRow;
            });
            // 4. Создаем лист Excel
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
            // Преобразуем заголовки в массив объектов с стилями
            const styledHeaders = headers.map(text => ({
              v: text,
              t: 's',
              s: style
            }));
            const worksheet = XLSX.utils.json_to_sheet(data, { header: fields });
            XLSX.utils.sheet_add_aoa(worksheet, [styledHeaders], { origin: 'A1' })
            // 7. Сохраняем файл
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
            XLSX.writeFile(workbook, `${filename}.xlsx`);
          },
          CreateSelectOGArray(){
            this.dataOGSelect = []
            for (let i = 0; i < this.dataJson.length; i++) {
              this.dataOGSelect.push({name: this.dataJson[i].constellationName, id: i})
            }
          }
    },
    async mounted(){
      this.dataJson = await this.$OGList()
      this.CreateSelectOGArray()
      if(this.dataJson.length > 0) this.valueSelectOG = 0

      let result = await this.$FetchGet('/api/v1/modelsat/all')
      this.KaModels = []
      for (let index = 0; index < result.length; index++) {
        this.KaModels.push({modelName:result[index].modelName, id:result[index].id, "description": null, "imageFile": null, "operatingParameter": null, "rules": null, "modes": null, "devCatalogs": null, "devices": null, "charges": null})
      }

      let system = await this.$SystemObject() 
      if(system.typeWorkplace in {1:null, 2:null}){ //смотрим нужны ли нам роли ка
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


.flexrow{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .p-float-label{
    margin: 10px 10px;
  }
}
</style>
  
  
