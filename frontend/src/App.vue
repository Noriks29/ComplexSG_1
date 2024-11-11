
<template>
    <canvas class="orb-canvas" id="orb-canvas"></canvas>
    <div class="idSesion" v-if="login != undefined">
      <div>login: {{ login }}
      <button class="logoutbutton"><img src="./assets/logout.png" alt=""  @click="Log_out">Выйти</button></div>
      <!--<SelectDiv :dataOption="workplaceList"  :valueS="workplaceList[idworkplace]" @valueSelect="ChangeWorkSpace"/>-->
    </div>
    <div v-if="login == undefined" class="ModalLoginBack">
      <div class="ModalLoginPanel">
        <h1>Вход в систему</h1>
        <div class="ModalLoginForm">
          <div>
            <label for="login">Login: </label>
            <input type="text" id="login">
          </div>
          <div>
            <label for="password">Password: </label>
            <input type="password" id="password">
          </div>
          <div>
            <button @click="StartLogin" class="ButtonCommand login">Войти <img src="./assets/arrow2.png" alt=""></button>
          </div>
        </div>
      </div>
    </div>
    <transition name="translate" mode="out-in" v-else>
      <component :is="activeComponent" :ActiveComponent="ActiveComponents" @updateParentComponent="ChangeComponents" :systemStatus="systemStatus" @ChangeSystemStatus="ChangeSystemStatus"></component> 
    </transition> 
    <LoadProcess />
   
    

</template> 
<script>
import TemplateComponent from './components/TemplateComponent.vue'
import NP from './components/NP/NP.vue'
import OG from './components/OG/OG.vue'
import TypeKA from './components/TypeKA/TypeKA.vue';
import KA1 from './components/KA/KA1.vue';
import KA2 from './components/KA2/KA2.vue';
import SystemWindow from './components/System/SystemWindow.vue';
import TargetDZZ from './components/TargetDZZ/TargetDZZ.vue'
import EarthConstellation from './components/EarthConstellation/EarthConstellation.vue'
import LoadProcess from './components/LoadProcess.vue'
import EstimationConstellation from './components/EarthConstellation/EstimationConstellation.vue'
import TargetRoad from './components/TargetRoad/TargetRoad.vue';
import ConstellationConstellation from './components/EarthConstellation/ConstellationConstellation.vue';
import {CanvasBackground}  from './js/sky.js';
import {DisplayLoad, FetchGet, FetchPost} from './js/LoadDisplayMetod.js'
import SelectDiv from './components/SelectDiv.vue';

import GlobalStyle from './style/GlobalStyle.scss'




export default {
  name: 'App',
  css:{
    GlobalStyle
  },
  data() {
    return{
      activeComponent: "TemplateComponent",
      systemStatus: {},
      ActiveComponents: {
          NP: true,
          OG: true,
          TypeKA: true,
          SystemWindow: true,
          TargetRoad: false,
          TargetDZZ: false,
          EarthConstellation: false,
          EstimationConstellation: false,
          KA1: false,
          KA2: false
        },
        login: undefined,
        workplaceList: [],
        idworkplace: 0
    };
  },
  methods: {
      ChangeComponents(nameObject) {
        console.log(nameObject.name,nameObject);
        this.activeComponent = nameObject.nameComponent
      },
      ChangeWorkSpace(data){
        if(data.value.accessKey == undefined){
          console.log("Тут будет добавление области")
          alert("Режим в разрабоке")
        }
        else{
          console.log(data.value.accessKey)
          localStorage.setItem('data', data.value.accessKey)
          console.log(localStorage)
        }

      },
      StartLogin(){
        const login = document.getElementById('login').value
        const password = document.getElementById('password').value
        let data = {
            "nameUser": login,
            "email": login,
            "password": password
        }     
        this.VerifyWorkSapce(data)
      },
      async VerifyWorkSapce(data){
        let result = await FetchPost("/api/v1/authentication/user/login",data)
        if(result.length > 0){
          localStorage.setItem('nameUser', data.nameUser);
          localStorage.setItem('email',  data.email);
          localStorage.setItem('password',  data.password);
          localStorage.setItem('data', result[0].accessKey)
          this.workplaceList = []
          for (let index = 0; index < result.length; index++) {
            this.workplaceList.push({lable: result[index].workspaceName, value: result[index]})
          }
          this.workplaceList.push({lable: "Добавить проект", value: {}})
          this.idworkplace = 0
          this.login = data.nameUser
          this.StartSystem() 
        }
      },
      Log_out(){
        localStorage.removeItem('nameUser')
        localStorage.removeItem('data')
        localStorage.removeItem('email')
        localStorage.removeItem('password')
        this.workplaceList = []
        this.login = undefined
      },
      ActiveComponentValidate(){
        if(this.systemStatus.constellationStatus == true && this.systemStatus.earthStatus == true)
        {
          this.ActiveComponents = {
            NP: true,
            OG: true,
            TypeKA: true,
            SystemWindow: true,
            TargetDZZ: true,
            EarthConstellation: true,
            EstimationConstellation: true,
            TargetRoad: true,
            KA1: true,
            KA2: true,
            ConstellationConstellation: true
          }
        }
        else{
          this.ActiveComponents = {
            NP: true,
            OG: true,
            TypeKA: true,
            SystemWindow: true,
            TargetRoad: false,
            TargetDZZ: false,
            EarthConstellation: false,
            EstimationConstellation: false,
            KA1: false,
            KA2: false,
            ConstellationConstellation: false
          }
        }
      },
      async ChangeSystemStatus(data){
        this.systemStatus = data
        let response = await FetchPost('/api/v1/system/update', this.systemStatus)
        console.log(response)
        this.ActiveComponentValidate()
      },
      async StartSystem(){
        DisplayLoad(true)
        const canvasBG = new CanvasBackground('orb-canvas'); //запускаем звёзды
        canvasBG.start();
        let rezult = await FetchGet('/api/v1/system/get')
        console.log(rezult)
        this.systemStatus = rezult;
        this.ActiveComponentValidate()
        console.log(this.systemStatus)
        
        DisplayLoad(false)
      }
    },
  async mounted() {
    
    if(localStorage.nameUser != undefined && localStorage.email != undefined && localStorage.password != undefined){
      let data = {
            "nameUser": localStorage.nameUser,
            "email": localStorage.email,
            "password": localStorage.password
      }
      this.VerifyWorkSapce(data)

    }
  },
  components: {
    TemplateComponent,
    NP,
    OG,
    TypeKA,
    KA1,
    KA2,
    SystemWindow,
    TargetDZZ,
    EarthConstellation,
    LoadProcess,
    EstimationConstellation,
    TargetRoad,
    SelectDiv,
    ConstellationConstellation
  }
}
</script>

<style lang="scss">
body{
  .orb-canvas{
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    z-index: -1;
  }

  .ModalLoginBack{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .ModalLoginPanel{
      border-radius: 10px;
      padding: 30px;
      font-size: var(--font-size);
      background-color: var(--color-background-color);
      box-shadow: -4px 3px 1px var(--color-box-shadow);
      border: 1px solid rgba(0, 0, 0, 0.5);

      .ModalLoginForm{
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        div{
          padding: 10px 0px;
          input{
            border-bottom: 1px solid white;
          }
          &:last-child{
            width: 100%;
          }
        }
      }
    }
  }
}
.idSesion{
  position: fixed;
    right: 10px;
    color: white;
    z-index: 2;
    
  &:first-child{
    border-bottom: 1px solid;
  }
}
.login{
  position: relative;
  padding-right: 35px;
  img{
    height: 60%;
    position: absolute;
    top: 20%;
    right: 0px;
    bottom: 20%;
  }
}
</style>

