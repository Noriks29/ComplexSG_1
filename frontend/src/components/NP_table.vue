<template>
  <div class="NPTable">
    <div >
      <!--
      <button @click="ShowData">
        Вывод
      </button>
      -->
    </div>
    
    <div>
      <table>
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
        >
        <!-- Завтра сделать метод принимающий index, event.target исделать всё это редактирование красивым-->
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
      <div class="TableInfo">
        <div :class="approved ? 'Yes' :'No'">
          Статус: {{ approved ? " Утверждено" : "Не Утверждено" }}
        </div>
        <div class="ButtonApproved">
          <button v-if="approved" @click="SatartEditing"> <img src="../assets/edit.svg">Редактировать</button>  
        </div>
        <div class="ButtonApproved">
          <button v-if="!approved" @click="SatartSave" :class="datasave ? 'Save' :'NotSave'"> <img src="../assets/save.svg">Сохранить</button>
        </div>
        <div class="ButtonApproved"> 
          <button v-if="!approved" @click="SatartApproved" :class="datasave ? 'active' :'disabled'" > <img src="../assets/approve.svg">Утвердить</button>
        </div>
        <!--<div>Статус сервера: {{timefetch}}</div>-->
        
      </div>
    </div>
  <!---
    <div>
        012A4A 013A63 01497C 014F86 2A6F97 2C7DA0 468FAF
    </div>
    -->
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
        timefetch: "none",
        datasave: true
      }
    },
    methods:
      {
        ShowData(){
          console.log(`{"dtoEarthPointList": ` + JSON.stringify(this.dataJson) + `}`)
        },
        setPost() {
          this.ShowData()
          console.log("Отправка на сервер")
          fetch('http://192.168.50.250:8081/api/v1/earth/update/byList',{
            method:  'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: `{"dtoEarthPointList": ` + JSON.stringify(this.dataJson) + `}`
          })
            .then(response => response.json())
            .then(data => console.log(data))
        },
        SatartSave(){
          this.setPost();
          this.datasave = true
        },
        SatartApproved(){
          if(this.datasave){
            this.approved = true
            //this.setPost();
          }
        },
        SatartEditing (){
          this.approved = false
        },
        AddRow(){
          var addedRow = {'idNode' : 0, 'nameEarthPoint' : "__NULL__", 'longitude' : 0, 'latitude' : 0};
          this.dataJson.push(addedRow);   
          this.datasave = false
        },
        ChangeParam(event){
          console.log(event.target, event.target.value, event.target.id)
          this.datasave = false
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
            console.log(index)
            this.dataJson.splice(index,1)
            console.log(this.dataJson)
            this.ShowData()
            console.log("Отправка на сервер")
            fetch('http://192.168.50.250:8081/api/v1/earth/delete/byId?id='+this.dataJson[index].id,{
              method:  'POST',})
              .then(response => response.json())
              .then(data => console.log(data))
            //console.log('http://192.168.50.250:8081/api/v1/earth/delete/byId?id='+this.dataJson[index].id)
        }
    },
    async mounted() {
    try {
        const response = await fetch('http://192.168.50.250:8081/api/v1/earth/get/list');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        else{
          const result = await response.json();
          let date = new Date();
          let datetime = date.getDate()+"."+date.getMonth()+"."+date.getFullYear()+" "+ date.getHours()+":"+ date.getMinutes()+":"+ date.getSeconds()
          console.log(result, datetime);
          this.timefetch = datetime
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
  
  .PanelTable{
    width: 100%;
    position: sticky;
    background-color: #014F86;
    border-radius: 10px;
    margin-top: 20px;
    bottom: 10px;
    color: white;

    .TableInfo{
      margin-top: 5px;
      margin-bottom: 5px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
      justify-content: space-evenly;
      padding: 5px 0px;

      div{
        &.Yes{
          border-bottom: 2px solid green;
        }
        &.No{
          border-bottom: 2px solid red;
        }
      }
      .ButtonApproved
       {
        height: 100%;
        button{
          background-color: #013A63;
          border: solid 2px #012A4A;
          border-radius: 10px;
          padding: 7px;
          width: 100%;
          font-size: 18px;
          color: #FFFFFF;
          display: flex;
          flex-direction: row;
          align-items: center;
          img{
            width: 30px;
            margin-right: 5px;
          }

          &.Save{
            box-shadow: 3px 3px 3px green;
          }
          &.NotSave{
            box-shadow: 3px 3px 3px red;
          }
          &.disabled{
            background-color: #24608b;
            border: solid 2px #acc5d8;
            pointer-events:none;
          }
          &:active{
            padding: 5px;
            background-color: #012c4b;
          }
        }
      }

    }
  }

  

}
</style>