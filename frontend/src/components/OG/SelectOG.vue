<template>
    <ModalWindow  v-if="modalwindowDisplay" mainText="Вы уверены что хотите выйти?" 
        infoText="Не сохранённые изменения будут утеряны" 
        trueText="Произвольное построение"
        falseText="Построение по плоскостям"
        @returnValue="GetValueModalWind"/>
    <div class="SelectDiv ">
      <div class="SelectDivList">
      <div class="divflex PanelDefault">
        <div @click="DisplayList= !DisplayList" >{{ tableDisplay ? dataJsonTable.constellationName : 'Орбитальная группировка не выбрана' }}</div>
        <table :class="DisplayList ? 'active' :'disable'" class="TableDefault" >
            <tr v-for="data, index in dataJson"
                :key="index"
                @click="SelectOGData(index)"
                v-show="!(data.deleted==true)"
                
                >
            <td colspan="2">{{ data.constellationName }}</td><td>{{ data.arbitraryFormation ? "Произвольное" : "Плоскостное" }}</td>
                <td v-if="!approved" :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
          <tr v-if="!approved" class="addRowButton">
            <td colspan="4"><Button @click="ShowModalWindow">Добавить ОГ</Button></td>
          </tr> 
        </table>
      </div>
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
import ModalWindow from '../ModalWindow.vue';

  export default {
    name: 'SelectMode',
    data(){
        return{
            dataJson: jsons,
            modalwindowDisplay: false,
            DisplayList: false,
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
            this.dataJsonTable = this.dataJson[index]
            this.tableDisplay = true
            this.DisplayList = false

        },
        AddRow(arbitraryFormation){
            var addedRow = {
                    'constellationName' : "ff",
                    'modelSat' : 0, 'dtoConstellationArbitraryList' : [],
                    'id' : -1, 'arbitraryFormation' : arbitraryFormation,
                    'constellationOverviewList' : []
                };
            this.dataJson.push(addedRow);   
            this.datasave = false
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


</style>