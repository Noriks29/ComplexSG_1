<template>
  <div class="main_contain">
      <div>
          <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
            <img src="../../assets/exit.svg">
          </button>
        </div>

      
      <div class="ContentDiv">
       
          <div class="Panel Select" >
            <h1 class="TitleText">Информация о КА</h1>
              <p>Выбор КА</p>
              <SelectDiv  :dataOption="KatypeList" :valueS="SelectKA"  @valueSelect="ChangeKA"/>

              <p>Информация</p>
              <div @click="viewPanel = 1" class="ButtonPage" :class="viewPanel==1 ? 'SelectPage': ''">• Режимы функционирования</div>
              <div @click="viewPanel = 2" class="ButtonPage" :class="viewPanel==2 ? 'SelectPage': ''">• Устройства</div>
              <div @click="viewPanel = 3" class="ButtonPage" :class="viewPanel==3 ? 'SelectPage': ''">• Потребление энергии устройствами</div>
              <div @click="viewPanel = 4" class="ButtonPage" :class="viewPanel==4 ? 'SelectPage': ''">• Параметры устройств и функционирования</div>
          </div>

          <div class="Panel" v-if="viewPanel == 1">
              <p> Режимы функционирования </p>
              <div>
                  <div>
                    <table class="TableDefault">
                      <tr>
                        <th>Код</th><th>Режим полёта</th><th>Режим функционирования</th><th>Метод</th><th>К</th><th></th>
                      </tr>
                      <tbody v-for="data, index in SelectKA.value.modes" :key="index">
                        <tr>
                          <td rowspan="0">{{ data.code || "не назван" }}</td> <td rowspan="0">{{ data.flightMode || "не назван" }}</td>
                        </tr>
                        <tr v-for="dataModes, indexModes in data.operatingModes" :key="indexModes">
                          <td><input :id="indexModes" name="mode" @change="ChangeValue($event, 'modes', index)"
                            :value="dataModes.mode || 0"></td>
                          <td><input :id="indexModes" name="method" @change="ChangeValue($event, 'modes', index)"
                            :value="dataModes.method || 0"></td>
                          <td><input :id="indexModes" type="number" name="coefficient" @change="ChangeValue($event, 'modes', index)"
                            :value="dataModes.coefficient || 0"></td>
                          <td :id="index" @click="DeleteRow(indexModes, 'modes')"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
                        </tr>
                        <tr><td colspan="4" @click="AddRow('modes',index)">........</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p>Правила выбора режима полета, если интервалы времени пересекаются</p>
                  <div style="margin-top: 20px;">
                    <table class="TableDefault">
                      <tr>
                        <th>Пересечение режимов</th><th>Выполняется</th>
                      </tr>
                      <tr><th>A и B</th><td>выбор 1</td></tr>
                      <tr><th>A и C</th><td>выбор 2</td></tr>
                      <tr><th>B и C</th><td>выбор 3</td></tr>
                    </table>
                  </div>
              </div>
          </div>

          <div class="Panel" v-if="viewPanel == 2">
              <p> Каталог устройств </p>
              <table class="TableDefault">
                <tr><th></th><th>Прибор</th><th></th></tr>
                <tr v-for="data,index in SelectKA.value.devCatalogs" :key="index" :id="data.id">
                  <td><img @click="AddRow('devices',data)" src="../../assets/add.png" alt="" class="addButtonIcon" v-if="data.use < 1"></td>
                  <td><input :id="index" name="nameDevice" @change="ChangeValue($event, 'devCatalogs')"
                    :value="data.nameDevice || 'null'"></td>
                  <td :id="index" @click="DeleteRow(index, 'devCatalogs')"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
                </tr>
                <tr class="addRowButton">
                  <td colspan="3"><button @click="AddRow('devCatalogs')">
                    <img src="../../assets/add.png" alt="" class="addButtonIcon">
                    Добавить
                  </button></td>
                </tr> 
              </table>

              <p>Устройства</p>
              <table class="TableDefault">
                <tr><th>Прибор</th><th>Свойство</th><th></th></tr>
                <tr v-for="data,index in SelectKA.value.devices" :key="index" :id="data.id">
                  <td>{{ data.devCatalog.nameDevice || "null"}}</td>
                  <td><input type="checkbox" :id="index" name="property" :checked="data.property" @change="ChangeValue($event, 'property')"/>
                      <label>{{ data.property ? "~" : "=" }}</label></td>
                  <td :id="index" @click="DeleteRow(index, 'devices')"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
                </tr>
              </table>
          </div>
          <div class="Panel" v-if="viewPanel == 3">
              <p>Потребление энергии устройствами </p>
              <div>
                <table class="TableDefault PanelDefault">
                  <tr>
                    <th rowspan="2">Прибор</th>
                    <th v-for="data, index in SelectKA.modesList" :key="index">{{ data.mode }}</th>
                  </tr>
                  <tr>
                    <th v-for="data, index in SelectKA.value.modes" :key="index" :colspan="data.operatingModes.length">{{ data.flightMode }}</th>
                  </tr>
                  <tr v-for="data, index in SelectKA.value.devices" :key="index">
                    <td>{{ data.devCatalog.nameDevice }}</td>
                    <td v-for="dataMode, indexMode in SelectKA.modesList" :key="indexMode" :id="dataMode.id">
                      0
                    </td>
                  </tr>
                </table>

              </div>
          </div>
          <div class="Panel" v-if="viewPanel == 4">
              <p>Параметры функционирования</p>
              <div>
                  <table class="TableDefault PanelDefault" @change="ChangeParamKa">
                      <tr><th colspan="3">Параметры разворота</th></tr>
                          <tr><td>Ускорение / замедление КА</td>
                              <td><input type="number" id="acceleration" :value="SelectKA.value.operatingParameter.acceleration || 0"></td><td>гр/с<sup>2</sup></td></tr>
                          <tr><td>Максимальная скорость вращения КА</td>
                            <td><input type="number" id="maxRotationSpeed" :value="SelectKA.value.operatingParameter.maxRotationSpeed || 0"></td><td>гр/с</td></tr>
                          <tr><td>Время стабилизации</td>
                            <td><input type="number" id="stabilizationTime" :value="SelectKA.value.operatingParameter.stabilizationTime"></td><td>с</td></tr>
                      <tr><th colspan="3">Скорость передачи данных</th></tr>
                          <tr><td>Скорость передачи данных КА - КА</td>
                            <td><input type="number" id="dataTransferSatSat" :value="SelectKA.value.operatingParameter.dataTransferSatSat"></td><td>Мб/с</td></tr>
                          <tr><td>Скорость передачи данных КА - НП</td>
                            <td><input type="number" id="dataTransferEarthSat" :value="SelectKA.value.operatingParameter.dataTransferEarthSat"></td><td>Мб/с</td></tr>
                      <tr><th colspan="3">Максимальные углы съемки</th></tr>
                          <tr><td>Крен</td>
                            <td><input type="number" id="lurch" :value="SelectKA.value.operatingParameter.lurch"></td><td>Гр.</td></tr>
                          <tr><td>Тангаж</td>
                            <td><input type="number" id="pitch" :value="SelectKA.value.operatingParameter.pitch"></td><td>Гр.</td></tr>
                      <tr><th colspan="3">Солнечные панели</th></tr>
                          <tr><td>Генерируемая мощность при ориентации на Солнце</td>
                            <td><input type="number" id="" :value="0"></td><td> Вт/м<sup>2</sup></td></tr>
                          <tr><td>Средняя генерируемая мощность</td>
                            <td><input type="number" id="" :value="0"></td><td>Вт/м<sup>2</sup></td></tr>
                          <tr><td>Площадь солнечных панелей</td>
                            <td><input type="number" id="" :value="0"></td><td>м<sup>2</sup></td></tr>
                          <tr><td>КПД солнечных панелей</td>
                            <td><input type="number" id="" :value="0"></td><td>%</td></tr>
                      
                      <tr><th colspan="3">Аккумуляторная батарея</th></tr>
                          <tr><td>Емкость</td>
                            <td><input type="number" id="accCapacity" :value="SelectKA.value.operatingParameter.accCapacity"></td><td>А-ч</td></tr>
                          <tr><td>Напряжение</td>
                            <td><input type="number" id="" :value="0"></td><td>В</td></tr>
                          <tr><td>Порог минимального разряда</td>
                            <td><input type="number" id="minCharge" :value="SelectKA.value.operatingParameter.minCharge"></td><td>%</td></tr>

                      <tr><th colspan="3">Электромагниты</th></tr>
                          <tr><td>Максимальная потребляемая мощность</td>
                            <td><input type="number" id="" :value="0"></td><td>Вт-ч</td></tr>
                          <tr><td>Максимальный создаваемый магнитный момент</td>
                            <td><input type="number" id="" :value="0"></td><td>А·м<sup>2</sup></td></tr>

                      <tr><th colspan="3">Маховики</th></tr>
                          <tr><td>Максимальный управляющий момент маховика</td>
                            <td><input type="number" id="" :value="0"></td><td>Н·м</td></tr>
                          <tr><td>Максимальный момент инерции маховика</td>
                            <td><input type="number" id="" :value="0"></td><td>Н·м·с</td></tr>
                          <tr><td>Момент инерции ротора маховика</td>
                            <td><input type="number" id="" :value="0"></td><td>кг·м<sup>2</sup></td></tr>
                            
                      <tr><th colspan="3">Память</th></tr>
                          <tr><td>Объем памяти КА</td>
                            <td><input type="number" id="memory" :value="SelectKA.value.operatingParameter.memory"></td><td>ГБ</td></tr>
                        <tr><td>Объем заявки</td>
                            <td><input type="number" id="shootingDataVolume" :value="SelectKA.value.operatingParameter.shootingDataVolume"></td><td>ГБ</td></tr>
                  </table>
              </div>
          </div>
          

      </div>
  </div>
</template>

<script>

import { FetchGet, FetchPost } from "@/js/LoadDisplayMetod";
import SelectDiv from '../SelectDiv.vue';

export default {
  name: 'KAInfo',
  data(){
      return{
          dataJson: [],
          KatypeList: [],
          SelectKA: {
            value:{
                description: ""
            }
          },
          viewPanel: 1
      }
  },
  components:{
      SelectDiv
  },
  methods:{
      SortData(data, type){
          return data.filter(data => data.Type == type)
      },
      async ChangeKA(data){
        console.log(this.SelectKA, data)
          if(data.value == "add"){
            await FetchGet("/api/v1/modelsat/add")
            this.InItSelectKa()
          }
          else{
            console.log(data)
            this.SelectKA = {lable: data.value.modelName, value: data.value}
            this.SelectKA.value.devCatalogs.forEach(device => {
              device.use = 0;
              this.SelectKA.value.devices.forEach(deviceUse => {
                if(deviceUse.devCatalog.id == device.id)
                  device.use = 1
              })
            })
          }
          
      },
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
      async ChangeValue(event, category, parentIndex=0){
        console.log(event)
        switch (category) {
          case 'property':
              this.SelectKA.value.devices[event.target.id].property = + event.target.checked
              await FetchPost("/api/v1/modelsat/update/devices", this.SelectKA.value.devices)
              await this.ReFerchKA(this.SelectKA.value.id)
            break;
          case 'devCatalogs':
              this.SelectKA.value.devCatalogs[event.target.id].nameDevice = event.target.value
              await FetchPost("/api/v1/modelsat/update/devCatalog", this.SelectKA.value.devCatalogs)
              await this.ReFerchKA(this.SelectKA.value.id)
            break;
          case 'modes':
              this.SelectKA.value.modes[parentIndex].operatingModes[event.target.id][event.target.name] = event.target.value
              await FetchPost("/api/v1/modelsat/update/modes", this.SelectKA.value.modes)
              await this.ReFerchKA(this.SelectKA.value.id)
            break;
        
          default:
            break;
        }
      },
      async AddRow(category, data=null){
        switch (category) {
          case "devCatalogs":
            this.SelectKA.value.devCatalogs.push({"nameDevice": "null","modelId": this.SelectKA.value.id})
            await FetchPost("/api/v1/modelsat/update/devCatalog", this.SelectKA.value.devCatalogs)
            await this.ReFerchKA(this.SelectKA.value.id)
            break;
          case "devices":
            this.SelectKA.value.devices.push({
              "devCatalog": data,
              "modelId": this.SelectKA.value.id,
              "property": 0
            })
            await FetchPost("/api/v1/modelsat/update/devices", this.SelectKA.value.devices)
            await this.ReFerchKA(this.SelectKA.value.id)
            break;
          case 'modes':
            this.SelectKA.value.modes[data].operatingModes.push({
              "coefficient": 1,
              "method": 1,
              "mode": "null"
            })
            await FetchPost("/api/v1/modelsat/update/modes", this.SelectKA.value.modes)
            await this.ReFerchKA(this.SelectKA.value.id)
            break;
          default:
            break;
        }
      },
      async DeleteRow(index, category, parentIndex = 0){
        switch (category) {
          case "devCatalogs":
            this.SelectKA.value.devCatalogs[index].deleted = true
            await FetchPost("/api/v1/modelsat/update/devCatalog", this.SelectKA.value.devCatalogs)
            await this.ReFerchKA(this.SelectKA.value.id)
            break;
          case 'devices':
            this.SelectKA.value.devices[index].deleted = true
            await FetchPost("/api/v1/modelsat/update/devices", this.SelectKA.value.devices)
            await this.ReFerchKA(this.SelectKA.value.id)
            break;
          case 'modes':
            this.SelectKA.value.modes[parentIndex].operatingModes[index].deleted = true
            await FetchPost("/api/v1/modelsat/update/modes", this.SelectKA.value.modes)
            await this.ReFerchKA(this.SelectKA.value.id)
            break;

          default:
            break;
        }
      },
      ChangeParamKa(target){
        console.log(target.target.value, target.target.id, this.SelectKA.value.id)
        this.SelectKA.value.operatingParameter[target.target.id] = Number(target.target.value)
        FetchPost("/api/v1/modelsat/update", this.SelectKA.value)
        console.log(this.SelectKA)
      },
      async ReFerchKA(index){
        let result = await FetchGet('/api/v1/modelsat/all')
        this.KatypeList = []
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            this.KatypeList.push({lable: element.modelName, value: element})
        }
        this.KatypeList.push({lable:"Добавить модель", value: "add"})
        this.KatypeList.forEach(KA => {
          if(KA.value.id == index) this.SelectKA = KA
        })
        this.SelectKA.value.devCatalogs.forEach(device => {
              device.use = 0;
              this.SelectKA.value.devices.forEach(deviceUse => {
                if(deviceUse.devCatalog.id == device.id)
                  device.use = 1
              })
            })
      },
      BuildCharges(){
        console.log(this.SelectKA.value.charges)
        this.SelectKA.modesList = [];
        this.SelectKA.value.modes.forEach(mode => {
          this.SelectKA.modesList = this.SelectKA.modesList.concat(mode.operatingModes)
        })
        console.log("this.SelectKA", this.SelectKA)

      },  
      async InItSelectKa(){
        let result = await FetchGet('/api/v1/modelsat/all')
        this.KatypeList = []
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            this.KatypeList.push({lable: element.modelName, value: element})
        }
        this.KatypeList.push({lable:"Добавить модель", value: "add"})
        console.log(this.KatypeList)
        this.SelectKA = this.KatypeList[0]
        console.log("Select", this.SelectKA)
        this.SelectKA.value.devCatalogs.forEach(device => {
              device.use = 0;
              this.SelectKA.value.devices.forEach(deviceUse => {
                if(deviceUse.devCatalog.id == device.id)
                  device.use = 1
              })
            })
        this.BuildCharges()
      }
  },
  mounted(){
      this.InItSelectKa()
      
  }
}
</script>

<style lang="scss" scoped>

.ContentDiv{
    width: 96%;
    flex-direction: row !important;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: space-around;
    height: 96vh;

  .Panel{
      flex:2;
      margin: 10px;
      min-width: 300px;
      max-height: 90%;
      height: 100%;
      padding: 20px;
      overflow-y: auto;

      .ButtonPage{
        border: 1px solid white;
        background-color: #80808000;
        padding: 15px;
        border-radius: 10px;
        margin: 5px 0px;
        &.SelectPage{
            background-color: #80808053;
        }
      }

      &.Select{
        flex: 0;
        text-align: left;
      }
  }
}
.TableDefault{
    filter: drop-shadow(2px 4px 6px black);
    background-color: #72727226;
    border-collapse: collapse;
    border-spacing: 4px !important;
    padding: 0px !important;

    tr{
      background-color: rgba(8, 8, 8, 0.755);

      th{
        border: 1px solid white;
        border-top: none;
      }
      .addButtonIcon{
        left: 0px;
        top: 0px;
        width: 20px;
        margin: 0px 2px;
      }

      input{
        width: calc(100% - 20px);
      }
    }

  }



.Description{
  text-align: left;
  font-size: 19px;
  color: white;
  p{
      font-size: 22px;
      font-weight: bold;
  }
  .KaIMG{
      text-align: center;
      img{
          width: 200px;
      }
  }
}

</style>


  
