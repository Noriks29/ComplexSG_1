<template>
    <div class="ModalBack" id="loadProcess">
        <div class="ModalWindow">
            <img src="../res/load.gif" alt="Идёт загрузка">
        </div>
    </div>
</template>



<script>

  export default {
    name: 'LoadProcess',
    data() {
      return {
      }
    },
    methods: {
    }
}
</script>



<style>
.ModalBack{

  top: 0px;
  position: absolute;
  left: 0px;
  width: 100%;
  height: 100vh;
  max-width: 100%;
  max-height: 100vh;
  background-color: rgba(0, 0, 0, 0.459);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 10;

  .ModalWindow{
    background-color: white;
    padding: 30px;
    box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.589);
  }


}



</style>