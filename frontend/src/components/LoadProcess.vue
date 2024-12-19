<template>
    <div class="ModalBack" id="loadProcess">
        <div class="ModalWindow shape">
          <img id="imgplanet" src="@/assets/ka.gif">
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



<style lang="scss">
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
    background-color: rgba(255, 255, 255, 0.044);
    padding: 30px;
    box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.589);

    
  }

  :root {
	--background: #005;
	--primary: #88D5BF;
	--secondary: #5D6BF8;
	--third: #e27fcb;
}
@keyframes morph {
  0% {
			border-radius:  70% 20% 20% 70% / 60% 30% 70% 40%;
	} 
	
	50% {
			border-radius:  20% 70% 70% 20% / 50% 60% 30% 60%;
	}
  
	100% {
		border-radius:  70% 20% 20% 70% / 60% 30% 70% 40%;
	} 
}

.shape {
  animation: morph 4s ease-in-out infinite;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  border: 5px solid black;
  transition: all 1s ease-in-out;
  padding: 50px;
  z-index: 5;

  #imgplanet{
      width: 250px;
    }
}
}



</style>