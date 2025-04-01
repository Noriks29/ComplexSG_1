<template>
    <div class="main_contain">
      <TableData v-if="selectOG != undefined" :dataOGLocal="selectOG" :approved="approved" @closetable="closeTable('dataOG')"/>
      <CreateOGPanel v-if="addRowTable" @closetable="closeTable('CreateOG')"/>
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="@/assets/exit.svg"><span>&#8203;</span>
            </button>
          </div>
    <div class="ContentDiv">
        <h1 class="TitleText">Список орбитальных группировок</h1>
          
    <div class="SelectDivPanel Panel MaxWidth">
      <table style="border-spacing: 0 1em;">
        <tr v-for="data, index in dataJson"
          :key="index"
          v-show="!(data.deleted==true)"
          class="PanelDefault"
        >
          <td  @click="selectOG = data">{{ data.constellationName }}</td>
          <td  @click="selectOG = data">{{ OGType[data.inputType] }}</td>
          <td class="iconDelete" v-if="!approved && !modellingStatus" @click="DeleteRowOG(data)"><img  src="@/assets/delete.svg" alt="Удалить"></td>
        </tr>
        <tr v-if="!approved && !modellingStatus" class="PanelDefault">
          <td @click="addRowTable = true" colspan="3" style="text-align: center;"><img src="@/assets/add.png" alt="" class="addButtonIcon">Добавить орбитальную группировку</td>
        </tr>
      </table>
    </div>
          
     
    <div class="Panel TableInfo MaxWidth" v-if="!modellingStatus">
          <div :class="approved ? 'Yes' :'No'">
            {{ approved ? " Утверждено" : "Не Утверждено" }}
          </div>
          <div v-if="approved" class="ButtonApproved">
            <button @click="ChangeApproved(false)" class="ButtonDefault"> <img src="../../assets/edit.svg">Редактировать</button> 
            <button class="ButtonDefaultShadow"><span>&#8203;</span></button>  
          </div>
          <div v-else class="ButtonApproved"> 
            <button @click="ChangeApproved(true)" class="ButtonDefault"> <img src="../../assets/approve.svg">Утвердить</button>
            <button class="ButtonDefaultShadow"><span>&#8203;</span></button>
          </div>
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
      async ChangeApproved(status){
          await ChangeSystemObject('constellationStatus', status)
          this.approved = SystemObject.constellationStatus
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
.SelectDivPanel{
    display: flex;
    flex-direction: column;
    align-items: center;
    .DataTable{
    width: 100%;

  }
}

table{
  width: 96%;
  padding: 2%;
  td{
    padding: 20px 10px;
  }
  border-spacing: 0 1em;
}

.iconDelete{
  width: 30px;
}

.PanelDefault{
  background-color: rgba(151, 151, 151, 0.15);
  box-shadow: -4px 3px 1px rgba(63, 60, 60, 0.35);
  border: 2px solid rgba(0, 0, 0, 0.25);
}



</style>
  
