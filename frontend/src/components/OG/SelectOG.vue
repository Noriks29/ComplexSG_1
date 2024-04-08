<template>
    <ModalWindow  v-if="modalwindowDisplay" mainText="Вы уверены что хотите выйти?" 
        infoText="Не сохранённые изменения будут утеряны" 
        trueText="Произвольное построение"
        falseText="Построение по плоскостям"
        @returnValue="GetValueModalWind"/>
    <div class="SelectDiv ">
      <div class="PanelDefault"
        v-for="data, index in dataJson"
          :key="index"
          v-show="!(data.deleted==true)"
      >
        <div @click="SelectOGData(index)" class="flexrow">
          <div> {{data.constellationName}} </div><div>{{ data.arbitraryFormation == "true" ? "Произвольное" : "Плоскостное" }}</div>
          <div v-html="ShowTableStatus(data)"></div>
        </div>
        <div>
          
          <TableData v-if="ShowTableID == index" :dataOGLocal="data" :approved="approved"/>
        </div>
        
      </div>
      <div class="PanelDefault">
        <div v-if="!addRowStart" @click="addRowStart = true">Добавить Орбитальную группировку</div>
        <div v-else class="flexrow">
          <div class="inputdiv"><input type="text" v-model="inputName"></div>
          <div><select class="select-css" name="select" v-model="selectedType">
            <option selected value="true">Произвольное построение</option>
            <option value="false">Плоскостное построение</option>
          </select></div>
          <div>
            <button @click="AddRow" class="ButtonDefault"> Сохранить </button> 
            <button class="ButtonDefaultShadow"><span>&#8203;</span></button>
          </div>
        </div>
      </div>
    
      <div class='DataTable' style="width: 90%;">
        
        <div class="PanelTable">
        <div class="TableInfo PanelDefault">
          <div :class="approved ? 'Yes' :'No'">
            {{ approved ? " Утверждено" : "Не Утверждено" }}
          </div>
          <div v-if="approved" class="ButtonApproved">
            <button @click="SatartEditing" class="ButtonDefault"> <img src="../../assets/edit.svg">Редактировать</button> 
            <button class="ButtonDefaultShadow"><span>&#8203;</span></button>  
          </div>
          <div v-else class="ButtonApproved"> 
            <button @click="SatartApproved" class="ButtonDefault"> <img src="../../assets/approve.svg">Утвердить</button>
            <button class="ButtonDefaultShadow"><span>&#8203;</span></button>
          </div>
        </div>
        </div>
      </div>
    </div>
</template>

<script>

import jsons from '../../res/testOG.json'
import TableData from './OG_tableFree.vue'
import ModalWindow from '../ModalWindow.vue';
import {adress} from '../../js/config_server.js'

  export default {
    name: 'SelectMode',
    data(){
        return{
            dataJson: jsons,
            modalwindowDisplay: false,
            DisplayList: false,
            tableDisplay: false,
            ShowTableID: -1,
            TableNowInfo: "Орбитальная группировка не выбрана",
            approved: true,
            datasave: true,
            addRowStart: false,
            selectedType: '',
            inputName: ''
        }
    },
    components:
    {
      TableData,
      ModalWindow
    },
    methods: {
      ChangeDataSave(st){
        this.datasave = st.datasave
        console.log(st.datasave)
      },
        ShowOG() {
            console.log(this.dataJson)
        },
        SelectOGData(index){
            if(this.ShowTableID == index)
            { this.ShowTableID = -1 }
            else{
              this.ShowTableID = index
            }

        },
        ShowTableStatus(data){
          var color = ""
          var text = ""
          if(data.statuswork == "notSave")
          {
            color = "red"
            text = "Строка не сохранена"
          }
          else{
            color = "green"
            text = "Строка сохранена"
          }
          return "<div style='background-color:"+color+";'>"+text+"</div>"
        },
        AddRow(){
            if(this.selectedType != '' && this.inputName != '')
            {
              var addedRow = {
                      'constellationName' : this.inputName,
                      'arbitraryConstructions' : [],
                      'id' : undefined, 'arbitraryFormation' : this.selectedType,
                      'constellationOverviewList' : [], "statuswork" : "notSave"
                  };
              this.dataJson.push(addedRow);   
              this.datasave = false
              this.addRowStart = false
            }
            else{
              alert("Некоректные входные данные - '"+this.selectedType+"' - '"+this.inputName+"'")
            }
          },
          SatartApproved(){
            if(this.datasave){
              this.approved = true
            }
          },
          ShowData(){
            console.log(JSON.stringify(this.dataJson))
          },
          SatartEditing (){
            this.approved = false
          },
          setPost(datapost) {
            this.ShowData()
            console.log("Отправка на сервер")
            try {
              fetch('http://'+adress+'/api/v1/constellation/update',{
                method:  'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(datapost)
              })
                .then(response => response.json())
                .then(data => console.log(data))
              } catch (error) {
                  console.error('Error save:', error);
              }
          },
          SatartSave(){
            this.setPost(this.dataJson);
            this.datasave = true
          },
          GetValueModalWind(status) {
            console.log(status.status);
            switch(status.status){
              case 1:
                this.AddRow(true)
                break;
              case 0:{
                this.AddRow(false)
                break;
              }
              default:
                alert( "Ошибка!" );
            }
            this.modalwindowDisplay = false
          },
          ShowModalWindow() {
              this.modalwindowDisplay = true
          }

    },
    async mounted() {
    try {
        const response = await fetch('http://'+adress+'/api/v1/constellation/get/list');
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
  </script>

<style lang="scss" scoped>
.SelectDiv{
    color: white;
    padding: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 100px;
}
.PanelDefault{
  width: 90%;
  max-width: 95%;
  padding: 20px;

  .flexrow{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    div{
      margin: 0px 25px;
      position: relative;

      &.inputdiv{
        background-color: rgba(151, 151, 151, 0.15);
        border: 2px solid rgba(0, 0, 0, 0.25);
        padding: 5px;
      }

      input{
        height: 35px;
        width: 200px;
        background: none;
        border: none;
        color: white;
        font-size: 20px;
      }

      .ButtonDefault{
        height: 40px;
        width: 150px;
      }
    }
  }

  .select-css { 
    display: block;
    font-size: 20px;
    font-family: sans-serif;
    font-weight: 700;
    color: white;
    padding: 0 2.4em 0 0.8em;
    width: 100%;
    height: 49px;
    max-width: 100%;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
    border-radius: 0.5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: none;
    background-image: url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E);
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 0.65em auto, 100%; 
  } 
    .select-css::-ms-expand { display: none; } 
    .select-css:hover { border-color: #888; } 
    .select-css:focus { border-color: #aaa; 
      box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
      box-shadow: 0 0 0 3px -moz-mac-focusring; 
      color: white;
      background-color: black;
      outline: none; 
    } 
    .select-css option { font-weight:normal; } 
    *[dir="rtl"] .select-css, :root:lang(ar) .select-css, :root:lang(iw) .select-css { 
    background-position: left .7em top 50%, 0 0; 
    padding: .6em .8em .5em 1.4em; 
    }
}



</style>