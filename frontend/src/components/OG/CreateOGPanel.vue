<template>
    <div class="main_contain">
        <div class="closebutton"><button @click="CloseTable">
          <img src="../../assets/close.svg"><span>&#8203;</span>
        </button></div>
      <div class="ContentDiv">
        <div class="flexrow">
          <div class="inputdiv"><input type="text" v-model="OG_Param.inputName"></div>
          <div class="SelectDivInFlex">
            <SelectDiv  
                :dataOption="[{value: true, lable: 'Произвольное построение' },
                  {value: false, lable: 'Системное построение' },
                ]" 
                :valueS="{value: true, lable: 'Произвольное построение' }"
                @valueSelect="SelectChange"/>
          </div>
          <div>
            <button @click="AddOG" class="ButtonDefault">Создать</button> 
          </div>
        </div>
      <div class="Panel" v-if="OG_Param.type === false">
        <table @change="ChangeGenerateParam">
            <tr><td>Модель КА</td><td><SelectDiv  :dataOption="KaModels" :valueS="KaModels[0]" :id="index" @valueSelect="SelectChangeKA"/></td></tr>
            <tr><td>Количество плоскостей</td><td><input name="numberOfPlane" type="number" value="0"></td></tr>
            <tr><td>Количество позиций в плоскости</td><td><input name="positionPlane" type="number" value="0"></td></tr>
            <tr><td>Большая полуось</td><td><input name="altitude" type="number" value="0"></td></tr>
            <tr><td>Эксцентриситет</td><td><input name="eccentricity" type="number" value="0"></td></tr>
            <tr><td>Наклон</td><td><input name="incline" type="number" value="0"></td></tr>

            <tr><td colspan="2" class="Title">Долгота восходящего узла плоскостей</td></tr>
            <tr><td>•	Долгота плоскости 1</td><td><input name="longitudeOfPlane1" type="number" value="0"></td></tr>
            <tr><td>•	Разнесение плоскостей по долготе</td><td><input name="spacecraftOfLongitude" type="number" value="0"></td></tr>
            <tr><td>Аргумент ширины перигея</td><td><input name="perigeeWidthArgument" type="number" value="0"></td></tr>

            <tr><td colspan="2" class="Title">Истинная аномалия</td></tr>
            <tr><td>•	Позиция 1 в плоскости 1</td><td><input name="firstPositionInPlane1" type="number" value="0"></td></tr>
            <tr><td>•	Разнесение КА в плоскости по</td><td><input name="spacecraftSpacing" type="number" value="0"></td></tr>
            <tr><td>•	Фазовый сдвиг КА между плоскостями</td><td><input name="phaseShift" type="number" value="0"></td></tr>

        </table>
      </div>
    </div>
    </div>  
</template>
  
  <script>
  
  import SelectDiv from '../SelectDiv.vue';
  import { FetchPost, FetchGet } from '@/js/LoadDisplayMetod';

  
    export default {
      name: 'CreateOGPanel',
      components:{
        SelectDiv
      },

      data() {
        return {
            OG_Param:{
                inputName: undefined,
                type: true
            },
            KaModels: []
        }
      },
      methods:
        {
          CloseTable(){
            this.$emit('closetable', true)
          },
          SelectChangeKA(data){
            this.OG_Param.parametersCalculation.modelSat.id = data.value
          },
          ChangeGenerateParam(target){
            console.log(target.target.name, target.target.value)
            this.OG_Param.parametersCalculation[target.target.name] = Number(target.target.value)
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
                parametersCalculation: {
                  numberOfPlane: 0, positionPlane: 0, altitude: 0, eccentricity: 0, incline: 0, longitudeOfPlane1: 0, spacecraftOfLongitude: 0, perigeeWidthArgument: 0, firstPositionInPlane1: 0, spacecraftSpacing: 0, phaseShift: 0, modelSat:{id:1}
                }
              }
            }
          },
          async AddOG(){
            if(this.OG_Param.inputName != undefined && this.OG_Param.type != undefined)
            {
              if(this.OG_Param.type === true)
              {
                console.log(this.KaModels)
                let addedRow = {
                  'constellationName' : this.OG_Param.inputName,
                  'satellites' : [
                    {"altitude": 0,
                    "eccentricity": 0,
                    "incline": 0,
                    "longitudeAscendingNode": 0,
                    "perigeeWidthArgument": 0,
                    "trueAnomaly": 0,
                    "modelSat": {
                    "id": this.KaModels[0].value
                    }
                  }
                  ],
                  'arbitraryFormation' : this.OG_Param.type,

                  
                };
                console.log(addedRow)
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
                let addedRow = {
                  'constellationName' : this.OG_Param.inputName,
                  'parametersCalculation' : this.OG_Param.parametersCalculation,
                  'arbitraryFormation' : this.OG_Param.type,
                };
                console.log(addedRow)
                let responce = await FetchPost('/api/v1/constellation/calc/planar',addedRow)
                
                if(responce.type == "SUCCESS"){
                  this.CloseTable()
                }
                else{
                  alert("Ошибка добавления")
                  console.log(responce)
                }
              }
              
            }
            else{
              alert("Некоректные входные данные - '"+this.OG_Param.inputName+"' - '"+this.OG_Param.type+"'")
            }
          }
          
        },
        async mounted(){
          let result = await FetchGet('/api/v1/modelsat/all')
          this.KaModels = []
          for (let index = 0; index < result.length; index++) {
            this.KaModels.push({value: result[index].id, lable:  result[index].modelName});
          }
        }
    }
  </script>
  
  
  <style lang="scss" scoped>
  .closebutton{
    margin: 10px !important;
    z-index: 15;
    position: relative;
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
    height: 90% !important;
    filter: drop-shadow(2px 4px 6px black);
    background: #0e0e0e;
    background: linear-gradient(140deg, #282828 0%, #1c1c1c 15%, #0a0a0a 100%);
  }


  .flexrow{

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    width: 99%;

    div{
      margin: 0px 25px;

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
        height: 15px;
        width: 98%;
        padding: 1%;
      }

      .ButtonDefault{
        height: 40px;
        width: 150px;
      }
    }

  }


  .closebutton{
    display: flex;
    margin: 20px;
    flex-direction: row-reverse;
    button{
      background: none;
      border: none;
      img{
        width: 25px;
      }
    }
  }
  .DataTable{
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0%;
    left: 0;
    width: 98%;
    z-index: 4;
    max-width: 98%;
    height: 100vh;
    padding: 1%;
    font-size: 14px !important;
  }
  </style>