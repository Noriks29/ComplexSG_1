<template>
    <TableData v-if="ShowTableID == true" :dataOGLocal="selectOG" :approved="approved" @closetable="closeTableData"/>
    <div class="SelectDivPanel ">
      <div class="PanelDefault"
        v-for="data, index in dataJson"
          :key="index"
          v-show="!(data.deleted==true)"
      >
        <div @click="SelectOGData(data)" class="flexrow">
          <div> {{data.constellationName}} </div><div>{{ data.arbitraryFormation == true ? "Произвольное" : "Плоскостное" }}</div>
          <div v-html="ShowTableStatus(data)"></div>
        </div>
        <div>
          
        </div>
        
      </div>
      <div class="PanelDefault">
        <div v-if="!addRowStart" @click="addRowStart = true">Добавить Орбитальную группировку</div>
        <div v-else class="flexrow">
          <div class="inputdiv"><input type="text" v-model="inputName"></div>
          <div class="SelectDivInFlex">
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
            selectedType: undefined,
            inputName: undefined
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
        SelectChange(target){
          this.selectedType = target.value
        },
        AddRow(){
            if(this.selectedType != undefined && this.inputName != undefined)
            {
              var addedRow = {
                      'constellationName' : this.inputName,
                      'satellites' : [],
                      'id' : undefined, 'arbitraryFormation' : this.selectedType,
                      "statuswork" : "notSave"
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
      console.log(this.dataJson)
      DisplayLoad(false)
    }
  }
  </script>

<style lang="scss" scoped>
.SelectDivPanel{
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
        flex: 1;
        background-color: rgba(151, 151, 151, 0.15);
        border: 2px solid rgba(0, 0, 0, 0.25);
        padding: 5px;
      }
      &.SelectDivInFlex{
        flex: 1;
      }

      input{
        height: 35px;
        width: 99%;
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
}



</style>