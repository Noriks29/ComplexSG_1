<template>
    <div class="main_contain">
        <div class="closebutton"><button @click="CloseTable">
          <img src="@/assets/close.svg"><span>&#8203;</span>
        </button></div>
      <div class="ContentDiv">
        <div class="flexrow">
          <div class="inputdiv"><input type="text" v-model="OG_Param.inputName"></div>
          <div class="SelectDivInFlex">
            <SelectDiv  
                :dataOption="[{value: 1, lable: 'Произвольное построение' },
                  {value: 0, lable: 'Системное построение' },
                  {value: 2, lable: 'загрузить ОГ из TLE' },
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
      <div class="Panel" v-if="OG_Param.type == undefined">
        <label class="input-file">
            <input type="file" name="file" id="file-Json" @change="LoadFile" enctype="multipart/form-data">	
            <!--<input type="file" name="file" id="file-Json" @change="LoadFile" accept="application/json" enctype="multipart/form-data">-->	
            <span>Загрузить файл</span>
        </label>
        Файл: {{ (OG_Param.file !== undefined) ? OG_Param.file.name : "Не выбран" }}
      </div>
    </div>
    </div>  
</template>
  
  <script>
  
  import SelectDiv from '@/components/SelectDiv.vue';
  import { FetchPost, FetchGet, FetchPostFile } from '@/js/LoadDisplayMetod';

  
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
            //console.log(target.target.name, target.target.value)
            this.OG_Param.parametersCalculation[target.target.name] = Number(target.target.value)
          },
          SelectChange(data){
            if(data.value == 1){
              this.OG_Param = {
                inputName: this.OG_Param.inputName,
                type: true,
              }
            }
            else if(data.value == 0){
              this.OG_Param = {
                inputName: this.OG_Param.inputName,
                type: false,
                parametersCalculation: {
                  numberOfPlane: 0, positionPlane: 0, altitude: 0, eccentricity: 0, incline: 0, longitudeOfPlane1: 0, spacecraftOfLongitude: 0, perigeeWidthArgument: 0, firstPositionInPlane1: 0, spacecraftSpacing: 0, phaseShift: 0, modelSat:{id:1}
                }
              }
            }
            else if(data.value == 2){
              console.log("File Load")
              this.OG_Param = {
                inputName: this.OG_Param.inputName,
                type: undefined,
                file: undefined
              }
            }
          },
          async AddOG(){
            if(this.OG_Param.inputName != undefined && (this.OG_Param.type != undefined || this.OG_Param.file != undefined))
            {
              if(this.OG_Param.type === true)
              {
                //console.log(this.KaModels)
                let addedRow = {
                  'constellationName' : this.OG_Param.inputName,
                  'satellites' : [],
                  'inputType' : 1,
                  "arbitraryFormation": true,
                  "communicationsFormation": null
                };
                //console.log(addedRow)
                let responce = await FetchPost('/api/v1/constellation/add',addedRow) || {}
                
                if(responce.type == "SUCCESS"){
                  this.CloseTable()
                }
                else{
                  alert("Ошибка добавления" + JSON.stringify(responce))
                  console.log(responce)
                }

              }
              else if(this.OG_Param.type == false) {
                let addedRow = {
                  'constellationName' : this.OG_Param.inputName,
                  'parametersCalculation' : this.OG_Param.parametersCalculation,
                  'inputType' : 2,
                };
                //console.log(addedRow)
                let responce = await FetchPost('/api/v1/constellation/calc/planar',addedRow) || {}
                
                if(responce.type == "SUCCESS"){
                  this.CloseTable()
                }
                else{
                  alert("Ошибка добавления" + JSON.stringify(responce))
                  console.log(responce)
                }
              }
              else if(this.OG_Param.type == undefined){

                const formData = new FormData(); // Создаем FormData
                const file = this.OG_Param.file
                //console.log(file)
                formData.append('file', file); // Добавляем файл
                formData.append('constellationName', this.OG_Param.inputName); // Добавляем имя
                formData.append('inputType', 3);
                let responce = await FetchPostFile("/api/v1/constellation/upload/tle", formData)
                console.log(responce)
                if(responce.type == "SUCCESS"){
                  this.CloseTable()
                }
                else{
                  alert("Ошибка добавления" + JSON.stringify(responce))
                  console.log(responce)
                }
              }
              
            }
            else{
              alert("Некоректные входные данные - '"+this.OG_Param.inputName+"' - '"+this.OG_Param.type+"'")
            }
          },
          async LoadFile(data){
            if (data.target.files[0]) {
              var file = data.target.files[0];
              this.OG_Param.file = file
            }
          },
          
        },
        async mounted(){
          let result = await FetchGet('/api/v1/modelsat/all') || []
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

  .input-file {
	background: #2b2b2b;
  color: white;
  border: 1px solid black;
  padding: 14px;
  font-size: var(--font-size);
  border-radius: 10px;
  box-shadow: -3px 3px 1px black;
  margin: 5px;
  transition: all 0.2s;
  position: relative;
  display: inline-block;
}
.input-file span {
  position: relative;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  display: flex;
  vertical-align: middle;
  text-align: center;
  background: none;
  height: 100%;
  font-size: 15px;
  transition: all 0.3s ease;
  color: white;
  align-items: center;
  flex-direction: row;
}
.input-file input[type=file] {
	position: absolute;
	z-index: -1;
	opacity: 0;
	display: block;
	width: 0;
	height: 0;
}
  </style>