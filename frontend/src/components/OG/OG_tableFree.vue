<template>
    <div class="DataTable">
      {{ dataOGLocal }}
      <div v-if="TableDisplay" class="PanelDefault">
        <table class="TableDefault">
          <tr>
            <th>ID</th>
            <th>Высота</th>
            <th>Эксцентриситет</th>
            <th>Наклон</th>
            <th>Долгота восходящего узла</th>
            <th>Аргумент ширины перигея</th>
            <th>Истинная аномалия</th>
            <th v-if="!approved"></th>
          </tr>
          <tr
            v-for="(data, index) in dataJson"
            :key="index"
            :class="!approved ? 'active' :''"
            @change="ChangeParam"
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
            <td colspan="10"><Button @click="AddRow">Добавить КА</Button></td>
          </tr> 
        </table>
      </div>

    </div>
  </template>
  
  <script>
  
  import jsons from '../../res/testOGFree.json'
  
    export default {
      name: 'TableData',
      props: {
        dataOGLocal:{
          type: Object
        },
        approved:{
          type: Boolean
        },
        datasave:{
          type: Boolean
        }

      },

      data() {
        return {
          dataJson: jsons,
          timefetch: "none",
          TableDisplay: false
        }
      },
      methods:
        {
          
          AddRow(){
            var addedRow = {
                    'idNode' : 0,
                    'altitude' : 0, 'eccentricity' : 0,
                    'incline' : 0, 'longitudeAscendingNode' : 0,
                    'perigeeWidthArgument' : 0, 'trueAnomaly' : 0
                };
            this.dataJson.push(addedRow);   
            this.ChangeSaveStatus()
          },
          ChangeParam(event){
            console.log(event.target, event.target.value, event.target.id)
            this.ChangeSaveStatus()
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
          ChangeSaveStatus(){
            this.$emit('updateDataSave', {
              datasave: false
            })
          },
          DeleteRow(index){
              console.log("Удаление - ",index)
              this.dataJson.splice(index,1)/*
              console.log(this.dataJson)
              this.ShowData()
              console.log("Отправка на сервер")
              fetch('http://192.168.50.250:8081/api/v1/earth/delete/byId?id='+this.dataJson[index].id,{
                method:  'POST',})
                .then(response => response.json())
                .then(data => console.log(data))*/
          }
      },
      watch: {
        dataOGLocal: function () {
          //console.log("Changed", this.dataOGLocal);
          this.TableDisplay = true
          this.dataJson = this.dataOGLocal

        }
      }
    }
  </script>
  
  
  <style lang="scss" scoped>
  table{
    transition: all 1s ease-out;
    border: 1px solid #013A63;
      border-radius: 10px;
      border-spacing: 0px;
      filter: drop-shadow(10px 10px 21px #A9D6E5);
    

    tr:first-child{
        
        th:first-child{
          border-top-left-radius: 10px;
        }
        th:last-child{
          border-top-right-radius: 10px;
        }
        th{
          background-color: #014F86;
          color: white;
          padding-left: 10px;

        }
      }
    
    tr:last-child{
        
      td:first-child{
        border-bottom-left-radius: 10px;
      }
      td:last-child{
        border-bottom-right-radius: 10px;
      }
    }
    .addRowButton button{
      background: none;
      border: none;
      width: 100%;
      height: 100%;
      padding: 10px 0px;
      font-size: 18px;
    }    
    
  
    tr{
      height: 35px;
      font-size: 20px;
  
      .iconDelete{
        width: 25px;
        height: 25px;
      }
      .small{
        width: 100px;
      }
      td {
        padding: 5px;
        border-top: 1px solid #013A63;
        background-color: #A9D6E5;
        
        input{
          padding: 10px;
          text-align: center;
          pointer-events: none;
          border: none;
          background: none;
          font-size: 18px;
        }
      }
      &.active 
      {
        input{
          pointer-events: auto;
        }
        input:focus{
            //background-color: #468FAF;
            border: none;
            border-bottom: 3px solid red;
            
            border-radius: 5px;
          }
      }
      
  
    }
    
  }
  
  
  .NPTable{
    transition: all 1s ease-out;
    display: inline-flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    max-width: 80%;
  
  
    
  
  }
  </style>