<template>
    <div class="DataTable">
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
                    'perigeeWidthArgument' : 0, 'trueAnomaly' : 0,
                    'deleted': false, 'id': -1
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
              if (this.dataJson[index].id == -1) {
                console.log(index)
                this.dataJson.splice(index,1)
              }
              else{
                this.dataJson[index].deleted = true
              }
          }
      },
      watch: {
        dataOGLocal: function () {
          this.TableDisplay = true
          this.dataJson = this.dataOGLocal

        }
      }
    }
  </script>
  
  
  <style lang="scss" scoped>
  

  </style>