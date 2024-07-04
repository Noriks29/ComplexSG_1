
<template>
    <canvas class="orb-canvas" id="orb-canvas"></canvas>
    <transition name="translate" mode="out-in"> 
      <component :is="activeComponent" :ActiveComponent="ActiveComponents" @updateParentComponent="ChangeComponents" :systemStatus="systemStatus" @ChangeSystemStatus="ChangeSystemStatus"></component> 
    </transition> 
    <LoadProcess />
   
    

</template> 
<script>
import TemplateComponent from './components/TemplateComponent.vue'
import NP from './components/NP/NP.vue'
import OG from './components/OG/OG.vue'
import TypeKA from './components/TypeKA/TypeKA.vue';
import KA1 from './components/KA/KA1.vue';
import SystemWindow from './components/System/SystemWindow.vue';
import TargetDZZ from './components/TargetDZZ/TargetDZZ.vue'
import EarthConstellation from './components/EarthConstellation/EarthConstellation.vue'
import LoadProcess from './components/LoadProcess.vue'
import EstimationConstellation from './components/EarthConstellation/EstimationConstellation.vue'
import TargetRoad from './components/TargetRoad/TargetRoad.vue';
import {CanvasBackground}  from './js/sky.js';
import {DisplayLoad, FetchGet, FetchPost} from './js/LoadDisplayMetod.js'

import GlobalStyle from './style/GlobalStyle.scss'



export default {
  name: 'App',
  css:{
    GlobalStyle
  },
  data() {
    return{
      activeComponent: "TemplateComponent",
      systemStatus: {},
      ActiveComponents: {
          NP: true,
          OG: true,
          TypeKA: true,
          SystemWindow: true,
          TargetRoad: false,
          TargetDZZ: false,
          EarthConstellation: false,
          EstimationConstellation: false,
          KA1: false
        },
    };
  },
  methods: {
      ChangeComponents(nameObject) {
        console.log(nameObject.name,nameObject);
        this.activeComponent = nameObject.nameComponent
      },
      ActiveComponentValidate(){
        if(this.systemStatus.constellationStatus == true && this.systemStatus.earthStatus == true)
        {
          this.ActiveComponents = {
            NP: true,
            OG: true,
            TypeKA: true,
            SystemWindow: true,
            TargetDZZ: true,
            EarthConstellation: true,
            EstimationConstellation: true,
            TargetRoad: true,
            KA1: true
          }
        }
        else{
          this.ActiveComponents = {
            NP: true,
            OG: true,
            TypeKA: true,
            SystemWindow: true,
            TargetRoad: false,
            TargetDZZ: false,
            EarthConstellation: false,
            EstimationConstellation: false,
            KA1: false
          }
        }
      },
      async ChangeSystemStatus(data){
        this.systemStatus = data
        let response = await FetchPost('/api/v1/system/update', this.systemStatus)
        console.log(response)
        this.ActiveComponentValidate()
      }
    },
  async mounted() {
    DisplayLoad(true)
    const canvasBG = new CanvasBackground('orb-canvas'); //запускаем звёзды
    canvasBG.start();
    let rezult = await FetchGet('/api/v1/system/get')
    console.log(rezult)
    this.systemStatus = rezult;
    this.ActiveComponentValidate()
    console.log(this.systemStatus)
    DisplayLoad(false)
  },
  components: {
    TemplateComponent,
    NP,
    OG,
    TypeKA,
    KA1,
    SystemWindow,
    TargetDZZ,
    EarthConstellation,
    LoadProcess,
    EstimationConstellation,
    TargetRoad
  }
}
</script>

<style lang="scss">
body{
  .orb-canvas{
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    z-index: -1;
  }
}
</style>

