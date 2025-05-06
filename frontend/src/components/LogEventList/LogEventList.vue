<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
          
          
    <div class="ContentDiv">
      <div class="TitleText">Каталог лога событий</div>
    <div class="Panel MaxWidth TableDiv">
      <table class="TableDefault"><thead>
        <tr v-if="dataJson.length > 0">
          <th>ID</th>
          <th>Код</th>
          <th>Событие</th>
          <th></th>
        </tr></thead><tbody>
        <tr
          v-for="(data, index) in dataJson"
          :key="index"
          :class="!modellingStatus ? 'active' :''"
          @change="ChangeParam"
        >
            <td>{{ data.id }}</td>
            <td><input :id="index" type="number" name="codeEvent"
                :value="data.codeEvent"></td>
            <td><input :id="index" name="descriptionEvent" class="description"
                :value="data.descriptionEvent"></td>
          <td v-if="!modellingStatus" :id="index" @click="DeleteRow(index)"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
        </tr></tbody><tfoot>
        <tr class="addRowButton">
          <td colspan="4"><button @click="AddRow">
            <img src="../../assets/add.png" alt="" class="addButtonIcon">
            Добавить
          </button></td>
        </tr></tfoot>
      </table>
    </div>
    </div>
    </div>
  </template>
  
  <script>
import {DisplayLoad, FetchGet, FetchPost} from '../../js/LoadDisplayMetod.js'
  export default {
    name: 'LogEventList',
    data(){
      return{
        dataJson: []
      }
    },
    props:{
    systemStatus:{
          type: Object
        },
        modellingStatus:{
          type: Boolean
        }
    },
    methods: {
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
      async setPost() {
          DisplayLoad(true)
          let data = []
          this.dataJson.forEach(element => {
            console.log(element.codeEvent, element.descriptionEvent)
            if(element.codeEvent != "" && element.descriptionEvent != ""){
                data.push(element)
            }
          })
          if(data.length == this.dataJson.length){
            await FetchPost("/api/v1/event/code/add", data)
            await this.ReFetch()
          }
          DisplayLoad(false)
        },
        async AddRow(){
          var addedRow = {'id' : undefined, 'codeEvent' : "", 'descriptionEvent' : "", 'deleted': false};
          this.dataJson.push(addedRow);   
        },
        ChangeParam(event){
          console.log(event)
          this.dataJson[Number(event.target.id)][event.target.name] = event.target.value
          this.setPost()
        },
        async DeleteRow(index){
            this.dataJson[index].deleted = true
            await this.setPost()
            await this.ReFetch()
        },
        async ReFetch(){
          DisplayLoad(true)
          this.dataJson = await FetchGet('/api/v1/event/codes/all') || []
          DisplayLoad(false)
        }
      
    },
    async mounted() {
      DisplayLoad(true)
      this.dataJson = await FetchGet('/api/v1/event/codes/all') || []
      DisplayLoad(false)
    }
  }
  </script>

  <style lang="scss" scoped>
.description{
    width: 30vw;
}

</style>