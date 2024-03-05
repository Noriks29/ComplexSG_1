<template>
    <div class="SelectOG ">
      <div class="divflex">
        {{ dataJson }}
        <div @click="DisplayOGList= !DisplayOGList" >{{ tableDisplay ? dataJsonTable.constellationName : 'Орбитальная группировка не выбрана' }}</div>
        <table :class="DisplayOGList ? 'active' :'disable'">
            <tr v-for="data, index in dataJson"
                :key="index"
                @click="SelectOGData(index)"
                
                >
            <td>{{ data.constellationName }}</td><td>{{ data.arbitraryFormation ? "Произвольное" : "Плоскостное" }}</td>
                <td v-if="!approved" :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
          <tr v-if="!approved" class="addRowButton">
            <td colspan="3"><Button @click="AddRow">Добавить КА</Button></td>
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
            <button v-if="!approved" @click="SatartSave" :class="datasave ? 'Save' :'NotSave'"> <img src="../../assets/save.svg">Сохранить</button>
          </div>
          <div class="ButtonApproved"> 
            <button v-if="!approved" @click="SatartApproved" :class="datasave ? 'active' :'disabled'" > <img src="../../assets/approve.svg">Утвердить</button>
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

    
  .divflex{
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    position: relative;
    top: 10px;
    left: 0px;
    color:white;

    table{
      width: 75%;
      table-layout: fixed;
      border-spacing: 0px;
      overflow: hidden;
      position: relative;
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
        position: absolute;
      }    
      &.active 
        {
          tr {
            top: 0px;
            opacity: 1;
          }
          filter: drop-shadow(2px 2px 7px #A9D6E5);
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
        
        .iconDelete{
          width: 25px;
          height: 25px;
        }

        td {
          overflow-wrap: break-word;
          padding: 5px;
          border-top: 1px solid #013A63;
          background-color: #A9D6E5;

          &:first-child{
            width: 70%;

          }
        }
        
    
      }
      
    }
  }
}


</style>