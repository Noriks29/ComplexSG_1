<template>
    <div class="main_contain RowSection">
      <TableData v-if="selectOG != undefined" :dataOGLocal="selectOG" :approved="approved" @closetable="closeTable('dataOG')"/>
      <CreateOGPanel v-if="addRowTable" @closetable="closeTable('CreateOG')"/>
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="@/assets/exit.svg"><span>&#8203;</span>
            </button>
            <h1 class="TitleText">Орбитальные группировки и космические аппараты</h1>
          </div>

    <div class="ContentDiv">
    <div class="Panel LeftPanel">
      <div>Список ОГ</div>
        <div v-for="data, index in dataJson"
          :key="index"
          v-show="!(data.deleted==true)"
          class="ElementCol"
        >
          <div  @click="selectOG = data" type="name">{{ data.constellationName }}</div>
          <div  @click="selectOG = data" type="type">{{ OGType[data.inputType] }}</div>
          <div class="iconDelete" @click="DeleteRowOG(data)" type="icon"><img  src="@/assets/delete.svg" alt="Удалить"></div>
        </div>
        <div>
          <button class="ButtonCommand" :class="approved? '' : 'disable'"  @click="addRowTable = true"><img src="@/assets/add.png" alt="" class="addButtonIcon">Добавить орбитальную группировку</button>
        </div>


        <div class="ButtonApprovedDiv"><button @click="ChangeApproved" class="ButtonCommand" :class="approved? 'green' : 'red'">
          <span v-if="approved"><img src="../../assets/edit.svg"></span>
          <span v-else><img src="../../assets/approve.svg"></span>
          <span>{{ approved ?  'Редактировать' : 'Утвердить'}}</span>
        </button></div>
    </div>

          
     
    
  </div>
</div>
</template>
  
  <script>
import TableData from './OG/OG_tableFree.vue'
import {DisplayLoad, FetchGet, FetchPost} from '@/js/LoadDisplayMetod'
import CreateOGPanel from './OG/CreateOGPanel.vue'
import { PagesSettings } from './PagesSettings.js';
import { OGList, ChangeOG, SystemObject, ChangeSystemObject} from '@/js/GlobalData';


  export default {
    name: 'OG',
    mixins: [PagesSettings],
    data() {
      return {
        OGType: {1: "Произвольное построение", 2:"Системное построение", 3:"Загруженно из TLE"},
        dataJson: [],
        selectOG: undefined,
        approved: true,
        addRowTable: false,
      }
    },
    components:
    {
      TableData,
      CreateOGPanel
    },
    methods: {
      async closeTable(table) {
        if(!this.approved){
          await ChangeOG(await FetchGet('/api/v1/constellation/get/list') || [])
        }
        this.dataJson = OGList
        if(table == "dataOG"){
          this.selectOG = undefined
        }
        if(table == "CreateOG"){
          this.addRowTable = false
        }
      },
      async DeleteRowOG(data){
        await FetchPost('/api/v1/constellation/delete/byId',{},'id='+data.id)
        this.selectOG = undefined
        this.dataJson = await FetchGet('/api/v1/constellation/get/list') || []
        ChangeOG(this.dataJson)
      },
      async ChangeApproved(){
          this.approved = !this.approved
          await ChangeSystemObject('constellationStatus', this.approved)
        }
    },
    async mounted(){
      DisplayLoad(true)
      this.approved = SystemObject.constellationStatus
      this.dataJson = OGList
      DisplayLoad(false)
    },
    
  }
  </script>

<style lang="scss" scoped>
.ElementCol{
  display: grid;
  grid-template-columns: 4fr 3fr 1fr;
  background: var(--background-Button1);
  color: var(--color-Main);
  border: 1px solid var(--border-button);
  padding: 5px;
  font-size: var(--font-size);
  border-radius: 5px;
  margin: 1px 5px;
  transition: all 0.2s;
  
  div{
    flex: 0 1 auto; 
    padding: 5px 10px;
    &[type="name"]{
      flex-basis: 40%;
    }
    &[type="type"]{
      flex-basis: 40%;
    }
    &[type="icon"]{
      flex-basis: 20%;
    }
  }
}
.ButtonApprovedDiv button{
  display: flex;
  width: 94%;
  justify-content: space-between;
  margin: 3%;
  align-items: center;
  transition: box-shadow 1s ;

  &.red{
    box-shadow: inset -2px -2px 1px 0px red;
  }
  &.green{
    box-shadow: inset 2px 2px 1px 0px green;
  }
}
.SelectDivPanel{
    display: flex;
    flex-direction: column;
    align-items: center;
    .DataTable{
    width: 100%;

  }
}
.iconDelete img{
  width: 30px;
}




</style>
  
