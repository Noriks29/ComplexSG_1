<template>
    <div class="SelectDiv">
        <div class="SelectedValue" :class="displayList ?  'active' : ''"  @click="displayList = !displayList">
            <div>
              {{ lable }}
            </div>
        </div>
        <div class="Options" :class="displayList ?  'active' : ''">
        <div 
          v-for="data, index in dataOption"
          :key="index"
          v-show="data.lable != lable"
          @click="ChangeSelect(index)"
          :title="data.lable"
        >
            {{data.lable}}
        </div>
        </div>
    </div>

</template>



<script>

  export default {
    name: 'SelectDiv',
    props: {
      dataOption: {
        type: Array
      },
      id: {
        type: String
      },
      valueS:{
        type: Object,
        deep: true,
        immediate: true,
      }
    },
    data() {
      return {
        lable: "",
        value: null,
        displayList: false

      }
    },
    watch: { 
        valueS: function(newVal) { // watch it
          this.value = newVal.value
          this.lable = newVal.lable
        }
      },
    methods: {
      ChangeSelect(index){
        this.lable = this.dataOption[index].lable
        this.value = this.dataOption[index].value
        this.displayList = false
        this.PostValue()
      },
      PostValue() {
        this.$emit('valueSelect', {value: this.value, id: this.id})
      }
    },
    mounted (){
      try {
        this.value = this.valueS.value
        this.lable = this.valueS.lable
      } catch (error) {
        this.value = undefined
        this.lable = undefined
        console.log(error)
      }
      
    },

}
</script>


<style lang="scss" scoped>

.SelectDiv{
  display: inline-flex;
  flex-direction: column;
  flex-wrap: nowrap;
  position: relative;
  width: 100%;
  text-align: center ;

  .SelectedValue{
    display: flex;
    border: 1px solid white;
    border-radius: 15px;
    width: 100%;
    transition: all 0.5s ease-out;

    div{
      flex: 1;
      color: white;
      margin: 10px;
    }
    button{
      margin: 10px 10px 10px 0px;
    }
    &.active{
      border: 1px solid white;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      border-bottom: 0.5px solid rgba(255, 255, 255, 0);
    }
  }

  .Options{
    z-index: 3;
    position: absolute;
    width: 100%;
    top: 100%;
    border: 1px solid rgba(255, 255, 255, 0);
    transition: all 0.5s ease-out;
    overflow: hidden;
    pointer-events: none;
    
    

    div{
      color: rgba(255, 255, 255, 0);
      margin: 5px;
      border-bottom: 1px solid rgba(255, 255, 255, 0);
      transition: all 0.5s ease-out;
    }

    &.active{
      border: 1px solid rgba(255, 255, 255, 1);
      border-top: 0px;
      pointer-events: auto;
      background-color: #1c1c1c;

      div{
        color: rgba(255, 255, 255, 1);
        border-bottom: 1px solid rgba(255, 255, 255, 1);
      }
    }
  }
}

</style>