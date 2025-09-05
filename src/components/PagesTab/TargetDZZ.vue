<template>
    <div class="main_contain">
      <div сlass="HeaderContain">
        {{ active }}
        <Toolbar class="mb-4">
          <template #start>
            <Button  icon="pi pi-file-excel" severity="help" @click="exportExcel" text label="Exel"/>
          </template>
          <template #center v-if="!(systemStatus.typeWorkplace in {4:null,5:null})">
            <TabMenu @tab-change="viewmode = TabList[$event.index].value" :model="TabList" />
          </template>
          <template #end>
            <Button icon="pi pi-plus" class="p-button-sm" severity="success" label="Добавить" rounded text @click="AddRow()" />
            <Button icon="pi pi-trash" class="p-button-sm" severity="danger" label="Удалить всё" rounded text @click="DeleteAll"/>
          </template>
        </Toolbar>
      </div>
    <div class="ContentDiv" :class="modellingStatus?'DisableForModelling':''">
          <DataTable :value="target.request" v-if="viewmode=='request'" scrollable scrollHeight="60vh"
              tableStyle="min-width: 50rem" sortMode="multiple" stripedRows removableSort
              ref="dtDZZ" :exportFilename="'Заявки_' + new Date().toISOString().slice(0, 10)">
              <Column field="catalog" header="Цель">
                <template #body="slotProps">
                  <Dropdown v-model="slotProps.data.catalog" :options="target.catalog" @change="SaveChange($event)" optionLabel="goalName" placeholder="Выберите цель"/>
                </template>
              </Column>
              <Column field="lat" header="Широта"><template #body="slotProps">{{ slotProps.data.catalog.lat }}</template></Column>
              <Column field="lon" header="Долгота"><template #body="slotProps">{{ slotProps.data.catalog.lon }}</template></Column>
              <Column field="choiceCriteria" header="Критерий">
                <template #body="slotProps">
                  <Dropdown v-model="slotProps.data.choiceCriteria" :options="choiceCriteriaArr" @change="SaveChange($event)" optionLabel="lable" optionValue="value" placeholder="Выберите цель"/>
                </template>
              </Column>
              <Column field="priory" header="Приоритет">
                <template #body="slotProps"><div class="narrow-input-container">
                  <InputNumber v-model="slotProps.data.priory" showButtons @blur="SaveChange($event)" :invalid="!slotProps.data.priory && slotProps.data.priory !== 0" :pt="{root: { style: 'width: 100%' },input: { style: 'width: 100px' }}" class="MinInput"/>
                </div></template>
              </Column>
              <Column field="timeDate" header="Время появления">
                <template #body="slotProps">
                  <Calendar v-model="slotProps.data.timeDate"  @date-select="ChangeTimeInput($event, 'time', slotProps.data.requestId)" @blur="ChangeTimeInput($event.value, 'time', slotProps.data.requestId)" :invalid="!slotProps.data.timeDate" dateFormat="yy-mm-dd" timeFormat="HH:mm:ss" showTime hourFormat="24" showIcon iconDisplay="input" inputId="datetime" showSeconds :manualInput="true"/>
                </template>
              </Column>
              <Column field="termDate" header="Срок выполнения">
                <template #body="slotProps">
                  <Calendar v-model="slotProps.data.termDate"  @date-select="ChangeTimeInput($event, 'term', slotProps.data.requestId)" @blur="ChangeTimeInput($event.value, 'term', slotProps.data.requestId)" :invalid="!slotProps.data.termDate" dateFormat="yy-mm-dd" timeFormat="HH:mm:ss" showTime hourFormat="24" showIcon iconDisplay="input" inputId="datetime" showSeconds :manualInput="true"/>
                </template>
              </Column>
              <Column field="type" header="Признак" v-if="systemStatus.typeWorkplace in {3:null}">
                <template #body="slotProps">
                  <Dropdown v-model="slotProps.data.type" :options="TypeRequest" @change="SaveChange($event)" optionLabel="lable" optionValue="value" placeholder="Выберите цель"/>
                </template>
              </Column>
              <Column header="" :exportable="false" headerStyle="width: 3rem">
                <template #body="slotProps">
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" 
                    @click="slotProps.data.deleted = true; DeleteRow()"/>
                </template>
              </Column>
          </DataTable>


          <DataTable :value="target.catalog" v-if="viewmode=='catalog'" scrollable scrollHeight="60vh"
              tableStyle="min-width: 50rem" sortMode="multiple" stripedRows removableSort
              ref="dtDZZcatalog" :exportFilename="'Каталог_Заявки_' + new Date().toISOString().slice(0, 10)">
              <Column field="use" header="Использование" :exportable="false">
                <template #body="slotProps">
                  <Button icon="pi pi-plus" class="p-button-sm" severity="success" :label="String(catalogUse[slotProps.data.goalId])" text @click="AddRowCatalog(slotProps.data)" />
                </template>
              </Column>
              <Column field="goalName" header="Цель">
                <template #body="slotProps">
                  <InputText v-model="slotProps.data.goalName" @blur="SaveChange(slotProps.data)" :invalid="!slotProps.data.goalName"/>
                </template>
              </Column>
              <Column field="lat" header="Широта">
                <template #body="slotProps">
                  <InputNumber v-model="slotProps.data.lat" showButtons @blur="SaveChange($event)" :invalid="!slotProps.data.lat && slotProps.data.lat !== 0" :pt="{root: { style: 'width: 100%' },input: { style: 'width: 100px' }}" class="MinInput" mode="decimal" :maxFractionDigits="5"/>
                </template>
              </Column>
              <Column field="lon" header="Долгота">
                <template #body="slotProps">
                  <InputNumber v-model="slotProps.data.lon" showButtons @blur="SaveChange($event)" :invalid="!slotProps.data.lon && slotProps.data.lon !== 0" :pt="{root: { style: 'width: 100%' },input: { style: 'width: 100px' }}" class="MinInput" mode="decimal" :maxFractionDigits="5"/>
                </template>
              </Column>
              <Column header="" :exportable="false" headerStyle="width: 3rem">
                <template #body="slotProps">
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" 
                    @click="slotProps.data.deleted = true; DeleteRow()"/>
                </template>
              </Column>
          </DataTable>

          <DataTable :value="target.datarequest" v-if="viewmode=='datarequest'" scrollable scrollHeight="60vh"
              tableStyle="min-width: 50rem" sortMode="multiple" stripedRows removableSort
              ref="dtDZZdata" :exportFilename="'Данные_Заявки_' + new Date().toISOString().slice(0, 10)">
              <Column field="name" header="Имя">
                <template #body="slotProps">
                  <InputText v-model="slotProps.data.name" @blur="SaveChange(slotProps.data)" :invalid="!slotProps.data.name"/>
                </template>
              </Column>
              <Column field="satellite" header="МКА">
                <template #body="slotProps">
                  <Dropdown v-model="slotProps.data.satellite" :options="datarequestКАList" @change="SaveChange($event)" optionLabel="name"/>
                </template>
              </Column>
              <Column field="capacity" header="Объём, Мбайт">
                <template #body="slotProps">
                  <InputNumber v-model="slotProps.data.capacity" showButtons @blur="SaveChange($event)" :invalid="!slotProps.data.capacity && slotProps.data.capacity !== 0" :pt="{root: { style: 'width: 100%' },input: { style: 'width: 100px' }}" class="MinInput" mode="decimal" :maxFractionDigits="5"/>
                </template>
              </Column>
              <Column field="priority" header="Приоритет">
                <template #body="slotProps">
                  <InputNumber v-model="slotProps.data.priority" showButtons @blur="SaveChange($event)" :invalid="!slotProps.data.priority && slotProps.data.priority !== 0" :pt="{root: { style: 'width: 100%' },input: { style: 'width: 100px' }}" class="MinInput" mode="decimal" :maxFractionDigits="5"/>
                </template>
              </Column>
              <Column field="timeDate" header="Время появления">
                <template #body="slotProps">
                  <Calendar v-model="slotProps.data.timeDate"  @date-select="ChangeTimeInput($event, 'time', slotProps.data.id)" @blur="ChangeTimeInput($event.value, 'time', slotProps.data.id)" :invalid="!slotProps.data.timeDate" dateFormat="yy-mm-dd" timeFormat="HH:mm:ss" showTime hourFormat="24" showIcon iconDisplay="input" inputId="datetime" showSeconds :manualInput="true"/>
                </template>
              </Column>
              <Column header="" :exportable="false" headerStyle="width: 3rem">
                <template #body="slotProps">
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" 
                    @click="slotProps.data.deleted = true; DeleteRow()"/>
                </template>
              </Column>
          </DataTable>
        </div>  
</div>
</template>
  
  <script>
import { PagesSettings } from './PagesSettings';
import { CreateDateTime } from '@/js/WorkWithDTime';
import XLSX from 'xlsx-js-style';

  export default {
    name: 'TargetDZZ',
    mixins: [PagesSettings],
    components:{},
    data(){
      return{
        viewmode: 'request',
        TabList: [{label:'Заявки ДЗЗ', value:'request'},{label:'Каталог целей', value: 'catalog'}],
        catalogUse: {},
        systemStatus: {typeWorkplace: null},
        datarequestКАList: [],
        choiceCriteriaArr: [{value: 1, lable: 'Время'},{value: 2, lable: 'Разворот'},{value: 3, lable: 'Качество'}],
        TypeRequest: [{value: 0, lable: 'НП'},{value: 1, lable: 'Лидер'}],
        arrNP: [],
        target:{}
      }
    },
    methods: {
      ChangeTimeInput(value, param, index){
        for (let i = 0; i < this.target[this.viewmode].length; i++) {
          if(this.target[this.viewmode][i].requestId == index || this.target[this.viewmode][i].id == index){
           this.target[this.viewmode][i][param] = Math.floor(Date.parse(value)/1000)
            break
          }
        }
        this.$ChangeTargets(this.viewmode)
      },
      async SaveChange(event){
        this.$ChangeTargets(this.viewmode)
        if(this.viewmode == 'catalog') this.$ChangeTargets('request',true)
        this.CreateCatalogUse()
      },
      AddRowCatalog(data){
        this.target.request.push({
              "catalog": data,
              "orderId": this.target.request.length + 1,
              "priory": 3,
              "term": this.systemStatus.modelingEnd,
              "time": this.systemStatus.modelingBegin,
              "earthPoint": this.arrNP[0].value,
              "choiceCriteria": 1,
              "filter": false,
              "deleted": null,
              "type": 0
        });   
        this.$ChangeTargets('request',true)
        this.CreateCatalogUse()
      },
      AddRow(){
        switch (this.viewmode) {
          case 'request':
            if(this.target.catalog.length < 1){
              this.$toast.add({ severity: 'warning', summary: 'Заявки', detail: "Нет целей в каталоге, пожалуйста создайте", life: 2500 });
              return;
            }
            this.target.request.push({
              "catalog": this.target.catalog[0],
              "orderId": this.target.request.length + 1,
              "priory": 3,
              "term": this.systemStatus.modelingEnd,
              "time": this.systemStatus.modelingBegin,
              "earthPoint": this.arrNP[0].value,
              "choiceCriteria": 1,
              "filter": false,
              "deleted": null,
              "type": 0
            });  
            break;   
          case 'catalog':
            this.target.catalog.push({
                    'goalId' : 0,
                    'goalName' : "", 'lat' : 0,
                    'lon' : 0, 'alt' : 0,
                    'deleted': false, 'role': "newRow"
                });   
            break;
          case 'datarequest':
            this.target.datarequest.push({
                "capacity": 100,
                "priority": 3,
                "time" : this.systemStatus.modelingBegin,
                "satellite":  {id: this.datarequestКАList[0].id},
                "deleted": null
            })
            break;
          default:
            break;
        }
        this.$ChangeTargets(this.viewmode,true)
        this.CreateCatalogUse()
      },
      DeleteAll(){
        this.target[this.viewmode].forEach(el => {el.deleted = true})
        this.DeleteRow()
        this.CreateCatalogUse()
      },
      DeleteRow(){
        this.$ChangeTargets(this.viewmode,true)
        if(this.viewmode == 'catalog') this.$ChangeTargets('request',true)
        this.CreateCatalogUse()
      },
      CreateCatalogUse(){
        this.catalogUse = {}
        this.target.catalog.forEach(el => {
          this.catalogUse[el.goalId] = 0
          this.target.request.forEach(rec => {
            if(rec.catalog.goalId == el.goalId)  this.catalogUse[el.goalId] += 1
          })
        })
      },
      exportExcel() {
          // 1. Получаем имя файла
          const headers = [];
          const fields = [];
          let filename = 'export'
          let data = []
          switch (this.viewmode) {
            case 'request':
              filename = this.$refs.dtDZZ.$props.exportFilename || 'export';
              this.$refs.dtDZZ.$slots.default()
                .filter(col => col.props?.exportable !== false)
                .forEach(col => {
                  headers.push(col.props?.header || col.props?.field);
                  fields.push(col.props?.field);
                  console.log(col)
                });
              data = this.target.request.map(row => {
                const newRow = {};
                fields.forEach(field => {
                  if(field == 'catalog') newRow.catalog = row.catalog.goalName
                  else if(field == 'lat') newRow.lat = row.catalog.lat
                  else if(field == 'lon') newRow.lon = row.catalog.lon
                  else if(field == 'termDate') newRow.termDate = CreateDateTime(row.term)
                  else if(field == 'timeDate') newRow.timeDate = CreateDateTime(row.time)
                  else if(field == 'choiceCriteria') newRow.choiceCriteria = this.choiceCriteriaArr[row.choiceCriteria-1].lable
                  else if(field == 'type') newRow.type = this.TypeRequest[row.type].lable
                  else newRow[field] = row[field];
                });
                return newRow;
              });
              break;
            case 'catalog':
              filename = this.$refs.dtDZZcatalog.$props.exportFilename || 'export';
              this.$refs.dtDZZcatalog.$slots.default()
                .filter(col => col.props?.exportable !== false)
                .forEach(col => {
                  headers.push(col.props?.header || col.props?.field);
                  fields.push(col.props?.field);
                });
              data = this.target.catalog.map(row => {
                const newRow = {};
                fields.forEach(field => {
                  newRow[field] = row[field];
                });
                return newRow;
              });
              break;
            case 'datarequest':
              filename = this.$refs.dtDZZdata.$props.exportFilename || 'export';
              this.$refs.dtDZZdata.$slots.default()
                .filter(col => col.props?.exportable !== false)
                .forEach(col => {
                  headers.push(col.props?.header || col.props?.field);
                  fields.push(col.props?.field);
                });
              data = this.target.datarequest.map(row => {
                const newRow = {};
                fields.forEach(field => {
                  if(field == 'satellite') newRow.satellite = row.satellite.name
                  else if(field == 'timeDate') newRow.timeDate = CreateDateTime(row.time)
                  else newRow[field] = row[field];
                });
                return newRow;
              });
              break;
            default:
              break;
          }
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
          XLSX.utils.sheet_add_aoa(worksheet, [styledHeaders], { origin: 'A1' });
          // 7. Сохраняем файл
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
          XLSX.writeFile(workbook, `${filename}.xlsx`);
        }
    },
    async mounted() {
      this.$showLoad(true)
      this.systemStatus = await this.$SystemObject().value
      if(this.systemStatus.typeWorkplace in {4:null, 5:null}){
        this.viewmode = 'datarequest'
        this.datarequestКАList = []
        const OGList = await this.$OGList()
        OGList.value.forEach(OG => {
          OG.satellites.forEach(element =>{
            this.datarequestКАList.push({id: element.satelliteId, name: element.name })
          })
        });
      }
      else{
        const NP = await this.$NPList()
        NP.value.forEach(element => {
          this.arrNP.push({value: element, lable: element.nameEarthPoint })
        })
      }
      this.target = await this.$Targets()
      this.CreateCatalogUse()
      this.$showLoad(false)
    },
  }
  </script>

<style lang="scss" scoped>

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
</style>
