<!--Лог движка-->
<template>
    <p style="white-space: pre-wrap;">{{ this.dataTable[0] }}</p>
</template>
  
  <script>
    export default {
      name: 'LogSmao',
      props: {
        dataTable:{
          type: Array
        },
      },
      data() {
        return {
            text: ''
        }
      },
    }
  </script>
