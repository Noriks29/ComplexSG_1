<template>
          <table class="TableDefault" :class="modellingStatus?'DisableForModelling':''"><tbody>
          <tr><td>Начальное время расчетов</td><td>
            <DateTime :valueUnix="dataSystem.startTime" :id="'startTime'"  @valueSelect="ChangeTime"/>
          </td><td rowspan="4"><button class="ButtonCommand ButtonUpload" :class="!systemChange ? 'disable': ''" @click="SaveSystem"><img src="@/assets/save.svg" alt=""></button></td></tr>
          <tr><td rowspan="2">Горизонт моделирования</td><td>
            <DateTime :valueUnix="dataSystem.modelingBegin" :id="'modelingBegin'"  @valueSelect="ChangeTime"/>
          </td></tr>
          <tr><td>
            <DateTime :valueUnix="dataSystem.modelingEnd" :id="'modelingEnd'" @valueSelect="ChangeTime"/>
          </td></tr>
          <tr><td>Шаг моделлирования</td><td><input placeholder="Введите шаг" class="inputType2" id="step" @change="ChangeParam" type="number" min="0" :value="dataSystem.step"><label for="step"></label></td></tr>
        </tbody></table>
  </template>
  
<script>
import DateTime from '../DateTime.vue';
import { PagesSettings } from './PagesSettings';
import { CreateDateTime } from '@/js/WorkWithDTime';
  export default {
    name: 'SystemWindow',
    mixins: [PagesSettings],
    components:{
      DateTime
    },
    data(){
      return{
        dataSystem:{},
        systemChange: false
      }
    },
    methods: {
      CreateDateTime(time){
        return CreateDateTime(time)
      },
      ChangeTime(obgTime){
        this.systemChange = true
        this.dataSystem[obgTime.id] = obgTime.time
      },
      ChangeParam(){
        this.systemChange = true
      },
      async SaveSystem(){
        await this.$ChangeSystemObject(null, null, this.dataSystem)
        this.systemChange = false
      },
      
      async reload(){
        this.dataSystem = await this.$SystemObject()
      }
    },
    async created(){
      this.dataSystem = await this.$SystemObject()
    },
  }
  </script>

<style lang="scss" scoped>
.TableDefault{
  background: none;
  text-align: left;
  filter: none;
  tr{
    background: none;
  }
  #step{
    width: calc(100% - 10px);
    padding: 5px;
  }
}
.ButtonUpload{
  padding: 30px 10px;
  img{
    width: 20px;
  }
}
</style>
