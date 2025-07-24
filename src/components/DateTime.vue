<template>
    <div class="half-width inputType2" :id="id+name" @change="SelectValue">
              <input type="date" id="date" name="date" value="2012-12-12">
              <input type="time" id="time" name="time" value="00:00" class="active" step="2">
    </div>
</template>


<script>

import {DTimeToUnix, UnixToDtime} from "../js/WorkWithDTime.js";

export default {
    name: 'DateTimeDiv',
    props: {
      id: {
        type: String
      },
      name:{
        type: String
      },
      valueUnix:{
        type: Number
      }
    },
    data() {
      return {
        timeUnix: 0,
      }
    },
    methods: {
        SelectValue(){
            const element = document.getElementById(this.id+this.name)
            let time =  element.getElementsByTagName("input")[0].value +"T"+ element.getElementsByTagName("input")[1].value
            this.timeUnix = DTimeToUnix(time)
            this.PostValue()
        },
        SetValue(time){
          let ObjectTime = UnixToDtime(time)
          const element = document.getElementById(this.id+this.name)
          element.getElementsByTagName("input")[0].value = ObjectTime.date || "2000-12-12"
          element.getElementsByTagName("input")[1].value = ObjectTime.time || "00:00:00"
        },
      PostValue() {
        this.$emit('valueSelect', {time: this.timeUnix, id: this.id, name: this.name})
      }
    },
    mounted (){
      this.timeUnix = this.valueUnix;
      this.SetValue(this.timeUnix)
    },
    watch:{
      valueUnix( newValue/*, oldValue*/) {
          this.timeUnix = newValue;
          this.SetValue(this.timeUnix)
      }
    }
}
</script>


<style lang="scss" scoped>
.half-width input{
  padding: 4px;
  text-align: center;
  pointer-events: auto;
  border: none;
  background: none;
  font-size: 14px;
  color: white;
}
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1)
}
input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(1)
}
.half-width{
  display: flex;
  align-items: center;
}
</style>