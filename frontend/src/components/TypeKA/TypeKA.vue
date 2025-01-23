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
                        <th>Код</th><th>Режим полёта</th><th>Режим функционирования</th><th>Метод</th><th>К</th>
                      </tr>
                      <tbody v-for="data, index in SelectKA.value.modes" :key="index">
                        <tr>
                          <td rowspan="0">{{ data.code || "не назван" }}</td> <td rowspan="0">{{ data.nameFlightMode || "не назван" }}</td>
                        </tr>
                        <tr v-for="dataModes, indexModes in data.operatingModes" :key="indexModes">
                          <td>{{dataModes || "не назван"}}</td><td>{{dataModes || "не назван"}}</td><td>0</td>
                        </tr>
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
                <tr><th>Прибор</th></tr>
                <tr v-for="data,index in SelectKA.value.devCatalogs" :key="index" :id="data.id">
                  <td>{{ data.nameDevice || "null" }}</td>
                </tr>
              </table>

              <p>Устройства</p>
              <table class="TableDefault">
                <tr><th>Прибор</th><th>Свойство</th></tr>
                <tr v-for="data,index in SelectKA.value.devices" :key="index" :id="data.id">
                  <td>{{ data.devCatalog || "null"}}</td><td>{{ data.property || "null"}}</td>
                </tr>
              </table>
          </div>
          <div class="Panel" v-if="viewPanel == 3">
              <p> Устройства </p>
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
          }
          
      },
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
      ChangeParamKa(target){
        console.log(target.target.value, target.target.id, this.SelectKA.value.id)
        this.SelectKA.value.operatingParameter[target.target.id] = Number(target.target.value)
        FetchPost("/api/v1/modelsat/update", this.SelectKA.value)
        console.log(this.SelectKA)
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


  
