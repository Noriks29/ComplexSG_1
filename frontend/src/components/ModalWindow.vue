<template>
    <div class="ModalBack">
        <div class="ModalWindow">
            <dIv>{{ mainText }}</dIv>
            <dIv>{{ infoText }}</dIv>
            <dIv> 
                <button @click="PostValue(1)">{{ trueText }}</button>
                <button @click="PostValue(0)">{{ falseText }}</button>
            </dIv>
        </div>
    </div>

</template>



<script>

  export default {
    name: 'ModalWind',
    props: {
      mainText: {
        type: String,
        default: "Вы уверены?"
      },
      infoText: {
        type: String,
        default: "Подтвердите действие"
      },
      trueText: {
        type: String,
        default: "Да"
      },
      falseText: {
        type: String,
        default: "Нет"
      }

    },
    data() {
      return {
        status: false,
      }
    },
    methods: {
      PostValue(status) {
        this.$emit('returnValue', {
            status: status
        })
      }
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;

  .ModalWindow{
    border: 1px solid #013A63;
    border-radius: 10px;
    background-color: #A9D6E5;
    padding: 30px;
    box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.589);
  }


}



</style>