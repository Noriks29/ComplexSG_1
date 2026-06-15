
<template>
  <div id="backgroundDiv"></div>
    <div class="headerSelectMode" :class="login !== undefined && systemStatus.typeWorkplace == -1 ? 'show' : ''">
      <div v-for="data, index in workplaceList" :key="index" class="buttonMenu" style="position: relative;">
        <Button  @click="ChangetypeWorkplace(data.type)" :label="data.name" severity="secondary">
        </Button>
        <Button icon="pi pi-info" outlined label="Справка" @click="infoType=data.type" severity="help" style="position: absolute;bottom: 10px;left: 10px;"/>
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
      <Menubar class="idSesion show" :class="titleModule==''?'':'max'">
        <template #start>
          <div class="ModuleTitle" :class="titleModule==''?'hide':''">{{ titleModule }}</div>
        </template>
        <template #end>
          <div class="endMenu">
            <Button icon="pi pi-info" outlined label="Справка" @click="infoType=1" severity="help"/>
            <p v-if="login">Пользователь: {{ login }}</p>
            <Button v-if="login" icon="pi pi-bars" outlined :class="systemStatus.typeWorkplace !== -1 ? 'show' : ''" @click="ChangetypeWorkplace(-1)" class="p-button-sm" severity="info"/>
            <Button v-if="login" label="Выйти" outlined @click="Log_out" icon="pi pi-sign-out" iconPos="right" class="p-button-sm" severity="danger"/>
          </div>
        </template>
      </Menubar>
      <TemplateComponent v-if="systemStatus.typeWorkplace != -1"/>
    </div>
    <div class="ChangeViewMode" @click="ChangeColor"><Button :icon="'pi '+(!colorthemBlack?'pi-sun':'pi-moon') " severity="secondary" style="height: 1.5rem;width: 1.5rem;"/></div>
    <LoadProcess />
    <Toast /><ConfirmDialog></ConfirmDialog>
    <div class="PanelInfo" v-if="infoType" @click="CloseInfo($event.target)">
      <Card style="position: relative;">
          
          <template #title><span>Справка</span>
              <Button icon="pi pi-times" text severity="secondary" @click="infoType=null" style="position: absolute;right: 20px;"/>
          </template>
          <template #content >
            <section v-if="infoType==1">
               <h2>Полное наименование программы:</h2>
    <p>Экспериментальный образец программного комплекса автономного группового управления многоспутниковыми группировками малоразмерных космических аппаратов наблюдения земной поверхности и околоземного космического пространства на основе комплексирования классических подходов, нейросетевых технологий и искусственного интеллекта</p>
    <h2>Сокращённое наименование:</h2>
    <p>ЭО ПК АГУ МГ МКА</p>
    <h2>Шифр СЧ НИР:</h2>
    <p>«Комплекс-СГ-3.1.2.1»</p>
    <h2>Версия программы:</h2>
    <p>1.0 (экспериментальная, 2025 г.)</p>
    <h2>Назначение программы</h2>
    <p>Программа предназначена для отработки, экспериментальной проверки и подтверждения правильности основных модельно‑алгоритмических решений, разработанных для информационной технологии автономного группового управления (АГУ) многоспутниковыми группировками (МГ) малоразмерных космических аппаратов (МКА) наблюдения земной поверхности и околоземного космического пространства.</p>
    <p>В рамках программы рассматривается орбитальное построение МГ в виде кластеров, где в каждом кластере один МКА выполняет роль ведущего (лидера), а остальные — ведомых. Управление осуществляется с минимальным участием наземного комплекса управления (НКУ) на основе информационного взаимодействия МКА.</p>
    <h2>Решаемые задачи</h2>
    <ul>
        <li>Формирование имитационной модели многоспутниковой группировки МКА заданного состава и баллистической структуры на основе базы данных МКА.</li>
        <li>Описание состава, текущего орбитального построения и задач МГ наблюдения Земли и околоземного космического пространства (НЗКП).</li>
        <li>Расчёт и анализ показателей оперативности распределения и перераспределения задач автономного группового управления, оценка качества формируемых планов применения.</li>
        <li>Автономное планирование, коррекция и перепланирование применения МКА НЗКП, координация планов в рамках МГ.</li>
        <li>Реализация алгоритма автономного группового управления на основе комплексирования классических, нейросетевых и интеллектуальных алгоритмов.</li>
        <li>Проведение экспериментальных исследований с изменением целей, состава и качества решения задач.</li>
        <li>Сохранение хода и результатов отработки алгоритма в базе данных с возможностью доступа к ретроспективной информации.</li>
        <li>Визуальное отображение хода и результатов экспериментов (имитационное моделирование).</li>
        <li>Анализ показателей производительности функционирования космической системы.</li>
    </ul>
    <h2>Состав программного комплекса</h2>
    <ul>
        <li><strong>База данных (БД)</strong> — хранение входных и выходных данных, результатов моделирования.</li>
        <li><strong>Интерфейс АРМ и доступ к БД</strong> — совокупность пользовательских форм для ввода/редактирования исходных данных и отображения результатов.</li>
        <li><strong>Движок имитационного моделирования</strong> — реализация дискретно‑событийного моделирования функционирования МГ.</li>
        <li><strong>Библиотека специального модельно‑алгоритмического обеспечения (СМАО)</strong> — описывает поведение и функциональные возможности программных агентов МКА, реализующих основные положения информационной технологии АГУ.</li>
        <li><strong>Информационная шина</strong> — обеспечивает обмен данными между компонентами.</li>
    </ul>
    <h2>Условия выполнения (системные требования)</h2>
    <h3>Операционная система:</h3>
    <p>Astra Linux (64‑разрядная)</p>
    <h3>Программное обеспечение:</h3>
    <ul>
        <li>Веб‑браузер: Google Chrome</li>
        <li>Java Development Kit (JDK) версии 17.0.9</li>
        <li>Node.js (версия 20.19.4) и npm (10.8.2)</li>
        <li>Nginx (версия 1.18.0) для обслуживания статических файлов</li>
        <li>Компилятор GCC (9.4.0)</li>
        <li>Python интерпретатор (3.10.15) и менеджер пакетов pip (24.3.1)</li>
        <li>СУБД PostgreSQL (версия 12.20)</li>
    </ul>
    <h3>Минимальные аппаратные требования:</h3>
    <ul>
        <li>Процессор: Intel Core i5, 6‑ядерный, 2,9 ГГц (Turbo — до 4,3 ГГц)</li>
        <li>Оперативная память: не менее 8 ГБ (DDR4)</li>
        <li>Твердотельный накопитель (SSD): не менее 128 ГБ</li>
        <li>Монитор: диагональ не менее 27″, разрешение не хуже 1920×1080</li>
        <li>Клавиатура и мышь: проводные, USB</li>
    </ul>
    <h2>Разработчик</h2>
    <p>Федеральное государственное бюджетное учреждение науки<br>
    «Санкт‑Петербургский Федеральный исследовательский центр Российской академии наук» (СПб ФИЦ РАН)</p>
    <h2>Год разработки</h2>
    <p>2024–2025</p>
    <p>Данная справка является встроенной помощью пользователя ЭО ПК АГУ МГ МКА и соответствует требованиям Технического задания (п. 5.6).</p>
            </section>
            <section v-if="infoType==3">
              <h2>Автономное групповое управление кластерами МКА:</h2>
              <ul>
                  <li>кластеры: близкое расположение МКА</li>
                  <li>автономное управление: распределение заявок в кластерах и между кластерами на основе информационного взаимодействия</li>
                  <li>планирование и моделирование в двух режимах: с использованием и без использования межспутниковой связи</li>
                  <li>автономный расчет плана съемок и плана полета на каждом МКА с учетом параметров маневренности МКА</li>
                  <li>возможность планирования полета с учетом прогноза электробаланса</li>
              </ul>
            </section>
            <section v-if="infoType==4">
              <h2>О программе в «Доставка данных на Землю»</h2>
              <p>Упрощённая «удобная» версия программного комплекса для валидации процессов доставки данных на Землю:</p>
              <ul>
                  <li>описание заявок предполагает указание объёмов данных и времени их появления на МКА в результате выполнения съёмок</li>
                  <li>доставка данных в двух режимах: с использованием и без использования межспутниковой связи</li>
              </ul>
            </section>
          </template>
      </Card>
    </div>
    
</template> 
<script>
import TemplateComponent from './components/TemplateComponent.vue'
import LoadProcess from './components/LoadProcess.vue'
import './style/GlobalStyle.scss'
import '@/style/GlobalElementStyle.scss'


import NET from 'vanta/dist/vanta.net.min'
import * as THREE from 'three'

export default {
  name: 'App',
  data() {
    return{
      systemStatus: {typeWorkplace: -1},
      titleModule: '',
      login: undefined,
      workplaceList: [],
      colorthemBlack: true,
      form: {login: undefined, password: undefined},
      infoType: null
    }
  },
  components: {
    TemplateComponent,
    LoadProcess,
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
      CloseInfo(target){
        console.log(target)
        if(target.className == "PanelInfo"){
          this.infoType = null
        }
      },
      async VerifyWorkSapce(data){
        this.$showLoad(true);
        this.workplaceList = []
        let result = await this.$FetchPost("/api/v1/authentication/user/login",data,null,false)
        if(result == undefined){
          this.$toast.add({ severity: 'danger', summary: 'Ошибка', detail: 'Неудачная попытка входа', life: 5000 });
          this.$InitAccess(null)
        }
        else if(result.length > 0){
          this.$toast.add({ severity: 'success', summary: 'Добро пожаловать', detail: 'Пользователь: ' + data.nameUser, life: 3000 });
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
        this.$confirm.require({
          message: 'Вы уверены что хотите выйти?',
          header: 'Выход из системы',
          icon: 'pi pi-info-circle',
          rejectLabel: 'Отмена',
          acceptLabel: 'Выйти',
          rejectClass: 'p-button-secondary p-button-outlined',
          acceptClass: 'p-button-danger',
          accept: () => {
              this.titleModule = ''
              localStorage.removeItem('nameUser')
              this.$InitAccess(null)
              localStorage.removeItem('email')
              localStorage.removeItem('password')
              this.workplaceList = []
              this.login = undefined
              this.$ClearGlobalData()
            },
        });
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
        this.workplaceList.forEach(workplace => {
          if(workplace.type == mode){
            this.StartSystem(workplace)
            return
          }
        })
        this.titleModule = ''
        this.$ClearGlobalData()
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
            points: 6.00,
            maxDistance: 27.00,
            spacing: 20.00,
          })
        } catch (error) {
          this.$toast.add({ severity: 'warning', summary: 'Фон', detail: 'Не удалось загрузить фон', life: 2500 });
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
    this.workplaceList = []
    if(localStorage.nameUser != undefined && localStorage.email != undefined && localStorage.password != undefined){
      let data = {
            "nameUser": localStorage.nameUser,
            "email": localStorage.email,
            "password": localStorage.password,
      }
      this.VerifyWorkSapce(data)
    }
    this.$showLoad(false);
  },
  
}
</script>


<style lang="scss">

.PanelInfo{
    position: absolute;
    z-index: 10;
    top: 0px;
    width: 100vw;
    height: 100vh;
    background-color: #00000038;
    display: flex;
    padding: 40px;
}
.PanelInfo .p-card-body{
  height: 100%;
}
.PanelInfo .p-card-content{
  overflow: auto;
}

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


