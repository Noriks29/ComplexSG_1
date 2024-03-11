<template>
  <div class="DataTable">
    
    <div class="PanelDefault">
      <table class="TableDefault">
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Широта</th>
          <th>Долгота</th>
          <th v-if="!approved"></th>
        </tr>
        <tr
          v-for="(data, index) in dataJson"
          :key="index"
          :class="!approved ? 'active' :''"
          @change="ChangeParam"
          v-show="!(data.deleted==true)"
        >
          <td><input :id="index"  style="pointer-events: none;" name="idNode" class="small" 
             :value="data.idNode"></td>
          <td><input :id="index" name="nameEarthPoint"
             :value="data.nameEarthPoint"></td>
          <td><input :id="index" name="longitude" class="small" 
            :value="data.longitude"></td>
          <td><input :id="index" name="latitude" class="small" 
              :value="data.latitude"></td>
          <td v-if="!approved" :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../assets/delete.svg" alt="Удалить"></td>
        </tr>
        <tr v-if="!approved" class="addRowButton">
          <td colspan="5"><Button @click="AddRow">Добавить наземный пункт</Button></td>
        </tr> 
      </table>
    </div>
    <div class="PanelTable">
      <div class="TableInfo PanelDefault">
        <div :class="approved ? 'Yes' :'No'">
        {{ approved ? " Утверждено" : "Не Утверждено" }}
        </div>
        <div class="ButtonApproved">
          <button v-if="approved" @click="SatartEditing" class="ButtonDefault"> <img src="../assets/edit.svg">Редактировать</button> 
          <button v-if="approved" class="ButtonDefaultShadow"></button>  
        </div>
        <div class="ButtonApproved">
          <button v-if="!approved" @click="SatartSave" :class="!datasave ? '' :'Empty disabled'" class="ButtonDefault"> <img src="../assets/save.svg">Сохранить</button>
          <button v-if="!approved && !datasave" class="ButtonDefaultShadow"></button>
        </div>
        <div class="ButtonApproved"> 
          <button v-if="!approved" @click="SatartApproved" :class="datasave ? '' :'Empty disabled'" class="ButtonDefault"> <img src="../assets/approve.svg">Утвердить</button>
          <button v-if="!approved && datasave" class="ButtonDefaultShadow"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import jsons from '../res/test2.json'

  export default {
    name: 'TableData',
    data() {
      return {
        dataJson: jsons,
        approved: true,
        datasave: true
      }
    },
    methods:
      {
        ChangeTableStatusForPerent(){
          this.$emit('changeState', {
            state: this.datasave
          })
        },
        ShowData(){
          console.log(JSON.stringify(this.dataJson))
        },
        setPost() {
          this.ShowData()
          console.log("Отправка на сервер")
          try {
            fetch('http://192.168.50.105:8081/api/v1/earth/update/byList',{
              method:  'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(this.dataJson)
            })
              .then(response => response.json())
              .then(data => console.log(data))
            } catch (error) {
                this.timefetch = "Error";
                console.error('Error save:', error);
            }
          
        },
        SatartSave(){
          this.setPost();
          this.datasave = true
          this.ChangeTableStatusForPerent()
        },
        SatartApproved(){
          if(this.datasave){
            this.approved = true
            try {
              fetch('http://localhost:8081/api/v1/constellation/set/status?status=true',{
                method:  'POST'
              })
              .then(response => response.json())
              .then(data => console.log(data))
            } catch (error) {
                this.timefetch = "Error";
                console.error('Error approve:', error);
            }
          }
        },
        SatartEditing (){
          this.approved = false
        },
        AddRow(){
          var addedRow = {'idNode' : 0, 'nameEarthPoint' : "__NULL__", 'longitude' : 0, 'latitude' : 0, 'deleted': false, 'id': -1};
          this.dataJson.push(addedRow);   
          this.datasave = false
          this.ChangeTableStatusForPerent()
        },
        ChangeParam(event){
          console.log(event.target, event.target.value, event.target.id)
          this.datasave = false
          this.ChangeTableStatusForPerent()
          switch(event.target.name){
            case "nameEarthPoint":
              this.dataJson[event.target.id].nameEarthPoint = event.target.value
              break;
            case "longitude":{
              let longitudecorrect = Number(event.target.value)
              if(longitudecorrect < -90) longitudecorrect = -90
              if(longitudecorrect > 90) longitudecorrect = 90
              this.dataJson[event.target.id].longitude = longitudecorrect
              break;
            }
            case "latitude":
            {
              let latitudecorrect = Number(event.target.value)
              if(latitudecorrect < -180) latitudecorrect = -180
              if(latitudecorrect > 180) latitudecorrect = 180
              this.dataJson[event.target.id].latitude = latitudecorrect
              break;
            }
            default:
              alert( "Ошибка!" );
          }
        },
        DeleteRow(index){
            
            if (this.dataJson[index].id == -1) {
              console.log(index)
              this.dataJson.splice(index,1)
            }
            else{
              this.dataJson[index].deleted = true
            }
            console.log(this.dataJson[index])
            this.ShowData()
            this.datasave = false
            this.ChangeTableStatusForPerent()
            
        }
    },
    async mounted() {
    try {
        const response = await fetch('http://192.168.50.105:8081/api/v1/earth/get/list');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        else{
          const result = await response.json();
          let date = new Date();
          let datetime = date.getDate()+"."+date.getMonth()+"."+date.getFullYear()+" "+ date.getHours()+":"+ date.getMinutes()+":"+ date.getSeconds()
          console.log(result, datetime);
          this.dataJson = result;
        }
    } catch (error) {
        this.timefetch = "Error";
        console.error('Error during fetch:', error);
    }
}

  }
  //console.log(json)
</script>


<style lang="scss" scoped>

</style>