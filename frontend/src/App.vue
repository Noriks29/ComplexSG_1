
<template>
    <div class="headerSelectMode" :class="login !== undefined && systemStatus.typeWorkplace == -1 ? 'show' : ''">
      <div v-for="data, index in workplaceList" :key="index"
        class="SelectMode"
      ><button class="ButtonSelectMode" :class="systemStatus.typeWorkplace == data.type ? 'active' : ''" @click="ChangetypeWorkplace(data.type)">{{ data.name }}</button></div>
    </div>
    
    <div class="idSesion" :class="login !== undefined ? 'show' : ''">
        <div class="flexdiv" >login: {{ login }} {{ SystemObject }}
          <button class="Menubutton"  :class="systemStatus.typeWorkplace !== -1 ? 'show' : ''" @click="ChangetypeWorkplace(-1)"><svg enable-background="new 0 0 32 32" id="Editable-line" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="5" cy="6" fill="none" id="XMLID_303_" r="1" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><circle cx="5" cy="16" fill="none" id="XMLID_305_" r="1" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><circle cx="5" cy="26" fill="none" id="XMLID_304_" r="1" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><line fill="none" id="XMLID_29_" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="10" x2="28" y1="6" y2="6"/><line fill="none" id="XMLID_30_" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="10" x2="28" y1="16" y2="16"/><line fill="none" id="XMLID_31_" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="10" x2="28" y1="26" y2="26"/></svg></button>
          <button v-if="this.experimentStatus == false" class="logoutbutton"  @click="Log_out">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="logout"><line class="cls-1" x1="15.92" x2="28.92" y1="16" y2="16"/><path d="M23.93,25v3h-16V4h16V7h2V3a1,1,0,0,0-1-1h-18a1,1,0,0,0-1,1V29a1,1,0,0,0,1,1h18a1,1,0,0,0,1-1V25Z"/><line class="cls-1" x1="28.92" x2="24.92" y1="16" y2="20"/><line class="cls-1" x1="28.92" x2="24.92" y1="16" y2="12"/><line class="cls-1" x1="24.92" x2="24.92" y1="8.09" y2="6.09"/><line class="cls-1" x1="24.92" x2="24.92" y1="26" y2="24"/></g></svg>
            Выйти</button>
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
    
    <TemplateComponent v-if="systemStatus.typeWorkplace != -1" @changeExperimentStatus="ChangeExperimentStatus"/>
    
    <LoadProcess />
    <div class="ChangeViewMode" @click="ChangeColor"><svg fill="none" height="24" stroke-width="1.5" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12L23 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2V1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 23V22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 20L19 19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 4L19 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 20L5 19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 4L5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 12L2 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
   
    

</template> 
<script>
import TemplateComponent from './components/TemplateComponent.vue'
import {DisplayLoad, FetchPost} from './js/LoadDisplayMetod.js'
import LoadProcess from './components/LoadProcess.vue'
import GlobalStyle from './style/GlobalStyle.scss'
import { ClearGlobalData, InitGlobalData, SystemObject } from './js/GlobalData'

export default {
  name: 'App',
  css:{
    GlobalStyle
  },
  data() {
    return{
      systemStatus: {typeWorkplace: -1},
      login: undefined,
      errorLogin: false,
      experimentStatus: false,
      workplaceList: [],
      SystemObject: null
    };
  },
  methods: {
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
        this.workplaceList = []
        let result = await FetchPost("/api/v1/authentication/user/login",data)
        if(result == undefined){
          this.errorLogin = true
        }
        else if(result.length > 0){
          result.sort((a,b) => {return a.type - b.type})
          this.workplaceList = result
          this.errorLogin = false
          localStorage.setItem('nameUser', data.nameUser);
          localStorage.setItem('email',  data.email);
          localStorage.setItem('password',  data.password);
          this.login = data.nameUser
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
        this.systemStatus = {typeWorkplace: -1}
        ClearGlobalData()
      },
      async StartSystem(data){
        ClearGlobalData()
        DisplayLoad(true)
        await localStorage.setItem('data', data.accessKey)
        await localStorage.setItem('modname', data.name)
        await InitGlobalData()
        this.systemStatus = SystemObject
        DisplayLoad(false)
      },
      ChangetypeWorkplace(mode){
        if(this.experimentStatus == false){
          this.workplaceList.forEach(workplace => {
            if(workplace.type == mode){
              this.StartSystem(workplace)
              return
            }
          })
          this.systemStatus = {typeWorkplace: -1}
          ClearGlobalData()
        }
      },
      ChangeColor(){
        localStorage.viewMode = Number(!Number(localStorage.viewMode || 0) || 0)
        if (localStorage.viewMode == true) {
          document.getElementById("app").className = "whiteMode";
        }
        else{
          document.getElementById("app").classList.remove("whiteMode");
        }
      }
    },
  async mounted() {
    this.workplaceList = []
    if(localStorage.nameUser != undefined && localStorage.email != undefined && localStorage.password != undefined){
      let data = {
            "nameUser": localStorage.nameUser,
            "email": localStorage.email,
            "password": localStorage.password,
      }
      this.VerifyWorkSapce(data)
    }
    localStorage.viewMode = localStorage.viewMode || 0
    try {
      if (localStorage.viewMode == true) {
        document.getElementById("app").className = "whiteMode";
      }
    } catch (error) {
      console.error(error)
    }
  },
  components: {
    TemplateComponent,
    LoadProcess
  }
}
</script>

<style lang="scss">

</style>

