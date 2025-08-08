
<template>
  <div id="backgroundDiv"></div>
    <div class="headerSelectMode" :class="login !== undefined && systemStatus.typeWorkplace == -1 ? 'show' : ''">
      <div v-for="data, index in workplaceList" :key="index" class="buttonMenu">
        <Button  @click="ChangetypeWorkplace(data.type)" :label="data.name" severity="secondary">
        </Button>
      </div>
    </div>
    <div class="TitleComplex" :class="login !== undefined && systemStatus.typeWorkplace == -1 ? 'show' : ''">
      <Card>
        <template #title>ЭКСПЕРИМЕНТАЛЬНЫЙ ОБРАЗЕЦ ПРОГРАММНОГО КОМПЛЕКСА</template>
        <template #content><p class="m-0">("Комплекс-СГ-3.1.2.1")</p></template>
      </Card>
    </div>
    <div :class="login == undefined ? 'show' : ''" class="ModalLoginBack p-sidebar">
      <div class="ModalLoginPanel">
        <h1>Вход в систему</h1>
        <form @submit.prevent="StartLogin" class="ModalLoginForm">
          <FloatLabel>
            <InputText name="login" v-model="form.login" type="text" :invalid="form.login == ''"/>
            <label for="login">Логин</label>
          </FloatLabel>
          <FloatLabel >
            <Password name="password" v-model="form.password" toggleMask :feedback="false" :invalid="form.password == ''"/>
            <label for="password">Пароль</label>
          </FloatLabel>
          <span class="FormSubmit">
            <Button type="submit" label="Войти" icon="pi pi-angle-right" iconPos="right"  :disabled="(form.login == '') || (form.password == '')"/>
          </span>
        </form>
      </div>
    </div>
    <div class="WorkPage">
      <Menubar class="idSesion" :class="login !== undefined ? titleModule==''?'show':'max show':''">
        <template #start>
          <div class="ModuleTitle" :class="titleModule==''?'hide':''">{{ titleModule }}</div>
        </template>
        <template #end>
          <div class="endMenu">
            <p>Пользователь: {{ login }} {{ SystemObject }}</p>
            <Button icon="pi pi-bars" outlined :class="systemStatus.typeWorkplace !== -1 ? 'show' : ''" @click="ChangetypeWorkplace(-1)" class="p-button-sm" severity="info"/>
            <Button label="Выйти" outlined @click="Log_out" icon="pi pi-sign-out" iconPos="right" class="p-button-sm" severity="danger"/>
          </div>
        </template>
      </Menubar>
      <TemplateComponent v-if="systemStatus.typeWorkplace != -1" @reload="ReloadTemplate"/>
    </div>
    <div class="ChangeViewMode" @click="ChangeColor"><Button :icon="'pi '+(!colorthemBlack?'pi-sun':'pi-moon') " severity="secondary" style="height: 1.5rem;width: 1.5rem;"/></div>
    <AlertToast /><LoadProcess />
</template> 
<script>
import TemplateComponent from './components/TemplateComponent.vue'
import LoadProcess from './components/LoadProcess.vue'
import './style/GlobalStyle.scss'
import '@/style/GlobalElementStyle.scss'
import AlertToast from './components/AlertToast.vue'


import NET from 'vanta/dist/vanta.net.min'
import * as THREE from 'three'

import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Card from 'primevue/card';

import Menubar from 'primevue/menubar';


export default {
  name: 'App',
  data() {
    return{
      systemStatus: {typeWorkplace: -1},
      titleModule: '',
      login: undefined,
      workplaceList: [],
      SystemObject: null,
      colorthemBlack: true,
      form: {login: undefined, password: undefined}
    }
  },
  components: {
    TemplateComponent,
    LoadProcess,
    AlertToast,
    Button,
    InputText,
    FloatLabel,
    Password,
    Card,
    Menubar
  },
  methods: {
      StartLogin(){
        let data = {
            "nameUser": this.form.login,
            "email": this.form.login,
            "password": this.form.password
        }     
        this.VerifyWorkSapce(data)
      },
      async VerifyWorkSapce(data){
        this.$showLoad(true);
        this.workplaceList = []
        let result = await this.$FetchPost("/api/v1/authentication/user/login",data,null,false)
        if(result == undefined){
          this.$showToast('Неудачная попытка входа','warning', 'Login');
          this.$InitAccess(null)
        }
        else if(result.length > 0){
          this.$showToast('Добро пожаловать '+data.nameUser,'success', 'Login');
          result.sort((a,b) => {return a.type - b.type})
          this.workplaceList = result
          localStorage.setItem('nameUser', data.nameUser);
          localStorage.setItem('email',  data.email);
          localStorage.setItem('password',  data.password);
          this.login = data.nameUser
        }
        this.$showLoad(false);
      },
      Log_out(){
        this.titleModule = ''
        localStorage.removeItem('nameUser')
        this.$InitAccess(null)
        localStorage.removeItem('email')
        localStorage.removeItem('password')
        this.workplaceList = []
        this.login = undefined
        this.systemStatus = {typeWorkplace: -1}
        this.$ClearGlobalData()
      },
      async StartSystem(data){
        this.$ClearGlobalData()
        this.$showLoad(true);
        await this.$InitAccess(data.accessKey)
        this.titleModule = data.name
        await this.$InitGlobalData()
        this.systemStatus = this.$SystemObject()
        this.$showLoad(false);
      },
      ChangetypeWorkplace(mode){
        this.titleModule = ''
          this.workplaceList.forEach(workplace => {
            if(workplace.type == mode){
              this.StartSystem(workplace)
              return
            }
          })
          this.systemStatus = {typeWorkplace: -1}
          this.$ClearGlobalData()
      },
      async ReloadTemplate(){
        let tWP = this.systemStatus.typeWorkplace
        this.systemStatus = {typeWorkplace: -1}
        await this.ChangetypeWorkplace(tWP)
      },
      CreateBg(){
        let bg = '#dddddd'
        if(this.colorthemBlack){
          bg = '#0a0a0a' 
        }
        try {
          NET({
            el: "#backgroundDiv",
            THREE: THREE, // Убедитесь, что THREE правильно импортирован
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 500.00,
            minWidth: 500.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x15eb,       // Цвет точек
            backgroundColor: bg, // Фон (чёрный)
            points: 7.00,
            maxDistance: 27.00,
            spacing: 20.00,
          })
        } catch (error) {
          this.$showToast('Не удалось загрузить фон','warning', 'Фон');
        }
      },
      ChangeColor(){
        this.colorthemBlack = !this.colorthemBlack
        if(!this.colorthemBlack){
          this.$primevue.changeTheme('aura-dark-blue', 'aura-light-blue', 'theme-link', () => {});
        }
        else{
          this.$primevue.changeTheme('aura-light-blue', 'aura-dark-blue', 'theme-link', () => {});
        }
        this.CreateBg()
      },
    },
  async mounted() {
    this.$showLoad(true);
    this.CreateBg()
    this.$primevue.changeTheme('aura-light-blue', 'aura-dark-blue', 'theme-link', () => {});
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
      console.log(error)
    }
    this.$showLoad(false);
  },
  
}
</script>

<style lang="scss" scoped>

#backgroundDiv{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    z-index: 0;
}
.TitleComplex{
    position: absolute;
    width: 58vw;
    display: flex;
    height: 100vh;
    align-items: center;
    margin-left: 5vw;
    overflow: hidden;
    .p-card{
      flex: 1;
      display: none;
      animation: 1s ease-out 0s 1 slideInFromRight;
    }
    &.show{
      .p-card{
        display: block;
      }
    }
}
.WorkPage{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  height: 100%;
}

  .ModalLoginBack{
    position: absolute;
    top: 0px;
    z-index: 3;
    height: 100vh;
    min-width: 500px;
    max-width: 30vw;
    transform: translate(-100%, 0px);
    transition: all 0.5s ease-in-out;
    background: color-mix(in srgb, var(--surface-0) 80%, transparent 20%); 
    border-bottom: none;
    border-top: none;
    border-left: none;
    &.show{
      transform: translate(0%, 0px);
    }
    .ModalLoginPanel{
      padding: 20px;
      .ModalLoginForm{
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 90%;
        margin-top: 40px;
        .p-float-label{
          margin: 15px 0px 10px 0px;
          display: flex;
          flex-direction: column;
          .p-password{
            flex-direction: column;
          }
        }
        .FormSubmit{
          margin-top: 15px;
          display: flex;
          flex-direction: row-reverse;
        }
      }
    }
  }

.ChangeViewMode{
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  z-index: 10;
}


.idSesion{
  position: relative;
  transform: translate(0px, -150%);
  transition: width 1s ease-in-out, transform 1s ease-in-out;
  width: calc(1% - 9px);
  min-width: fit-content;
  overflow: hidden;
  z-index: 2;
  padding: 5px;
  margin: 5px;
  &.show{
    transform: translate(0px, 0%);
  }
  &.max{
    width: calc(100% - 9px);
    
  }
  .endMenu{
    display: flex;
    align-items: center;
    .p-button{
      padding: 5px;
      width: fit-content;
      margin: 0px 5px;
    }
    p{
      margin: 0px 5px;
    }
  }
  .ModuleTitle{
    font-size: 20px;
    transform: translate(0%, 0px);
    transition: transform 0.5s ease-in-out;
    font-weight: bold;
    margin-left: 10px;
    &.hide{
      transform: translate(150%, 0px);
    }
  }
    
}

.headerSelectMode{
    width: 35%;
    margin-left: 65%;
    display: flex;
    justify-content: space-evenly;
    position: fixed;
    z-index: 1;
    flex-direction: column;
    height: 95vh;
    padding: 5vh 0px 0px;
    transform: translate(100%, 0px);
    transition: all 0.5s ease-in-out;
    &.show{
      transform: translate(0%, 0px);
    }
    .buttonMenu{
      flex: 1;
      display: flex;
      margin: 10px;
      .p-button{
        flex: 1;
      }
    }
} 
</style>


