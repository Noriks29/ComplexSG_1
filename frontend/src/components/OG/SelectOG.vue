<template>
    <TableData v-if="ShowTableID == true" :dataOGLocal="selectOG" :approved="approved" @closetable="closeTableData"/>
    <div class="SelectDiv ">
      <div class="PanelDefault"
        v-for="data, index in dataJson"
          :key="index"
          v-show="!(data.deleted==true)"
      >
        <div @click="SelectOGData(data)" class="flexrow">
          <div> {{data.constellationName}} </div><div>{{ data.arbitraryFormation == "true" ? "Произвольное" : "Плоскостное" }}</div>
          <div v-html="ShowTableStatus(data)"></div>
        </div>
        <div>
          
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
            <SelectDiv  
                :dataOption="[{value: true, lable: 'Произвольное построение' },
                  {value: false, lable: 'Плоскостное построение' },
                ]" @valueSelect="SelectChange"/>
          </div>
          <div>
            <button @click="AddRow" class="ButtonDefault"> Сохранить </button> 
            <button class="ButtonDefaultShadow"><span>&#8203;</span></button>
          </div>
        </div>
      </div>
    
      <div class='DataTable'>
        
        <div class="PanelTable">
        <div class="TableInfo PanelDefault">
          <div :class="approved ? 'Yes' :'No'">
            {{ approved ? " Утверждено" : "Не Утверждено" }}
          </div>
          <div v-if="approved" class="ButtonApproved">
            <button @click="ChangeSystemStatus(false)" class="ButtonDefault"> <img src="../../assets/edit.svg">Редактировать</button> 
            <button class="ButtonDefaultShadow"><span>&#8203;</span></button>  
          </div>
          <div v-else class="ButtonApproved"> 
            <button @click="ChangeSystemStatus(true)" class="ButtonDefault"> <img src="../../assets/approve.svg">Утвердить</button>
            <button class="ButtonDefaultShadow"><span>&#8203;</span></button>
          </div>
        </div>
        </div>
      </div>
    </div>
</template>

<script>

import TableData from './OG_tableFree.vue'
import {DisplayLoad, FetchGet, FetchPost} from '../../js/LoadDisplayMetod.js'
import SelectDiv from '../SelectDiv.vue';

  export default {
    name: 'SelectMode',
    data(){
        return{
            dataJson: {},
            selectOG: {},
            ShowTableID: false,
            approved: true,
            addRowStart: false,
            selectedType: '',
            inputName: ''
        }
    },
    props:{
    systemStatus:{
          type: Object
        },
    },
    components:
    {
      TableData,
      SelectDiv
    },
    methods: {
        closeTableData() {
            this.ShowTableID = false
            this.selectOG = {}
        },
        SelectOGData(data){
              this.ShowTableID = true
              this.selectOG = data
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
          ChangeSystemStatus ( stat ){
            this.approved = stat
            let dataSystem = this.systemStatus
            dataSystem.constellationStatus = this.approved
            this.$emit('ChangeSystemStatus', dataSystem)
          },
          setPost(datapost) {
            FetchPost("/api/v1/constellation/update", datapost)
          },
          GetValueModalWind(status) {
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
          },

    },
    async mounted() {
      DisplayLoad(true)
      this.approved = this.systemStatus.constellationStatus
      let result = await FetchGet('/api/v1/constellation/get/list')
      this.dataJson = result || {}
      DisplayLoad(false)
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
    .DataTable{
    width: 100%;
  }
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