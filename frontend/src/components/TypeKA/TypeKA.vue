<template>
  <div class="main_contain">
      <div>
          <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
            <img src="../../assets/exit.svg">
          </button>
        </div>

      <h1 class="TitleText">Типы космических аппаратов</h1>
      <div class="ContentDiv">
          
          <div class="Panel Select" >
              <p>Выбор КА</p>
              <SelectDiv  :dataOption="KatypeList" :valueS="SelectKA"  @valueSelect="ChangeKA"/>

              <p>Информация</p>

              <div @click="viewPanel = 1">Описание</div>
              <div @click="viewPanel = 2">Целевая аппаратура</div>
              <div @click="viewPanel = 3">Бортовые устройства</div>
              <div @click="viewPanel = 4">Бортовые устройства с постоянным потреблением энергии</div>
              <div @click="viewPanel = 5">Бортовые устройства с переменным потреблением</div>
              <div @click="viewPanel = 6">Параметры функционирования</div>
          </div>

          <div class="Panel" v-if="viewPanel == 1">
              <p> Описание </p>
              <div class="KaIMG"><img src="./KA_A.png" alt="Картинка"></div>
              <div>
                  <div v-html="dataJson[0].Description"></div>
              </div>
          </div>

          <div class="Panel" v-if="viewPanel == 2">
              <p> Целевая аппаратура </p>
              <div>
                  <table class="TableDefault PanelDefault">
                      <tr>
                          <th>Название</th><th>Вт</th><th>Коэф-нт</th>
                      </tr>
                      <tr
                          v-for="data, index in SortData(dataJson[0].Equipment,1)"
                          :key="index"
                      >
                          <td>{{ data.name }}</td>
                          <td>{{ data.value }}</td>
                          <td>test</td>
                      </tr>
                  </table>
              </div>
          </div>
          <div class="Panel" v-if="viewPanel == 3">
              <p> Бортовые устройства </p>
              <div>
                  <table class="TableDefault PanelDefault">
                      <tr>
                          <th>Название</th><th>Вт</th><th>Солнце</th><th>Земля</th><th>Цель</th>
                      </tr>
                      <tr
                          v-for="data, index in SortData(dataJson[0].Equipment,0)"
                          :key="index"
                      >
                          <td>{{ data.name }}</td>
                          <td>{{ data.value }}</td>
                          <td>{{ data.R1 }}</td>
                          <td>{{ data.R2 }}</td>
                          <td>{{ data.R3 }}</td>
                      </tr>
                  </table>
              </div>
          </div>
          <div class="Panel" v-if="viewPanel == 4">
              <p> Бортовые устройства с постоянным потреблением энергии </p>
              <div>
                  <table class="TableDefault PanelDefault">
                      <tr>
                          <th>Название</th><th>Вт</th><th>Солнце</th><th>Земля</th><th>Цель</th>
                      </tr>
                      <tr
                          v-for="data, index in SortData(dataJson[0].Equipment,2)"
                          :key="index"
                      >
                          <td>{{ data.name }}</td>
                          <td>{{ data.value }}</td>
                          <td>{{ data.R1 }}</td>
                          <td>{{ data.R2 }}</td>
                          <td>{{ data.R3 }}</td>
                      </tr>
                  </table>
              </div>
          </div>

          <div class="Panel" v-if="viewPanel == 5">
              <p> Бортовые устройства с переменным потреблением </p>
              <div>
                  <table class="TableDefault PanelDefault">
                      <tr>
                          <th>Название</th><th>Вт</th><th>Солнце</th><th>Земля</th><th>Цель</th>
                      </tr>
                      <tr
                          v-for="data, index in SortData(dataJson[0].Equipment,2)"
                          :key="index"
                      >
                          <td>{{ data.name }}</td>
                          <td>{{ data.value }}</td>
                          <td>{{ data.R1 }}</td>
                          <td>{{ data.R2 }}</td>
                          <td>{{ data.R3 }}</td>
                      </tr>
                  </table>
              </div>
          </div>

          <div class="Panel" v-if="viewPanel == 6">
              <p>Параметры функционирования</p>
              <div>
                  <table class="TableDefault PanelDefault" @change="ChangeParamKa">
                      <tr><th colspan="3">Параметры разворота</th></tr>
                          <tr><td>Ускорение / замедление КА</td>
                              <td><input type="number" id="0" :value="dataJson[0].prm[0].value"></td><td>гр/с<sup>2</sup></td></tr>
                          <tr><td>Максимальная скорость вращения КА</td>
                            <td><input type="number" id="1" :value="dataJson[0].prm[1].value"></td><td>гр/с</td></tr>
                          <tr><td>Время стабилизации</td>
                            <td><input type="number" id="2" :value="dataJson[0].prm[2].value"></td><td>с</td></tr>
                      <tr><th colspan="3">Скорость передачи данных</th></tr>
                          <tr><td>Скорость передачи данных КА - КА</td>
                            <td><input type="number" id="3" :value="dataJson[0].prm[3].value"></td><td>Мб/с</td></tr>
                          <tr><td>Скорость передачи данных КА - НП</td>
                            <td><input type="number" id="4" :value="dataJson[0].prm[4].value"></td><td>Мб/с</td></tr>
                      <tr><th colspan="3">Максимальные углы съемки</th></tr>
                          <tr><td>Крен</td>
                            <td><input type="number" id="5" :value="dataJson[0].prm[5].value"></td><td>Гр.</td></tr>
                          <tr><td>Тангаж</td>
                            <td><input type="number" id="6" :value="dataJson[0].prm[6].value"></td><td>Гр.</td></tr>
                      <tr><th colspan="3">Аккумуляторная батарея</th></tr>
                          <tr><td>Емкость</td>
                            <td><input type="number" id="7" :value="dataJson[0].prm[7].value"></td><td>Вт-ч</td></tr>
                          <tr><td>Минимальный уровень заряда</td>
                            <td><input type="number" id="8" :value="dataJson[0].prm[8].value"></td><td>Вт-ч</td></tr>
                      <tr><th colspan="3">Память</th></tr>
                          <tr><td>Объем памяти</td>
                            <td><input type="number" id="9" :value="dataJson[0].prm[9].value"></td><td>ГБ</td></tr>
                  </table>
              </div>
          </div>
          

      </div>
  </div>
      <div class="Column_contain">
          <div class="PanelInfo">
              
          </div>
          <div class="PanelInfo">
              
          </div>
          <div class="PanelInfo">
              
          </div>
      </div>
</template>

<script>

import { FetchGet } from "@/js/LoadDisplayMetod";
import jsons from "../../res/testAK1.json"
import SelectDiv from '../SelectDiv.vue';

export default {
  name: 'KAInfo',
  data(){
      return{
          dataJson: jsons,
          KatypeList: [],
          SelectKA: {},
          viewPanel: 1
      }
  },
  components:{
      SelectDiv
  },
  methods:{
      ShowData(){
          console.log(this.dataJson[0].Name)
      },
      SortData(data, type){
          return data.filter(data => data.Type == type)
      },
      ChangeKA(data){
          console.log(data)
          for (let index = 0; index < data.value.operatingParameter.length; index++) {
              const element = data.value.operatingParameter[index];
              console.log(element)
              this.dataJson[0].prm[element.operationParamId - 1].value = element.value || 0
          }
          console.log(this.dataJson)
      },
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
      ChangeParamKa(target){
        console.log(target.target.value, target.target.id, this.SelectKA.value.id)
      }
  },
  async mounted(){
      let result = await FetchGet('/api/v1/modelsat/all/modelsat')
      console.log(result)
      for (let index = 0; index < result.length; index++) {
          const element = result[index];
          this.KatypeList.push({lable: element.modelName, value: element})
      }
      console.log(this.KatypeList)
      this.SelectKA = this.KatypeList[0]
  }
}
</script>

<style lang="scss" scoped>

.ContentDiv{
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: space-around;

  .Panel{
      flex:1;
      margin: 10px;
      min-width: 600px;

      &.Select{
        text-align: left;
        padding: 20px;
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


  
