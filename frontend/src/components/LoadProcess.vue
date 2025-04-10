<template>
    <div class="ModalBack" id="loadProcess">
        <div class="ModalWindow shape">
          <img id="imgplanet" src="@/assets/ka.gif">
        </div>
        <div class="closeButton">
          <button @click="HideLoadWindow">Скрыть окно</button>
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
      HideLoadWindow(){
        const element = document.getElementById("loadProcess");
        element.style.display = "none"
      }
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
    background-color: #0505054f;
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 10;
    box-shadow: inset 0px 0px 1000px 9px black;

  .ModalWindow{
    background-color: rgba(255, 255, 255, 0.044);
    box-shadow: 0px 0px 1000px 100px rgb(0, 0, 0);
  }
  .closeButton{
    position: absolute;
    bottom: 40px;
    z-index: 12;
    button{
      background: none;
      border: 2px solid var(--color-Main);
      padding: 10px 60px;
      border-radius: 14px;
      color: var(--color-Main);
      backdrop-filter: blur(5px);
      box-shadow: 0px 0px 5px 0px var(--color-Main);
      transition: all 0.5s;
      
      &:hover{
        box-shadow: 0px 2px 5px 0px var(--color-Main);
      }
      &:active{
        box-shadow: 0px 0px 0px 0px var(--color-Main);
        backdrop-filter: blur(0px);
      }
    }
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