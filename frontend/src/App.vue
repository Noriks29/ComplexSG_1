
<template>
    <canvas class="orb-canvas" id="orb-canvas"></canvas>
    <transition name="translate" mode="out-in"> 
      <component :is="activeComponent" @updateParentComponent="ChangeComponents" :systemStatus="systemStatus" @ChangeSystemStatus="ChangeSystemStatus"></component> 
    </transition> 
    <LoadProcess />
   
    

</template> 
<script>
import TemplateComponent from './components/TemplateComponent.vue'
import NP from './components/NP.vue'
import OG from './components/OG/OG.vue'
import TypeKA from './components/TypeKA/TypeKA.vue';
import KA1 from './components/KA/KA1.vue';
import SystemWindow from './components/System/SystemWindow.vue';
import TargetDZZ from './components/TargetDZZ/TargetDZZ.vue'
import EarthConstellation from './components/EarthConstellation/EarthConstellation.vue'
import LoadProcess from './components/LoadProcess.vue'
import EstimationConstellation from './components/EarthConstellation/EstimationConstellation.vue'
import {CanvasBackground}  from './js/sky.js';
import {DisplayLoad, FetchGet, FetchPost} from './js/LoadDisplayMetod.js'



export default {
  name: 'App',
  data() {
    return{
      activeComponent: "TemplateComponent",
      systemStatus: {},
    };
  },
  methods: {
      ChangeComponents(nameObject) {
        console.log(nameObject.name,nameObject);
        this.activeComponent = nameObject.nameComponent
      },
      async ChangeSystemStatus(data){
        this.systemStatus = data
        let response = await FetchPost('/api/v1/system/update', this.systemStatus)
        console.log(response)
      }
    },
  async mounted() {
    DisplayLoad(true)
    const canvasBG = new CanvasBackground('orb-canvas'); //запускаем звёзды
    canvasBG.start();
    let rezult = await FetchGet('/api/v1/system/get')
    this.systemStatus = rezult;
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
    EstimationConstellation
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

}
body{
  background: rgb(0, 0, 0);
  background-attachment: fixed;
  background-repeat: no-repeat;
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

