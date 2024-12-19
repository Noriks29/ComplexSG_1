
<template>
    <div class="headerSelectMode" :class="login !== undefined && systemStatus.WorkMode == -1 ? 'show' : ''">
      <div class="SelectMode"><button class="ButtonSelectMode" :class="systemStatus.WorkMode == 0 ? 'active' : ''" @click="ChangeWorkMode(0)">Планирование и моделирование, связь КА-НП</button></div>
      <div class="SelectMode"><button class="ButtonSelectMode" :class="systemStatus.WorkMode == 1 ? 'active' : ''" @click="ChangeWorkMode(1)">Планирование и моделирование, связь КА-НП и межспутниковая</button></div>
      <div class="SelectMode"><button class="ButtonSelectMode" :class="systemStatus.WorkMode == 2 ? 'active' : ''" @click="ChangeWorkMode(2)">Моделирование доставки данных, связь КА-НП и межспутниковая</button></div>
      <div class="SelectMode"><button class="ButtonSelectMode" :class="systemStatus.WorkMode == 3 ? 'active' : ''" @click="ChangeWorkMode(3)">Планирование и управление</button></div>
    </div>
    
    <div class="idSesion" :class="login !== undefined ? 'show' : ''">
        <div class="flexdiv">login: {{ login }}
          <button class="Menubutton"  :class="systemStatus.WorkMode !== -1 ? 'show' : ''" @click="ChangeWorkMode(-1)"><img src="./assets/menu.svg" alt=""></button>
          <button v-if="this.experimentStatus == false" class="logoutbutton"  @click="Log_out"><img src="./assets/logout.png" alt="">Выйти</button>
        </div>
      </div>
    
    <div :class="login == undefined ? 'show' : ''" class="ModalLoginBack">
      <div class="ModalLoginPanel">
        <h1>Вход в систему</h1>
        <div class="ModalLoginForm">
          <div>
            <label for="login">Логин: </label>
            <input type="text" id="login">
          </div>
          <div>
            <label for="password">Пароль: </label>
            <input type="password" id="password">
          </div>
          <div class="FormSubmit">
            <div :class="errorLogin ? '' : 'none'">Неверные данные!</div>
            <button @click="StartLogin" class="ButtonCommand login">Войти <img src="./assets/arrow2.png" alt=""></button>
          </div>
        </div>
      </div>
    </div>
    <TemplateComponent v-if="!systemreload" :ActiveComponent="ComponentStatus" :systemStatus="systemStatus" @ChangeSystemStatus="ChangeSystemStatus" @ChangeExperimentStatus="ChangeExperimentStatus"/>
    
    <LoadProcess />
   
    

</template> 
<script>
import TemplateComponent from './components/TemplateComponent.vue'

import {DisplayLoad, FetchGet, FetchPost} from './js/LoadDisplayMetod.js'
import LoadProcess from './components/LoadProcess.vue'
import GlobalStyle from './style/GlobalStyle.scss'



export default {
  name: 'App',
  css:{
    GlobalStyle
  },
  data() {
    return{
      systemStatus: {WorkMode: -1},
      ComponentStatus: 0,
      login: undefined,
      errorLogin: false,
      experimentStatus: false,
      systemreload: true,
    };
  },
  methods: {
      ChangeComponents(nameObject) {
        this.activeComponent = nameObject.nameComponent
      },
      ChangeExperimentStatus(status){
        this.experimentStatus = status
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
        DisplayLoad(true)
        let result = await FetchPost("/api/v1/authentication/user/login",data)
        if(result == undefined){
          this.errorLogin = true
        }
        else if(result.length > 0){
          this.errorLogin = false
          localStorage.setItem('nameUser', data.nameUser);
          localStorage.setItem('email',  data.email);
          localStorage.setItem('password',  data.password);
          localStorage.setItem('data', result[0].accessKey)
          this.login = data.nameUser
          this.StartSystem() 
        }
        DisplayLoad(false)
      },
      Log_out(){
        localStorage.removeItem('nameUser')
        localStorage.removeItem('data')
        localStorage.removeItem('email')
        localStorage.removeItem('password')
        this.workplaceList = []
        this.login = undefined
        this.systemStatus.WorkMode = -1
      },
      async ChangeSystemStatus(data){
        this.systemStatus = data
        let workmode = data.WorkMode
        await FetchPost('/api/v1/system/update', this.systemStatus, true)
        this.systemStatus.WorkMode = workmode
        this.ActiveComponentValidate()
      },
      async StartSystem(){
        DisplayLoad(true)
        let rezult = await FetchGet('/api/v1/system/get', true)
        this.systemStatus = rezult;
        this.systemStatus.WorkMode = -1
        this.ActiveComponentValidate()
        DisplayLoad(false)
      },
      ActiveComponentValidate(){
        if(this.systemStatus.earthStatus && this.systemStatus.constellationStatus){
          this.ComponentStatus = 1
        }
        else this.ComponentStatus = 0
      },
      ChangeWorkMode(mode){
        this.systemreload = false
        if(this.experimentStatus == false){
          this.systemStatus.WorkMode = mode
          if(mode in {1: null, 2:null}){
            this.systemStatus.interSatelliteCommunication = true
          }
          else if(mode in {0: null}){
            this.systemStatus.interSatelliteCommunication = false
          }
          let data = this.systemStatus
          this.ChangeSystemStatus(data)
        }
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
    LoadProcess
  }
}
</script>

<style lang="scss">
body{
  .ModalLoginBack{
    position: relative;
    z-index: 3;
    height: 100vh;
    min-width: 500px;
    max-width: 30vw;
    background: linear-gradient(180deg, #88888812, #8c8c8c12, #86868612, #57575705);
    border-right: 2px solid #ffffff7d;
    box-shadow: -8px 0px 15px 1px white;
    transform: translate(-100%, 0px);
    transition: all 0.5s ease-in-out;

    &.show{
      transform: translate(0%, 0px);
    }

    .ModalLoginPanel{
      padding: 20px;
      font-size: var(--font-size);

      .ModalLoginForm{

        h1{
          margin: 0px;
        }

        div{
          padding: 10px 5px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          label{
            margin: 5px;
          }

          input{
            padding: 15px;
            text-align: left;
            border: none;
            border-bottom: 2px solid white;
            width: 90%;
            outline: none;
            background-color: #8a8a8a12;
            transition: all 0.5s;
            
            &:hover{
              background-color: #0b0b0bd7;
            }
            &:focus{
              background-color: #0101015a;
            }
          }

          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus,
          textarea:-webkit-autofill,
          textarea:-webkit-autofill:hover,
          textarea:-webkit-autofill:focus,
          select:-webkit-autofill,
          select:-webkit-autofill:hover,
          select:-webkit-autofill:focus {
            -webkit-text-fill-color: rgb(0, 0, 0);
            -webkit-box-shadow: 0 0 0px 1000px #00000000 inset;
            transition: background-color 0.5s ease-in-out 0s;
          }

          &.FormSubmit{
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 15px;

            div{
              font-size: 20px;
              font-weight: bold;
              color: #ff8e8e;
              transition: all 1s;

              &.none{
                color: #ff8e8e00;
              }
            }
          }
        }
      }
    }
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

.headerSelectMode{
  display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: #ffffff1f;
    position: fixed;
    width: 35%;
    z-index: 1;
    flex-direction: column;
    height: 90vh;
    margin-left: 65%;
    padding: 5vh 0px;


  background: linear-gradient(180deg, #88888812, #8c8c8c12, #86868612, #57575705);
  border-left: 2px solid #ffffff7d;
  box-shadow: 8px 0px 15px 1px white;
  transform: translate(100%, 0px);
  transition: all 0.5s ease-in-out;

  &.show{
    transform: translate(0%, 0px);
  }

  .SelectMode{
    flex: 1;
    width: 100%;
    .ButtonSelectMode{
      overflow: hidden;
      position: relative;
      font-size: 20px;
      width: 100%;
      height: 100%;
      border: none;
      background: none;
      color: white;
      border-right: 1px solid black;
      pointer-events: all;
      background-color: rgba(61, 61, 61, 0.3);
        &:hover{
          background-color: rgba(90, 90, 90, 0.4);
          border: 2px solid rgba(0, 0, 0, 0.5);
          transform: translate(4px, -4px);
          box-shadow: -4px 4px 2px rgba(0, 0, 0, 0.6);
        }
        &:active{
            background-color: rgba(29, 29, 29, 0.4);
            border: 2px solid rgba(78, 78, 78, 0.5);
            transform: translate(-1px, 1px);
       }
        &:before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(114, 115, 194, 0.1),
            transparent
          );
          transition: all 350ms;
        }
        &:hover:before {
          left: 100%;
        }
      &.active{
        background-color: rgba(19, 19, 19, 0.536);
        border: 2px solid rgba(78, 78, 78, 0.5);
        transform: translate(-1px, 1px);
      }
  }
  }
  
}

.idSesion{
  color: white;
    position: fixed;
    right: 10px;
    top: 6px;
    border-bottom: 2px solid;
    box-shadow: 0px 3px 4px -4px white;
    transform: translate(0px, -150%);
    transition: all 0.5s ease-in-out;
    z-index: 2;

    &.show{
      transform: translate(0px, 0%);
    }

    .flexdiv{
      display: flex;
      align-items: center;
    }

    .logoutbutton{
      position: relative;
      background: none;
      color: white;
      border: none;
      margin: 5px 25px 10px 0px;
      height: 100%;
    }

    .Menubutton{
      background: none;
      border: none;
      position: relative;
      margin: 0px 10px;
      img{
        width: 30px;
      }
      transform: translate(0%, -150%);
      transition: all 0.5s ease-in-out;

      &.show{
        transform: translate(0%, 0px);
      }
    }
    }

</style>

