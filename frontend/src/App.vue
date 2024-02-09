
<template> 
    <transition name="translate" mode="out-in"> 
      <component :is="activeComponent" @updateParentComponent="ChangeComponents"></component> 
    </transition> 
</template> 
<script>
import TemplateComponent from './components/TemplateComponent.vue'
import NP from './components/NP.vue'
import OG from './components/OG.vue'

export default {
  name: 'App',
  props: ['nameProps'],
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
  components: {
    TemplateComponent,
    NP,
    OG
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
