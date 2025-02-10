<template>
    <div class="SelectDiv">
        <div class="SelectedValue" :class="displayList ?  'active' : ''"  @click="DisplayList">
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
      },
      DisplayList(){
        if(this.displayList){
          this.displayList = false
        }
        else{
          this.displayList = true
          let flag = true
          document.getElementById("app").addEventListener("click", function CloseWindow(e) {
            console.log(e)
            if(flag){
              this.displayList = false
              document.getElementById("app").removeEventListener("click", CloseWindow)
            }
          })
        }
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
    border: 2px solid var(--border-button2);
    border-radius: 15px;
    width: 100%;
    transition: all 0.5s ease-out;

    div{
      flex: 1;
      color: var(--color-Main);
      margin: 10px;
    }
    button{
      margin: 10px 10px 10px 0px;
    }
    &.active{
      border: 1px solid var(--border-button2);
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      border-bottom: 0.5px solid var(--border-button2);
    }
  }

  .Options{
    z-index: 500;
    position: absolute;
    width: 100%;
    top: 100%;
    border: 1px solid #6f6f6f00;
    transition: all 0.5s ease-out;
    overflow: hidden;
    pointer-events: none;
    border-radius: 0px 0px 10px 10px;
    

    div{
      color: #6f6f6f00;
      margin: 5px;
      border-bottom: 1px solid #6f6f6f00;
      transition: all 0.5s ease-out;
    }

    &.active{
      border: 1px solid var(--border-button2);
      border-top: 0px;
      pointer-events: auto;
      background-color: var(--background-Main);

      div{
        color: var(--color-Main);
        border-bottom: 1px solid var(--border-button2);
      }
    }
  }
}

</style>