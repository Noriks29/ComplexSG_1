<template>
  <div class="main_contain">
    <div сlass="HeaderContain">
        <Toolbar class="mb-4">
          <template #start>
            <FloatLabel>
              <Dropdown v-model="SelectKA" :options="KatypeList" @change="ChangeCluster($event)" optionLabel="lable" inputId="angle"  placeholder="Выберите кластер"/>
              <label for="angle" class="always-top">Выбранный КА</label>
            </FloatLabel>
          </template>
          <template #center>
            <TabMenu @tab-change="viewPanel = $event.index+1" :model="[
              {label:'Режимы'},{label:'Устройства'},{label:'Потребление энергии'},{label:'Параметры'}]" />
          </template>
        </Toolbar> 
      </div>
      <div class="ContentDiv" :class="modellingStatus?'DisableForModelling':''">
          <div v-if="viewPanel == 1">
              <p>Режимы функционирования</p>
              <DataTable :value="SelectKA.value.modes" class="p-datatable-sm" responsiveLayout="scroll" scrollable scrollHeight="50vh">
                <Column field="code" header="Код">
                  <template #body="{data}">{{ data.code || "не назван" }}</template>
                </Column>
                <Column field="flightMode" header="Режим полёта">
                  <template #body="{data}">{{ data.flightMode || "не назван" }}</template>
                </Column>
                <Column header="" :exportable="false" style="width: 3rem;">
                  <template #body="{data, index}">
                    <Button icon="pi pi-plus" class="p-button-text" severity="success" @click="AddRow('modes', index)"/>
                  </template>
                </Column>
                <Column header="Режим функционирования" style="min-width: 200px">
                  <template #body="{data}">
                    <div v-for="(mode, modeIndex) in data.operatingModes" :key="modeIndex">
                      <InputText v-model="mode.mode" @change="ChangeValue($event, 'modes', index)" />
                    </div>
                  </template>
                </Column>
                <Column header="Метод" style="min-width: 200px">
                  <template #body="{data}">
                    <div v-for="(mode, modeIndex) in data.operatingModes" :key="modeIndex">
                      <InputText v-model="mode.method" @change="ChangeValue($event, 'modes', index)" />
                    </div>
                  </template>
                </Column>
                <Column header="К">
                  <template #body="{data}">
                    <div v-for="(mode, modeIndex) in data.operatingModes" :key="modeIndex">
                      <InputNumber v-model="mode.coefficient" @change="ChangeValue($event, 'modes', index)" />
                    </div>
                  </template>
                </Column>
                <Column header="" :exportable="false" style="min-width: 3rem">
                  <template #body="{data, index}">
                    <div v-for="(mode, modeIndex) in data.operatingModes" :key="modeIndex" class="flex align-items-center">
                      <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="DeleteRow(modeIndex, 'modes', index)"/>
                    </div>
                  </template>
                </Column>
              </DataTable>

                  <p>Правила выбора режима полета, если интервалы времени пересекаются</p>
                  <DataTable :value="[{lable:'A и B', value: '-'},{lable:'A и C', value: '-'},{lable:'B и C', value: '-'}]"
                    tableStyle="min-width: 50rem" sortMode="multiple" stripedRows>
                    <Column field="lable" header="Пересечение режимов"/>
                    <Column field="value" header="Выполняется"/>
                  </DataTable>
          </div>

          <div v-if="viewPanel == 2">
              <p>Каталог устройств</p>
              <DataTable :value="SelectKA.value.devCatalogs" scrollable scrollHeight="50vh"
                tableStyle="min-width: 50rem" sortMode="multiple" stripedRows>
                <ColumnGroup type="header">
                  <Row>
                      <Column header="Использовать" headerStyle="width: 3rem"/>
                      <Column header="Прибор"/>
                      <Column headerStyle="text-align: right; width: 3rem">
                        <template #header>
                          <Button icon="pi pi-plus" class="p-button-sm" severity="success" label="Добавить" text @click="AddRow('devCatalogs')"/>
                        </template>
                      </Column>
                  </Row>
                </ColumnGroup>
                <Column header="Использовать" :exportable="false" headerStyle="width: 3rem">
                  <template #body="slotProps">
                    <Button icon="pi pi-plus" class="p-button-sm" severity="success" text @click="AddRow('devices',slotProps.data)" v-if="slotProps.data.use < 1"/>
                  </template>
                </Column>
                <Column field="nameDevice" header="Прибор" sortable>
                  <template #body="slotProps"><div class="narrow-input-container">
                    <InputText 
                      v-model="slotProps.data.nameDevice" 
                      @input="ChangeValue(slotProps.data, 'devCatalogs')"
                    /></div>
                  </template>
                </Column>
                <Column header="" :exportable="false" style="width: 3rem; text-align: end;">
                  <template #body="slotProps">
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" 
                      @click="slotProps.data.deleted = true; DeleteRow(index, 'devices')"/>
                  </template>
                </Column>
              </DataTable>
            
              <p>Устройства</p>
              <DataTable :value="SelectKA.value.devices" scrollable scrollHeight="50vh"
                tableStyle="min-width: 50rem" sortMode="multiple" stripedRows
                ref="dt" :exportFilename="'Параметры_КА_' + new Date().toISOString().slice(0, 10)">
                <Column field="devCatalog.nameDevice" header="Прибор" :sortable="true" />
                <Column field="constant" header="Свойство">
                  <template #body="slotProps" >
                    <SelectButton v-model="slotProps.data.constant" :options="[{value: true, name:'='},{value: false, name:'~'}]" optionLabel="name" optionValue="value" aria-labelledby="basic" @change="ChangeValue($event, 'property')"/>
                  </template>
                </Column>
                <Column header="" :exportable="false" headerStyle="width: 3rem">
                  <template #body="slotProps">
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" 
                      @click="slotProps.data.deleted = true; DeleteRow(index, 'devices')"/>
                  </template>
                </Column>
              </DataTable>
          </div>

            <DataTable :value="SelectKA.value.devices" v-if="viewPanel == 3" scrollable scrollHeight="65vh"
                tableStyle="min-width: 50rem" sortMode="multiple" stripedRows
                ref="dt" :exportFilename="'Параметры_КА_' + new Date().toISOString().slice(0, 10)">
                <ColumnGroup type="header">
                  <Row>
                      <Column header="Прибор" :rowspan="2" />
                      <Column :header="data.flightMode" v-for="data, index in SelectKA.value.modes" :key="index" :colspan="data.operatingModes.length" />
                  </Row>
                  <Row>
                      <Column :header="data.mode" v-for="data, index in SelectKA.modesList" :key="index"/>
                  </Row>
                </ColumnGroup>
                <Column field="devCatalog.nameDevice" header=""/>
                <Column field="dataMode" header="" v-for="dataMode, indexMode in SelectKA.modesList" :key="indexMode">
                  <template #body="slotProps" ><div class="narrow-input-container">
                    <InputNumber v-model="SelectKA.ChargeTable[slotProps.data.devCatalog.id][dataMode.id]" @input="ChangeValue($event, 'charge', slotProps.data.devCatalog.id, dataMode.id)" :invalid="!SelectKA.ChargeTable[slotProps.data.devCatalog.id][dataMode.id] && SelectKA.ChargeTable[slotProps.data.devCatalog.id][dataMode.id]!=0" :pt="{root: { style: 'width: 100%' },input: { style: 'width: 100px' }}" class="MinInput" mode="decimal" :maxFractionDigits="5"/>
                  </div></template>
                </Column>
                <ColumnGroup type="footer">
                  <Row>
                      <Column footer="Сумма:"/>
                      <Column :footer="SelectKA.ChargeTableSum[dataMode.id]"  v-for="dataMode, indexMode in SelectKA.modesList" :key="indexMode"/>
                  </Row>
                </ColumnGroup>
              </DataTable>


              <DataTable :value="dataParamOperating" rowGroupMode="subheader" groupRowsBy="group" v-if="viewPanel == 4" scrollable scrollHeight="65vh"
                tableStyle="min-width: 50rem" sortMode="multiple" stripedRows
                ref="dt" :exportFilename="'Параметры_КА_' + new Date().toISOString().slice(0, 10)">
                <Column field="group" header=""/>
                <template #groupheader="slotProps">
                  <p style="font-weight: bold; text-align: center; margin: 0;">{{ slotProps.data.group }}</p>
                </template>
                <Column field="name" header=""/>
                <Column field="param" header="">
                  <template #body="slotProps" >
                    <InputNumber v-model="SelectKA.value.operatingParameter[slotProps.data.param]" @input="ChangeParamKa" showButtons :invalid="!SelectKA.value.operatingParameter[slotProps.data.param] && SelectKA.value.operatingParameter[slotProps.data.param] !== 0" :disabled="!slotProps.data.param" mode="decimal" :maxFractionDigits="5"/>
                  </template>
                </Column>
                <Column field="value" header="">
                  <template #body="slotProps" >
                    <span v-html="slotProps.data.value"></span>
                  </template>
                </Column>
              </DataTable>
        </div>
  </div>
</template>

<script>
import { PagesSettings } from './PagesSettings.js';

export default {
  name: 'KAInfo',
  mixins: [PagesSettings],
  data(){
      return{
          dataJson: [],
          KatypeList: [],
          SelectKA: {
            value:{
                description: ""
            },
          },
          viewPanel: 1,
          dataParamOperating:[
            {param:'acceleration',group:'Параметры разворота', name:'Ускорение / замедление КА', value:'гр/с<sup>2</sup>'},
            {param:'maxRotationSpeed',group:'Параметры разворота', name:'Максимальная скорость вращения КА', value:'гр/с'},
            {param:'stabilizationTime',group:'Параметры разворота', name:'Время стабилизации', value:'с'},
            {param:'dataTransferSatSat',group:'Скорость передачи данных', name:'Скорость передачи данных КА - КА', value:'Мб/с'},
            {param:'dataTransferEarthSat',group:'Скорость передачи данных', name:'Скорость передачи данных КА - НП', value:'Мб/с'},
            {param:'lurch',group:'Максимальные углы съемки', name:'Крен', value:'	Гр.'},
            {param:'pitch',group:'Максимальные углы съемки', name:'Тангаж', value:'	Гр.'},
            {param:'maxPowerGenerated',group:'Солнечные панели', name:'Генерируемая мощность при ориентации на Солнце', value:'Вт/м<sup>2</sup>'},
            {param:'averagePowerGenerates',group:'Солнечные панели', name:'Средняя генерируемая мощность', value:'Вт/м<sup>2</sup>'},
            {param:'squareSolarPanels',group:'Солнечные панели', name:'Площадь солнечных панелей', value:'м<sup>2</sup>'},
            {param:'efficiencySolarPanels',group:'Солнечные панели', name:'КПД солнечных панелей', value:'%'},
            {param:'accCapacity',group:'Аккумуляторная батарея', name:'Емкость', value:'А-ч'},
            {param:'voltage',group:'Аккумуляторная батарея', name:'Напряжение', value:'В'},
            {param:'minCharge',group:'Аккумуляторная батарея', name:'Порог минимального разряда', value:'%'},
            {param:'maxPowerOfElectromagnet',group:'Электромагниты', name:'Максимальная потребляемая мощность', value:'Вт-ч'},
            {param:'maxMagneticMoment',group:'Электромагниты', name:'Максимальный создаваемый магнитный момент', value:'А·м<sup>2</sup>'},
            {param:'maxControlMomentOfWheels',group:'Маховики', name:'Максимальный управляющий момент маховика', value:'Н·м'},
            {param:'maxInertiaMomentOfWheels',group:'Маховики', name:'Максимальный момент инерции маховика', value:'Н·м·с'},
            {param:'',group:'Маховики', name:'Момент инерции ротора маховика (не активно)', value:'кг·м<sup>2</sup>'},
            {param:'memory',group:'Память', name:'Объем памяти КА', value:'ГБ'},
            {param:'shootingDataVolume',group:'Память', name:'Объем заявки', value:'ГБ'},
            {param:'typeSensor',group:'Сенсоры', name:'typeSensor', value:'??'},
            {param:'durationShooting',group:'Сенсоры', name:'Продолжительность сьёмки', value:'сек.'},
          ]
      }
  },
  components:{},
  methods:{
      async ChangeKA(data){
          if(data.value == "add"){
            await this.$FetchGet("/api/v1/modelsat/add")
            this.ReFerchKA(undefined)
          }
          else{
            this.SelectKA = {lable: data.value.modelName, value: data.value}
            this.SelectKA.value.devCatalogs.forEach(device => {
              device.use = 0;
              this.SelectKA.value.devices.forEach(deviceUse => {
                if(deviceUse.devCatalog.id == device.id) device.use = 1
              })
            })
            alert("Ошибка построения зарядов")
            //this.BuildCharges() вызывает ошибку надо поправить
          }
      },
      async ChangeValue(event, category, parentIndex=0, id){
        switch (category) {
          case 'property':
              await this.$FetchPost("/api/v1/modelsat/update/devices", this.SelectKA.value.devices)
            break;
          case 'devCatalogs':
              await this.$FetchPost("/api/v1/modelsat/update/devCatalog", this.SelectKA.value.devCatalogs)
            break;
          case 'modes':
              await this.$FetchPost("/api/v1/modelsat/update/modes", this.SelectKA.value.modes)
            break;
          case 'charge':
              for (let i = 0; i < this.SelectKA.value.charges.length; i++) {
                const chargeKa = this.SelectKA.value.charges[i];
                if(chargeKa.flightModeId == id && chargeKa.deviceId == parentIndex){
                  chargeKa.charge = event.value
                  await this.$FetchPost("/api/v1/modelsat/update/charges", [chargeKa])
                  break
                }
              }
            break;
          default:
            break;
        }
        await this.ReFerchKA(this.SelectKA.value.id)
      },
      async AddRow(category, data=null){
        switch (category) {
          case "devCatalogs":
            this.SelectKA.value.devCatalogs.push({"nameDevice": "null","modelId": this.SelectKA.value.id})
            await this.$FetchPost("/api/v1/modelsat/update/devCatalog", this.SelectKA.value.devCatalogs)
            break;
          case "devices":
            this.SelectKA.value.devices.push({"devCatalog": data,"modelId": this.SelectKA.value.id,"property": 0})
            await this.$FetchPost("/api/v1/modelsat/update/devices", this.SelectKA.value.devices)
            break;
          case 'modes':
            this.SelectKA.value.modes[data].operatingModes.push({"coefficient": 1,"method": 1,"mode": "null"})
            await this.$FetchPost("/api/v1/modelsat/update/modes", this.SelectKA.value.modes)
            break;
          default:
            break;
        }
        await this.ReFerchKA(this.SelectKA.value.id)
      },
      async DeleteRow(index, category, parentIndex = 0){
        switch (category) {
          case "devCatalogs":
            this.SelectKA.value.devCatalogs[index].deleted = true
            await this.$FetchPost("/api/v1/modelsat/update/devCatalog", this.SelectKA.value.devCatalogs)
            break;
          case 'devices':
            await this.$FetchPost("/api/v1/modelsat/update/devices", this.SelectKA.value.devices)
            break;
          case 'modes':
            this.SelectKA.value.modes[parentIndex].operatingModes[index].deleted = true
            await this.$FetchPost("/api/v1/modelsat/update/modes", this.SelectKA.value.modes)
            break;
          default:
            break;
        }
        await this.ReFerchKA(this.SelectKA.value.id)
      },
      async ChangeParamKa(){
        await this.$FetchPost("/api/v1/modelsat/update/parameters", this.SelectKA.value.operatingParameter)
      },
      async ReFerchKA(index){
        let result = await this.$FetchGet('/api/v1/modelsat/all')
        this.KatypeList = []
        result.forEach(element => {
          element.charges.sort((a,b) => {
            if(a.deviceId - b.deviceId == 0)
              return a.flightModeId - b.flightModeId
            return a.deviceId - b.deviceId
          })
          this.KatypeList.push({lable: element.modelName, value: element})
        })
        this.KatypeList.push({lable:"Добавить модель", value: "add"})
        if(index != undefined){
          this.KatypeList.forEach(KA => {if(KA.value.id == index) this.SelectKA = KA})
        }
        else{this.SelectKA = this.KatypeList[0]}
        
        this.SelectKA.value.devCatalogs.forEach(device => {
              device.use = 0;
              this.SelectKA.value.devices.forEach(deviceUse => {
                if(deviceUse.devCatalog.id == device.id)
                  device.use = 1
              })
            })
        
        this.BuildCharges()
      },
      BuildCharges(){
        this.SelectKA.modesList = [];
        this.SelectKA.value.modes.forEach(mode => {
          this.SelectKA.modesList = this.SelectKA.modesList.concat(mode.operatingModes)
        })
        this.SelectKA.ChargeTable = {}
        let chargeDeviceSum = {}
        this.SelectKA.value.charges.forEach(charge => {
          if(!(charge.deviceId in this.SelectKA.ChargeTable)) this.SelectKA.ChargeTable[charge.deviceId] = {}
          this.SelectKA.ChargeTable[charge.deviceId][charge.flightModeId] = charge.charge
          if(chargeDeviceSum[charge.flightModeId]!=undefined) chargeDeviceSum[charge.flightModeId] += charge.charge
          else chargeDeviceSum[charge.flightModeId]=charge.charge
        })
        this.SelectKA.ChargeTableSum = chargeDeviceSum
        
        console.log(this.SelectKA.ChargeTable, this.SelectKA.modesList,chargeDeviceSum, "charge")
      }
  },
  mounted(){
    this.ReFerchKA(undefined)
  }
}
</script>

<style lang="scss" scoped>
.always-top {
    top: 0.1rem !important;
    left: 0.2rem !important;
    font-size: 0.875rem !important;
}

.narrow-input-container {
  width: 100%;
  display: flex;
  justify-content: center;
  .p-inputnumber, .p-inputtext {//контроль размеров инпута
    width: 100px !important;
    min-width: 100%;
    flex-direction: column;
  }
}
</style>


  
