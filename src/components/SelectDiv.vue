<template>
    <div class="styled-select">
      <select v-model="lable" @change="ChangeSelect">
        <option v-for="data, index in dataOption"
          :key="index"
          v-show="data.lable != lable">
          {{data.lable}}
        </option>
      </select>
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
      }
    },
    watch: { 
        valueS: function(newVal) { // watch it
          this.value = newVal.value
          this.lable = newVal.lable
        }
      },
    methods: {
      ChangeSelect(event){
        this.dataOption.forEach(el => {
          if(el.lable == event.target.value){
            this.value = el.value
          }
        })
        this.PostValue()
        console.log({value: this.value, id: this.id, lable: this.lable})
      },
      PostValue() {
        this.$emit('valueSelect', {value: this.value, id: this.id, lable: this.lable})
      },
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

body { margin: 20px; }
h1 { font-size: 1.5em; }

.styled-select {
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 3px;
  
  overflow: hidden;
  position: relative;
  option{
    background-color: var(--background-Main);
  }
}
select:focus { outline: none; }
.styled-select select {
  height: 34px;
  padding: 5px 5px 5px 5px;
  background: transparent;
  border: none;
  color: var(--color-Main);
  width: calc(100%);
  min-width: fit-content;
  
  
  /*hide default down arrow in webkit */
  -webkit-appearance: none; 
}

@-moz-document url-prefix(){
  .styled-select select { width: 110%; }
}

 select::-ms-expand { display: none; } /* hide default down arrow in IE10*/

/* hack to fall back in opera */
_:-o-prefocus, .selector {
  .styled-select { background: none; }
  }

</style>