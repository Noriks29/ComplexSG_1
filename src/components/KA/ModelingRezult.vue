<template>
    
    <div class="ModellingPanel" :class="RezultShow?'show':''">
      <Menu :style="'margin: 1px;min-width: fit-content;overflow-y:auto;overflow-x:hidden;'" :model="rezultMenu">
          <template #item="{ item }">
            <Dropdown v-if="item.button" v-model="valueSS" :options="arr" @change="SelectChange($event.value)" optionLabel="lable" />
            <a v-else class="flex align-items-center p-menuitem-link" :class="{ 'p-disabled': item.disabled }">
              <span :class="item.icon"  v-if="item.icon"/>
              <span>{{ " "+item.label }}</span>
              <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
                {{ item.shortcut }}
              </span>
            </a>
          </template>
        </Menu>
        <!--
      <div class="tdflexRow">
        <p>Сводки</p>
        <button v-if="systemStatus.typeWorkplace==2" @click="ShowTable='E77E78'" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План выполнения заявок</button>
        <button v-if="systemStatus.typeWorkplace==2" @click="ShowTable='BookmarkTable'" :class="(modellingRezult.E77.length < 1 || modellingRezult.E78.length < 1 ) ? 'disable' : ''" class="ButtonCommand">План закладок</button>
        <button v-if="systemStatus.typeWorkplace in {1:null,3:null,4:null}" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" @click="ShowTablePanel('LogComplet')" class="ButtonCommand">Лог выполнения заявок</button>
        <button v-if="systemStatus.typeWorkplace in {3:null,4:null}" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" @click="ShowTablePanel('LogDownload')" class="ButtonCommand">Лог доставки данных</button>
        <button v-if="systemStatus.typeWorkplace in {3:null,4:null}" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" @click="ShowTablePanel('StatisticComponent')" class="ButtonCommand">Статистика</button>
      </div>
      <div class="tdflexRow">
        <p>Работа КА</p>
        <Dropdown v-model="valueSS" :options="arr" @change="SelectChange($event.value)" optionLabel="lable" />
        <button @click="ShowTablePanel('ShootingPlan')" :class="(modellingRezult.Select.E77.length < 1) ? 'disable' : ''" class="ButtonCommand">План съёмок</button>
        <button v-if="systemStatus.typeWorkplace in {2:null}" @click="ShowTable='E78Table'" :class="(modellingRezult.Select.E78.length < 1) ? 'disable' : ''" class="ButtonCommand">План доставки</button>
        <button @click="ShowTablePanel('FlightplanForm')" :class="(modellingRezult.Select.E79.length < 1) ? 'disable' : ''" class="ButtonCommand">План полёта</button>
        <button @click="ShowTablePanel('FcLog')" :class="(modellingRezult.Select.fcLog.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог полёта</button>
      </div>
      <div class="tdflexRow">
        <p>Система</p>
        <button @click="ShowTablePanel('LogAll')" :class="(modellingRezult.log.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог движка</button>
        <button @click="ShowTablePanel('EventLog')" :class="(modellingRezult.events.length < 1) ? 'disable' : ''" class="ButtonCommand">Лог событий</button>
        <button @click="ShowTablePanel('LogSmao')" :class="(modellingRezult.Smao.length < 1) ? 'disable' : ''" class="ButtonCommand"><img src="../../assets/instructions.png" alt="smaoResponse" width="32"></button>
      </div>-->
  </div>
</template>
  
<script>
import Dropdown from 'primevue/dropdown';
  export default {
    name: 'ModelingRezult',
    data(){
      return{
        RezultShow: false,
        modellingRezult: {
          log: [],
          E77: [],
          E78: [],
          hide: [],
          E79: [],
          Smao: [],
          events: [],
          fcLog:[],
          Select: {
            E77: [],
            E78: [],
            E79: [],
            fcLog:[],
            selectKA: undefined
          }
        },
        arr: [],
        valueSS: {},
        rezultMenu:[
          {label: 'Сводки',items: []},
          {label: 'Работа КА',items: []},
          {label: 'Система',items: []},
        ],
      }
    },
    props:{
        systemStatus:{
            type: Object
        },
    },
    components:{
      Dropdown
    },
    methods: {
        RezultShowChange(status){
            this.RezultShow = status
        },
        dataTransfer(data){ //доставка данных в компонент с моделлирования
          this.modellingRezult = data
          this.SelectChange(this.valueSS)
          this.CreateMenu()
        },
        async SelectChange(target){
          await this.$SetModellingRezultSelect(target.value)
          this.modellingRezult = this.$GetModellingRezult()
          this.ShowTablePanel(null)
          this.CreateSelectMenu()

        },
        ShowTablePanel(mode){
          this.$emit('showRezult', mode)
        },
        
        async modellingRezultSelect_FillById(id){ //выбор данных под ка
        await this.$SetModellingRezultSelect(id)
      },
      CreateMenu(){
        this.rezultMenu = [
          {label: 'Сводки',items: []},
          {label: 'Работа КА',items: []},
          {label: 'Система',items: []},
        ],
        this.rezultMenu[2].items.push({ label: 'Лог движка', command: () => this.ShowTablePanel('LogAll'), disabled: this.modellingRezult.log.length < 1})
        this.rezultMenu[2].items.push({ label: 'Лог событий', command: () => this.ShowTablePanel('EventLog'), disabled: this.modellingRezult.events.length < 1})
        this.rezultMenu[2].items.push({ icon: 'pi pi-receipt', label: 'Лог SMAO', command: () => this.ShowTablePanel('LogSmao'), disabled: this.modellingRezult.Smao.length < 1})

        if(this.systemStatus.typeWorkplace==2)this.rezultMenu[0].items.push({ label: 'План выполнения заявок', command: () => this.ShowTablePanel('E77E78'), disabled: this.modellingRezult.E77.length < 1 || this.modellingRezult.E78.length < 1 })
        if(this.systemStatus.typeWorkplace==2)this.rezultMenu[0].items.push({ label: 'План закладок', command: () => this.ShowTablePanel('BookmarkTable'), disabled: this.modellingRezult.E77.length < 1 || this.modellingRezult.E78.length < 1 })
        if(this.systemStatus.typeWorkplace in {1:null,3:null,4:null})this.rezultMenu[0].items.push({ label: 'Лог выполнения заявок', command: () => this.ShowTablePanel('LogComplet'), disabled: this.modellingRezult.events.length < 1})
        if(this.systemStatus.typeWorkplace in {3:null,4:null})this.rezultMenu[0].items.push({ label: 'Лог доставки данных', command: () => this.ShowTablePanel('LogDownload'), disabled: this.modellingRezult.events.length < 1})
        if(this.systemStatus.typeWorkplace in {3:null,4:null})this.rezultMenu[0].items.push({ label: 'Статистика', command: () => this.ShowTablePanel('StatisticComponent'), disabled: this.modellingRezult.events.length < 1})
        
        this.CreateSelectMenu()
      },
      CreateSelectMenu(){
        this.rezultMenu[1].items = []
        this.rezultMenu[1].items.push({button:true})
        this.rezultMenu[1].items.push({ label: 'План съёмок', command: () => this.ShowTablePanel('ShootingPlan'), disabled: this.modellingRezult.Select.E77.length < 1})
        if(this.systemStatus.typeWorkplace==2)this.rezultMenu[1].items.push({ label: 'План доставки<', command: () => this.ShowTablePanel('E78Table'), disabled: this.modellingRezult.Select.E78.length < 1})
        this.rezultMenu[1].items.push({ label: 'План полёта', command: () => this.ShowTablePanel('FlightplanForm'), disabled: this.modellingRezult.Select.E79.length < 1})
        this.rezultMenu[1].items.push({ label: 'Лог полёта', command: () => this.ShowTablePanel('FcLog'), disabled: this.modellingRezult.Select.fcLog.length < 1})
      },
      async ReLoadComponent(){
        this.ConstellationJson = this.$OGList().value
        let result = await this.$FetchGet('/api/v1/satrequest/request/get/all') || []
        this.purposesJson = result.length
        this.arr = []
        console.log(this.ConstellationJson)
        for (let i = 0; i < this.ConstellationJson.length; i++) {
          for (let index = 0; index < this.ConstellationJson[i].satellites.length; index++) {
            const element = this.ConstellationJson[i].satellites[index];
            this.arr.push({value: element.satelliteId, lable: element.name})
          }
        }
        try {
          this.valueSS = {lable: this.arr[0].lable, value: this.arr[0].value}
          this.modellingRezult.Select.selectKA = this.arr[0].value
        } catch (error) {console.error(error)}
      }
    },
    async mounted(){
      await this.ReLoadComponent()
      document.addEventListener('keydown', (event) => {
            if (event.code == 'Escape') {
                this.ShowTable = null
            }
          });
      
      
    
      //  <Dropdown v-model="valueSS" :options="arr" @change="SelectChange($event.value)" optionLabel="lable" />
    
    }
  }
  </script>


<style lang="scss" scoped>
  .PanelSettings{
    display: flex;
    height: 100%;
    text-align: left;
    flex-direction: column;
    fieldset{
      flex: 1;
    }
  }

  .ModellingPanel{
    background-color: var(--color-bg-panel);
    margin: 5px 5px 5px 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: 0px;
    overflow: hidden;
    padding: 0px;
    transition: all 0.5s linear;
    &.show{
      padding: 5px;
      overflow-x: hidden;
      overflow-y: auto;
      width: 210px;
    }
  }
  .tdflexRow{
    width: 200px;
    display: flex;
    flex-direction: column;
  }
</style>