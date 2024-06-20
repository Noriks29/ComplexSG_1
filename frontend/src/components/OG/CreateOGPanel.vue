<template>
    <div class="main_contain">
      <div class="PanelDefault ContentDiv">
        <div class="closebutton"><button @click="CloseTable">
          <img src="../../assets/close.svg"><span>&#8203;</span>
        </button></div>

        <div class="flexrow">
          <div class="inputdiv"><input type="text" v-model="OG_Param.inputName"></div>
          <div class="SelectDivInFlex">
            <SelectDiv  
                :dataOption="[{value: true, lable: 'Произвольное построение' },
                  {value: false, lable: 'Плоскостное построение' },
                ]" @valueSelect="SelectChange"/>
          </div>
          <div>
            <button @click="AddOG" class="ButtonDefault">Создать</button> 
          </div>
        </div>
      {{ OG_Param }}
      <div class="Panel" v-if="OG_Param.type === false">
        <table @change="ChangeGenerateParam">
            <tr><td>Количество плоскостей</td><td><input name="n" type="number" value="0"></td></tr>
            <tr><td>Количество позиций в плоскости</td><td><input name="k" type="number" value="0"></td></tr>
            <tr><td>Высота</td><td><input name="altitude" type="number" value="0"></td></tr>
            <tr><td>Эксцентриситет</td><td><input name="eccentricity" type="number" value="0"></td></tr>
            <tr><td>Наклон</td><td><input name="incline" type="number" value="0"></td></tr>

            <tr><td colspan="2" class="Title">Долгота восходящего узла плоскостей</td></tr>
            <tr><td>•	Долгота плоскости 1</td><td><input name="a" type="number" value="0"></td></tr>
            <tr><td>•	Разнесение плоскостей по долготе</td><td><input name="b" type="number" value="0"></td></tr>
            <tr><td>Аргумент ширины перигея</td><td><input name="perigeeWidthArgument" type="number" value="0"></td></tr>

            <tr><td colspan="2" class="Title">Истинная аномалия</td></tr>
            <tr><td>•	Позиция 1 в плоскости 1</td><td><input name="c" type="number" value="0"></td></tr>
            <tr><td>•	Разнесение КА в плоскости по</td><td><input name="d" type="number" value="0"></td></tr>
            <tr><td>•	Фазовый сдвиг КА между плоскостями</td><td><input name="e" type="number" value="0"></td></tr>

        </table>
      </div>

    </div>  
    </div>
</template>
  
  <script>
  
  import SelectDiv from '../SelectDiv.vue';
  import { FetchPost } from '@/js/LoadDisplayMetod';

  
    export default {
      name: 'CreateOGPanel',
      components:{
        SelectDiv
      },

      data() {
        return {
            OG_Param:{
                inputName: undefined,
                type: undefined
            }
        }
      },
      methods:
        {
          CloseTable(){
            this.$emit('closetable', true)
          },
          ChangeGenerateParam(target){
            console.log(target.target.name, target.target.value)
            this.OG_Param.generateData[target.target.name] = Number(target.target.value)
          },
          SelectChange(data){
            if(data.value){
              this.OG_Param = {
                inputName: this.OG_Param.inputName,
                type: true,
              }
            }
            else{
              this.OG_Param = {
                inputName: this.OG_Param.inputName,
                type: false,
                generateData: {
                  n: 0, k: 0, altitude: 0, eccentricity: 0, incline: 0, a: 0, b: 0, perigeeWidthArgument: 0, c: 0, d: 0, e: 0
                }
              }
            }
          },
          async AddOG(){
            if(this.OG_Param.inputName != undefined && this.OG_Param.type != undefined)
            {
              if(this.OG_Param.type === true)
              {

                var addedRow = {
                  'constellationName' : this.OG_Param.inputName,
                  'satellites' : [
                    {"altitude": 0,
                    "eccentricity": 0,
                    "incline": 0,
                    "longitudeAscendingNode": 0,
                    "perigeeWidthArgument": 0,
                    "trueAnomaly": 0}
                  ],
                  'arbitraryFormation' : this.OG_Param.type,
                };
                let responce = await FetchPost('/api/v1/constellation/update',addedRow)
                
                if(responce.type == "SUCCESS"){
                  this.CloseTable()
                }
                else{
                  alert("Ошибка добавления")
                  console.log(responce)
                }

              }
              else{
                alert("Режим в разработке") //""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
              }
              
            }
            else{
              alert("Некоректные входные данные - '"+this.OG_Param.inputName+"' - '"+this.OG_Param.type+"'")
            }
          }
          
      }
    }
  </script>
  
  
  <style lang="scss" scoped>
  .closebutton{
    display: flex;
    margin: 20px;
    flex-direction: row-reverse;
    position: absolute;
    right: 60px;
    button{
      background: none;
      border: none;
      img{
        width: 25px;
      }
    }
  }
  .main_contain{
    backdrop-filter: blur(10px);
    position: fixed;
    top: 1%;
    left: 0;
    width: 100%;
    z-index: 4;
    max-width: 100%;
    height: 99%;
  }
  .ContentDiv{
    padding: 5px;
    margin: 0% 5%;
    width: 90%;
    height: 90%
  }


  .flexrow{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
    width: 99%;

    div{
      margin: 0px 25px;
      position: relative;

      &.inputdiv{
        flex: 1;
        background-color: rgba(151, 151, 151, 0.15);
        border: 2px solid rgba(0, 0, 0, 0.25);
        padding: 5px;
      }
      &.SelectDivInFlex{
        flex: 1;
      }

      input{
        height: 40px;
        width: 98%;
        font-size: 20px;
        padding: 1%;
      }

      .ButtonDefault{
        height: 40px;
        width: 150px;
      }
    }

  }
  </style>