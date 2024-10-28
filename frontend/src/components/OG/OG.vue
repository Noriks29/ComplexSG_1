<template>
    <div class="main_contain">
      <TableData v-if="selectOG != undefined" :dataOGLocal="selectOG" :approved="approved" @closetable="closeTable('dataOG')"/>
      <CreateOGPanel v-if="addRowTable" @closetable="closeTable('CreateOG')"/>
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg"><span>&#8203;</span>
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
          <td  @click="selectOG = data">{{ data.inputType == 1 ? "Произвольное построение" : "Системное построение" }}</td>
          <td class="iconDelete" v-if="!approved" @click="DeleteRowOG(data)"><img  src="../../assets/delete.svg" alt="Удалить"></td>
        </tr>
        <tr v-if="!approved" class="PanelDefault">
          <td @click="addRowTable = true" colspan="3" style="text-align: center;"><img src="../../assets/add.png" alt="" class="addButtonIcon">Добавить орбитальную группировку</td>
        </tr>
      </table>
    </div>
          
     
    <div class="Panel TableInfo MaxWidth">
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
</template>
  
  <script>
import TableData from './OG_tableFree.vue'
import {DisplayLoad, FetchGet, FetchPost} from '../../js/LoadDisplayMetod.js'
import CreateOGPanel from '@/components/OG/CreateOGPanel.vue'


  export default {
    name: 'OG',
    data() {
      return {
        OGTableExists: false,
        dataJson: [],
        selectOG: undefined,
        approved: true,
        addRowTable: false,
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
      CreateOGPanel
    },
    methods: {
    SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
      async closeTable(table) {
        await this.reFetch()
        if(table == "dataOG"){
          this.selectOG = undefined
        }
        if(table == "CreateOG"){
          this.addRowTable = false
        }
      },
      ChangeSystemStatus ( stat ){
        this.approved = stat
        let dataSystem = this.systemStatus
        dataSystem.constellationStatus = this.approved
        this.$emit('ChangeSystemStatus', dataSystem)
      },
      async reFetch(){
        this.dataJson = []
        let result = await FetchGet('/api/v1/constellation/get/list')
        this.dataJson = await result
      },
      async DeleteRowOG(data){
        await FetchPost('/api/v1/constellation/delete/byId',{},'id='+data.id)
        this.selectOG = undefined
        this.reFetch()
      },
    },
    async mounted(){
      DisplayLoad(true)
      this.approved = this.systemStatus.constellationStatus
      let result = await FetchGet('/api/v1/constellation/get/list')
      this.dataJson = result || []
      console.log(this.dataJson)
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
  
