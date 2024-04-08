<template>
    <div class="DataTable">
      <div class="PanelDefault">
        <table class="TableDefault">
          <tr>
            <th>ID</th>
            <th>Высота</th>
            <th>Эксцентриситет</th>
            <th>Наклон</th>
            <th>Долгота восходящего узла</th>
            <th>Аргумент ширины перигея</th>
            <th>Истинная аномалия</th>
            <th v-if="!approved"><span>&#8203;</span></th>
          </tr>
          <tr
            v-for="(data, index) in dataJson"
            :key="index"
            :class="!approved ? 'active' :''"
            @change="ChangeParam"
            v-show="!(data.deleted==true)"
          >
          <!-- Завтра сделать метод принимающий index, event.target исделать всё это редактирование красивым-->
            <td><input :id="index"  style="pointer-events: none;" name="idNode" class="small" 
               :value="data.idNode"></td>
            <td><input :id="index" name="altitude" class="small" 
              :value="data.altitude"></td>
            <td><input :id="index" name="eccentricity" class="small" 
                :value="data.eccentricity"></td>
            <td><input :id="index" name="incline" class="small" 
                :value="data.incline"></td>
            <td><input :id="index" name="longitudeAscendingNode" class="small" 
                :value="data.longitudeAscendingNode"></td>
            <td><input :id="index" name="perigeeWidthArgument" class="small" 
                :value="data.perigeeWidthArgument"></td>
            <td><input :id="index" name="trueAnomaly" class="small" 
                :value="data.trueAnomaly"></td>
            <td v-if="!approved" :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
          <tr v-if="!approved" class="addRowButton">
            <td colspan="10"><button @click="AddRow">Добавить КА</button></td>
          </tr> 
        </table>
      </div>
        <div class="PanelTable" v-if="!approved">
        <div class="TableInfo PanelDefault">
          <div class="ButtonApproved">
            <button @click="SatartSave" :class="!datasave ? '' :'Empty disabled'" class="ButtonDefault"> <img src="../../assets/save.svg">Сохранить</button>
            <button v-if="!datasave" class="ButtonDefaultShadow"><span>&#8203;</span></button>
          </div>
          <div class="ButtonApproved">
            <button  @click="DeleteRowOG" class="ButtonDefault"><img src="../../assets/save.svg">Удалить орбитальную группировку</button>
            <button class="ButtonDefaultShadow"><span>&#8203;</span></button>
          </div>
        </div>
        </div>
    </div>
  </template>
  
  <script>
  
  import jsons from '../../res/testOGFree.json'
  import {adress} from '../../js/config_server.js'
  
    export default {
      name: 'TableData',
      props: {
        dataOGLocal:{
          type: Object
        },
        approved:{
          type: Boolean
        },

      },

      data() {
        return {
          dataJson: jsons,
          dataJsonOG: {},
          TableDisplay: false,
          datasave: true
        }
      },
      methods:
        {
          
          AddRow(){
            var addedRow = {
                    'idNode' : 0,
                    'altitude' : 0, 'eccentricity' : 0,
                    'incline' : 0, 'longitudeAscendingNode' : 0,
                    'perigeeWidthArgument' : 0, 'trueAnomaly' : 0,
                    'deleted': false, 'id': undefined, 'modelSat' : 3, 'tableId' : this.dataJsonOG.id
                };
            this.dataJson.push(addedRow);   
            this.datasave = false
            this.dataJsonOG.statuswork = "notSave"
          },
          ChangeParam(event){
            console.log(event.target, event.target.value, event.target.id)
            this.datasave = false
            this.dataJsonOG.statuswork = "notSave"
            switch(event.target.name){
              case "altitude":{
                this.dataJson[event.target.id].altitude = Number(event.target.value)
                break;
              }
              case "eccentricity":{
                this.dataJson[event.target.id].eccentricity = Number(event.target.value)
                break;
              }
              case "incline":{
                this.dataJson[event.target.id].incline = Number(event.target.value)
                break;
              }
              case "longitudeAscendingNode":{
                this.dataJson[event.target.id].longitudeAscendingNode = Number(event.target.value)
                break;
              }
              case "perigeeWidthArgument":{
                this.dataJson[event.target.id].perigeeWidthArgument = Number(event.target.value)
                break;
              }
              case "trueAnomaly":{
                this.dataJson[event.target.id].trueAnomaly = Number(event.target.value)
                break;
              }
              default:
                alert( "Ошибка!" );
            }
          },
          DeleteRow(index){
              console.log("Удаление - ",index)
              this.datasave = false
              this.dataJsonOG.statuswork = "notSave"
              if (this.dataJson[index].id === undefined) {
                console.log(index)
                this.dataJson.splice(index,1)
              }
              else{
                this.dataJson[index].deleted = true
              }
          },
          DeleteRowOG(){
              if (this.dataJsonOG.id === undefined) {

                this.dataJsonOG.deleted=true
              }
              else{
                this.dataJsonOG.deleted=true
                try {
                fetch('http://'+adress+'/api/v1/constellation/delete/byId?id='+this.dataJsonOG.id,{
                  method:  'POST',
                })
                  .then(response => response.json())
                  .then(data => console.log(data))
                } catch (error) {
                    console.error('Error save:', error);
                }
              }
          },
          SatartSave() {
            this.datasave = true
            console.log("Отправка на сервер")
            this.dataJsonOG.statuswork = "Save"
            if(this.dataJsonOG.id === undefined)
            {
              try {
              fetch('http://'+adress+'/api/v1/constellation/add',{
                method:  'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.dataJsonOG)
              })
                .then(response => response.json())
                .then(data => console.log(data))
              } catch (error) {
                  console.error('Error save:', error);
              }
            }
            else{
              try {
              console.log(JSON.stringify(this.dataJson))
              fetch('http://'+adress+'/api/v1/constellation/arbitrary/update/byList',{
                method:  'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.dataJson)
              })
                .then(response => response.json())
                .then(data => console.log(data))
              } catch (error) {
                  console.error('Error save:', error);
              }
            }
          }
      },/*
      watch: {
        dataOGLocal: function () {
          this.dataJson = this.dataOGLocal
          console.log(this.dataOGLocal)
        }
      },*/
      mounted() {
        this.dataJsonOG = this.dataOGLocal
        this.dataJson = this.dataJsonOG.arbitraryConstructions
        if(this.dataJsonOG.statuswork == "notSave")
          this.datasave = false
        console.log(this.dataJsonOG.id)
      }
    }
  </script>
  
  
  <style lang="scss" scoped>
  

  </style>