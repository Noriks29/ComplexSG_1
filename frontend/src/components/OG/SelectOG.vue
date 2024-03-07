<template>
    <div class="SelectOG ">
      <div class="divflex PanelDefault">
        <div @click="DisplayOGList= !DisplayOGList" >{{ tableDisplay ? dataJsonTable.constellationName : 'Орбитальная группировка не выбрана' }}</div>
        <table :class="DisplayOGList ? 'active' :'disable'" class="TableDefault" >
            <tr v-for="data, index in dataJson"
                :key="index"
                @click="SelectOGData(index)"
                
                >
            <td colspan="2">{{ data.constellationName }}</td><td>{{ data.arbitraryFormation ? "Произвольное" : "Плоскостное" }}</td>
                <td v-if="!approved" :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
          <tr v-if="!approved" class="addRowButton">
            <td colspan="4"><Button @click="AddRow">Добавить ОГ</Button></td>
          </tr> 
        </table>
      </div>
        <div class='DataTable'>
        <TableData :dataOGLocal="dataJsonTable.dtoConstellationArbitraryList" :approved="approved" :datasave="datasave" @updateDataSave="ChangeDataSave"/>
        <div class="PanelTable">
        <div class="TableInfo PanelDefault">
          <div :class="approved ? 'Yes' :'No'">
          {{ approved ? " Утверждено" : "Не Утверждено" }}
          </div>
          <div class="ButtonApproved">
          <button v-if="approved" @click="SatartEditing" class="ButtonDefault"> <img src="../../assets/edit.svg">Редактировать</button> 
          <button v-if="approved" class="ButtonDefaultShadow"></button>  
        </div>
        <div class="ButtonApproved">
          <button v-if="!approved" @click="SatartSave" :class="!datasave ? '' :'Empty disabled'" class="ButtonDefault"> <img src="../../assets/save.svg">Сохранить</button>
          <button v-if="!approved && !datasave" class="ButtonDefaultShadow"></button>
        </div>
        <div class="ButtonApproved"> 
          <button v-if="!approved" @click="SatartApproved" :class="datasave ? '' :'Empty disabled'" class="ButtonDefault"> <img src="../../assets/approve.svg">Утвердить</button>
          <button v-if="!approved && datasave" class="ButtonDefaultShadow"></button>
        </div>
          
        </div>
      </div>
      </div>
    </div>
</template>

<script>

import jsons from '../../res/testOG.json'
import TableData from './OG_tableFree.vue'

  export default {
    name: 'SelectMode',
    data(){
        return{
            dataJson: jsons,
            DisplayOGList: false,
            tableDisplay: false,
            arbitraryFormationOG: true,
            dataJsonTable: [],
            TableNowInfo: "Орбитальная группировка не выбрана",
            approved: true,
            datasave: true
        }
    },
    components:
    {
      TableData
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
            this.dataJsonTable = this.dataJson[index]
            this.tableDisplay = true

        },
        AddRow(){
            var addedRow = {
                    'constellationName' : "ff",
                    'modelSat' : 0, 'dtoConstellationArbitraryList' : [],
                    'id' : 0, 'arbitraryFormation' : true,
                    'constellationOverviewList' : []
                };
            this.dataJson.push(addedRow);   
            this.datasave = false
          },
          DeleteRow(index){
              console.log("Удаление - ",index)
              this.dataJson.splice(index,1)
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
          setPost() {
            this.ShowData()
          },
          SatartSave(){
            this.setPost();
            this.datasave = true
          },

    }
  }
  </script>

<style lang="scss" scoped>
.SelectOG{
    color: white;
    padding: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    
  .divflex{
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    position: relative;
    top: 10px;
    /* left: 0px; */
    width: 70%;
    color: white;
    margin-bottom: 50px;
    background: none;
    box-shadow: none;
    border: none;

    table{
      width: 75%;
      table-layout: fixed;
      border-spacing: 0px;
      overflow: hidden;
      position: relative;
      transition: all 1s ease-in-out;
      background: none;
      background-color: rgba(151, 151, 151, 0);
      box-shadow: -4px 3px 1px rgba(63, 60, 60, 0);
      border: 2px solid rgba(0, 0, 0, 0);

      &.active 
        {
          tr {
            top: 0px;
            opacity: 1;
          }
          background-color: rgba(151, 151, 151, 0.15);
          box-shadow: -4px 3px 1px rgba(63, 60, 60, 0.35);
          border: 2px solid rgba(0, 0, 0, 0.25);
        }
        &.disable{
          tr {
            top: -200px;
            opacity: 0;
          }

        }
    
      tr{
        height: 35px;
        font-size: 20px;
        position: relative;
        transition: all 1s ease-in-out;
        padding-top: 5px;
        .iconDelete{
          width: 25px;
          height: 25px;
        }

        td {
          overflow-wrap: break-word;
          padding: 5px;
        }
        
    
      }
      
    }
  }
}


</style>