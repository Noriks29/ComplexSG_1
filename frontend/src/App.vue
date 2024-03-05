
<template>
    <canvas class="orb-canvas" id="orb-canvas"></canvas>
    <transition name="translate" mode="out-in"> 
      <component :is="activeComponent" @updateParentComponent="ChangeComponents"></component> 
    </transition> 
   
    

</template> 
<script>
import TemplateComponent from './components/TemplateComponent.vue'
import NP from './components/NP.vue'
import OG from './components/OG/OG.vue'
import {CanvasBackground}  from './js/sky.js';

export default {
  name: 'App',
  data() {
    return{
      activeComponent: "TemplateComponent",
    };
  },
  methods: {
      ChangeComponents(nameObject) {
        console.log(nameObject.name,nameObject);
        this.activeComponent = nameObject.nameComponent
      }
    },
  mounted() {
    const canvasBG = new CanvasBackground('orb-canvas');
    canvasBG.start();
  },
  components: {
    TemplateComponent,
    NP,
    OG
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
  /*background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(0,0,255,1) 50%, rgba(255,0,0,1) 100%);*/
  background: rgb(0, 0, 0);
    /*background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 33%, rgba(0,0,255,1) 34%, rgba(0,0,255,1) 66%, rgba(255,0,0,1) 67%, rgba(255,0,0,1) 100%);
    background-repeat: no-repeat;
    backdrop-filter: none;
    background-attachment: fixed;*/
  //background-image: url('~@/assets/sky2.jpg'); 
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

