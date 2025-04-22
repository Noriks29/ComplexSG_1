<template>
  <div class="main_contain RowSection">
      <div>
          <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
            <img src="../../assets/exit.svg">
          </button>
          <h1 class="TitleText">Информация о КА</h1>
        </div>
      <div class="ContentDiv">
          <div class="Panel Select LeftPanel" >
              <p>Выбор КА</p>
              <SelectDiv :dataOption="KatypeList" :valueS="SelectKA"  @valueSelect="ChangeKA"/>
              <p>Информация</p>
              <div @click="viewPanel = 1" class="ButtonCommand"  :class="viewPanel==1 ? 'SelectPage': ''">• Режимы функционирования</div>
              <div @click="viewPanel = 2" class="ButtonCommand" :class="viewPanel==2 ? 'SelectPage': ''">• Устройства</div>
              <div @click="viewPanel = 3" class="ButtonCommand" :class="viewPanel==3 ? 'SelectPage': ''">• Потребление энергии устройствами</div>
              <div @click="viewPanel = 4" class="ButtonCommand" :class="viewPanel==4 ? 'SelectPage': ''">• Параметры устройств и функционирования</div>
          </div>
          <div class="Panel RightPanel">
          <div v-if="viewPanel == 1">
              <p>Режимы функционирования</p>
              <div>
                  <div>
                    <table class="TableDefault">
                      <thead><tr><th>Код</th><th>Режим полёта</th><th>Режим функционирования</th><th>Метод</th><th>К</th><th></th></tr></thead>
                      <tbody v-for="data, index in SelectKA.value.modes" :key="index">
                        <tr><td rowspan="0">{{ data.code || "не назван" }}</td><td rowspan="0">{{ data.flightMode || "не назван" }}</td></tr>
                        <tr v-for="dataModes, indexModes in data.operatingModes" :key="indexModes" @change="ChangeValue($event, 'modes', index)">
                          <td><input v-model="dataModes.mode"></td>
                          <td><input v-model="dataModes.method"></td>
                          <td><input type="number" v-model="dataModes.coefficient"></td>
                          <td :id="index" @click="DeleteRow(indexModes, 'modes', index)" class="delete"><img class="iconDelete" src="../../assets/delete.svg" alt="-"></td>
                        </tr>
                        <tr><td colspan="6" @click="AddRow('modes',index)">...................................</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p>Правила выбора режима полета, если интервалы времени пересекаются</p>
                  <div>
                    <table class="TableDefault">
                      <thead><tr><th>Пересечение режимов</th><th>Выполняется</th></tr></thead>
                      <tbody><tr><th>A и B</th><td>выбор 1</td></tr>
                      <tr><th>A и C</th><td>выбор 2</td></tr>
                      <tr><th>B и C</th><td>выбор 3</td></tr></tbody>
                    </table>
                  </div>
              </div>
          </div>

          <div v-if="viewPanel == 2">
              <p>Каталог устройств</p>
              <table class="TableDefault">
                <thead><tr><th style="width: 0px;">Использовать</th><th>Прибор</th><th></th></tr></thead>
                <tbody><tr v-for="data,index in SelectKA.value.devCatalogs" :key="index" :id="data.id">
                  <td><img @click="AddRow('devices',data)" src="../../assets/add.png" alt="" class="addButtonIcon" v-if="data.use < 1"></td>
                  <td><input @change="ChangeValue($event, 'devCatalogs')" v-model="data.nameDevice"></td>
                  <td @click="DeleteRow(index, 'devCatalogs')" class="delete"><img class="iconDelete" src="../../assets/delete.svg" alt="-"></td>
                </tr>
                <tr class="addRowButton">
                  <td colspan="3"><button @click="AddRow('devCatalogs')"><img src="../../assets/add.png" alt="" class="addButtonIcon">Добавить</button></td>
                </tr></tbody>
              </table>

              <p>Устройства</p>
              <table class="TableDefault"><thead>
                <tr><th>Прибор</th><th style="width: 0px;">Свойство</th><th></th></tr></thead>
                <tbody><tr v-for="data,index in SelectKA.value.devices" :key="index" :id="data.id">
                  <td>{{ data.devCatalog.nameDevice || "null"}}</td>
                  <td><input type="checkbox" v-model="data.constant" @change="ChangeValue($event, 'property')"/>
                      <label>{{ data.constant ? "=" : "~" }}</label></td>
                  <td @click="DeleteRow(index, 'devices')" class="delete"><img class="iconDelete" src="../../assets/delete.svg" alt="-"></td>
                </tr></tbody>
              </table>
          </div>
          <div v-if="viewPanel == 3">
              <p>Потребление энергии устройствами </p>
              <div>
                <table class="TableDefault" id="TableChargeKA"><tbody>
                  <tr>
                    <th rowspan="2">Прибор</th>
                    <th v-for="data, index in SelectKA.modesList" :key="index">{{ data.mode }}</th>
                  </tr>
                  <tr><th v-for="data, index in SelectKA.value.modes" :key="index" :colspan="data.operatingModes.length">{{ data.flightMode }}</th></tr>
                  <tr v-for="data, index in SelectKA.value.devices" :key="index" :id="data.devCatalog.id">
                    <td>{{ data.devCatalog.nameDevice }}</td>
                    <td v-for="dataMode, indexMode in SelectKA.modesList" :key="indexMode">
                      <input type="number" @change="ChangeValue($event, 'charge', data.devCatalog.id)" :id="dataMode.id" :name="data.devCatalog.id" :value="SelectKA.ChargeTable[data.devCatalog.id][dataMode.id]" step="0.1" :class="SelectKA.ChargeTable[data.devCatalog.id][dataMode.id] == undefined ? 'null':''"/>
                    </td>
                  </tr></tbody>
                </table>
              </div>
          </div>
          <div v-if="viewPanel == 4">
              <p>Параметры функционирования</p>
              <div>
                  <table class="TableDefault" @change="ChangeParamKa">
                    <tbody>
                      <tr><th colspan="3">Параметры разворота</th></tr>
                          <tr><td>Ускорение / замедление КА</td><td><input type="number" v-model="SelectKA.value.operatingParameter.acceleration"></td><td>гр/с<sup>2</sup></td></tr>
                          <tr><td>Максимальная скорость вращения КА</td><td><input type="number" v-model="SelectKA.value.operatingParameter.maxRotationSpeed"></td><td>гр/с</td></tr>
                          <tr><td>Время стабилизации</td><td><input type="number" v-model="SelectKA.value.operatingParameter.stabilizationTime"></td><td>с</td></tr>
                      <tr><th colspan="3">Скорость передачи данных</th></tr>
                          <tr><td>Скорость передачи данных КА - КА</td><td><input type="number" v-model="SelectKA.value.operatingParameter.dataTransferSatSat"></td><td>Мб/с</td></tr>
                          <tr><td>Скорость передачи данных КА - НП</td><td><input type="number" v-model="SelectKA.value.operatingParameter.dataTransferEarthSat"></td><td>Мб/с</td></tr>
                      <tr><th colspan="3">Максимальные углы съемки</th></tr>
                          <tr><td>Крен</td><td><input type="number" v-model="SelectKA.value.operatingParameter.lurch"></td><td>Гр.</td></tr>
                          <tr><td>Тангаж</td><td><input type="number" v-model="SelectKA.value.operatingParameter.pitch"></td><td>Гр.</td></tr>
                      <tr><th colspan="3">Солнечные панели</th></tr>
                          <tr><td>Генерируемая мощность при ориентации на Солнце</td><td><input type="number" v-model="SelectKA.value.operatingParameter.maxPowerGenerated"></td><td>Вт/м<sup>2</sup></td></tr>
                          <tr><td>Средняя генерируемая мощность</td><td><input type="number" v-model="SelectKA.value.operatingParameter.averagePowerGenerates"></td><td>Вт/м<sup>2</sup></td></tr>
                          <tr><td>Площадь солнечных панелей</td><td><input type="number" v-model="SelectKA.value.operatingParameter.squareSolarPanels"></td><td>м<sup>2</sup></td></tr>
                          <tr><td>КПД солнечных панелей</td><td><input type="number" v-model="SelectKA.value.operatingParameter.efficiencySolarPanels"></td><td>%</td></tr>                     
                      <tr><th colspan="3">Аккумуляторная батарея</th></tr>
                          <tr><td>Емкость</td><td><input type="number" v-model="SelectKA.value.operatingParameter.accCapacity"></td><td>А-ч</td></tr>
                          <tr><td>Напряжение</td><td><input type="number" v-model="SelectKA.value.operatingParameter.voltage"></td><td>В</td></tr>
                          <tr><td>Порог минимального разряда</td><td><input type="number" v-model="SelectKA.value.operatingParameter.minCharge"></td><td>%</td></tr>
                      <tr><th colspan="3">Электромагниты</th></tr>
                          <tr><td>Максимальная потребляемая мощность</td><td><input type="number" v-model="SelectKA.value.operatingParameter.maxPowerOfElectromagnet"></td><td>Вт-ч</td></tr>
                          <tr><td>Максимальный создаваемый магнитный момент</td><td><input type="number" v-model="SelectKA.value.operatingParameter.maxMagneticMoment"></td><td>А·м<sup>2</sup></td></tr>
                      <tr><th colspan="3">Маховики</th></tr>
                          <tr><td>Максимальный управляющий момент маховика</td><td><input type="number" v-model="SelectKA.value.operatingParameter.maxControlMomentOfWheels"></td><td>Н·м</td></tr>
                          <tr><td>Максимальный момент инерции маховика</td><td><input type="number" v-model="SelectKA.value.operatingParameter.maxInertiaMomentOfWheels"></td><td>Н·м·с</td></tr>
                          <tr><td>Момент инерции ротора маховика (не активно)</td>
                          <td><input type="number" :value="0"></td><td>кг·м<sup>2</sup></td></tr>     
                      <tr><th colspan="3">Память</th></tr>
                          <tr><td>Объем памяти КА</td><td><input type="number" v-model="SelectKA.value.operatingParameter.memory"></td><td>ГБ</td></tr>
                        <tr><td>Объем заявки</td><td><input type="number" v-model="SelectKA.value.operatingParameter.shootingDataVolume"></td><td>ГБ</td></tr>
                      <tr><th colspan="3">Сенсоры</th></tr>
                          <tr><td>typeSensor</td><td><input type="number" v-model="SelectKA.value.operatingParameter.typeSensor"></td><td>??</td></tr>
                          <tr><td>Продолжительность сьёмки</td><td><input type="number" v-model="SelectKA.value.operatingParameter.durationShooting"></td><td>сек.</td></tr>
                  </tbody></table>
              </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { FetchGet, FetchPost } from "@/js/LoadDisplayMetod";
import SelectDiv from '../SelectDiv.vue';
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
          viewPanel: 1
      }
  },
  components:{
      SelectDiv
  },
  methods:{
      async ChangeKA(data){
          if(data.value == "add"){
            await FetchGet("/api/v1/modelsat/add")
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
      async ChangeValue(event, category, parentIndex=0){
        console.log(event)
        switch (category) {
          case 'property':
              await FetchPost("/api/v1/modelsat/update/devices", this.SelectKA.value.devices)
            break;
          case 'devCatalogs':
              await FetchPost("/api/v1/modelsat/update/devCatalog", this.SelectKA.value.devCatalogs)
            break;
          case 'modes':
              await FetchPost("/api/v1/modelsat/update/modes", this.SelectKA.value.modes)
            break;
          case 'charge':
              for (let i = 0; i < this.SelectKA.value.charges.length; i++) {
                const chargeKa = this.SelectKA.value.charges[i];
                if(chargeKa.flightModeId == event.target.id && chargeKa.deviceId == parentIndex){
                  chargeKa.charge = event.target.value
                  await FetchPost("/api/v1/modelsat/update/charges", [chargeKa])
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
            await FetchPost("/api/v1/modelsat/update/devCatalog", this.SelectKA.value.devCatalogs)
            break;
          case "devices":
            this.SelectKA.value.devices.push({"devCatalog": data,"modelId": this.SelectKA.value.id,"property": 0})
            await FetchPost("/api/v1/modelsat/update/devices", this.SelectKA.value.devices)
            break;
          case 'modes':
            this.SelectKA.value.modes[data].operatingModes.push({"coefficient": 1,"method": 1,"mode": "null"})
            await FetchPost("/api/v1/modelsat/update/modes", this.SelectKA.value.modes)
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
            await FetchPost("/api/v1/modelsat/update/devCatalog", this.SelectKA.value.devCatalogs)
            break;
          case 'devices':
            this.SelectKA.value.devices[index].deleted = true
            await FetchPost("/api/v1/modelsat/update/devices", this.SelectKA.value.devices)
            break;
          case 'modes':
            this.SelectKA.value.modes[parentIndex].operatingModes[index].deleted = true
            await FetchPost("/api/v1/modelsat/update/modes", this.SelectKA.value.modes)
            break;
          default:
            break;
        }
        await this.ReFerchKA(this.SelectKA.value.id)
      },
      async ChangeParamKa(){
        await FetchPost("/api/v1/modelsat/update/parameters", this.SelectKA.value.operatingParameter)
      },
      async ReFerchKA(index){
        let result = await FetchGet('/api/v1/modelsat/all')
        this.KatypeList = []
        result.forEach(element => {this.KatypeList.push({lable: element.modelName, value: element})})
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
        this.SelectKA.value.charges.forEach(charge => {
          if(!(charge.deviceId in this.SelectKA.ChargeTable)) this.SelectKA.ChargeTable[charge.deviceId] = {}
          this.SelectKA.ChargeTable[charge.deviceId][charge.flightModeId] = charge.charge
        })
      }
  },
  mounted(){
    this.ReFerchKA(undefined)
  }
}
</script>

<style lang="scss" scoped>
  .Panel{
      .ButtonCommand{
        &.SelectPage{
            background-color: #80808053;
        }
      }
      &.Select{
        text-align: left;
      }
  }
#TableChargeKA{
  .null{
    background-color: #ff000063;
  }
}

</style>


  
