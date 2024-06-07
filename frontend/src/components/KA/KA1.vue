<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
          </div>
          
          <div class="titleText" @click="StartLog">
             <button  @click="StartLog">Продолжить моделирование</button>
          </div>
          <div class="infoTable PanelDefault">
            <div>КА</div>
            <div class="infoSection">
              <div>
                Тип эксперимента
                <div class="infoObject">- A. Планирование съемок без прогнозирования баланса заряда АКБ</div>
                <div class="infoObject">- B. Планирование съемок и моделирование полета без обратной связи</div>
                <div class="infoObject">- C. Планирование съемок и моделирование полета с обратной связью</div>
              </div>
              <div>
                Доставка данных 
                <div class="infoObject">- Earth. Сеансы связи КА - НП</div>
                <div class="infoObject">- Net. Коммуникационная сеть </div>
              </div>
              <div>
                Режим моделирования 
                <div class="infoObject">- 0: Непрерывный</div>
                <div class="infoObject">- 1. Пошаговый</div>
              </div>
            </div>
            <div class="buttonStart" @click="StartModeling">Начать моделирование</div>
          </div>
          <div class="log_list">
            <div v-for="data, index in InputLog"
            :key="index"
            class="Logitem">
            <div>{{ data }}</div>
              <!--<div>{{ data.time }}</div>
              
              <div>{{ data.type }}</div>
              <div>{{ data.idReceiver }}</div>
              <div v-if="data.order">
                <div v-for="dataunder, indexunder in data.order"
                  :key="indexunder"
                >
                  {{ dataunder }}
                </div>
              </div>
              <div v-else-if="data.flightState">{{ data.flightState }}</div>
              <div v-else >{{ data }}</div>-->

            </div>
            
          </div>
      </div>
</template>
  
<script>
import StyleDefolt from '../../style/component.scss'
import {DisplayLoad, FetchGet} from '../../js/LoadDisplayMetod.js'
import json from './test.json'
  export default {
    name: 'FlightPlaner',
    css:{
      StyleDefolt
    },
    data(){
      return{
        modalwindowDisplay: false,
        tableStatus: true,
        connection: null,
        InputLog: json,
        logs: [],
      }
    },
    methods: {
      SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      },
      ChangeTableStatus(state){
        this.tableStatus = state.state
      },
      StartLog(){
        console.log("Страрт CONT_MODEL - ")
        this.WebSocketLog.push("Send -- Страрт CONT_MODEL - ")
        this.connection.send("CONT_MODEL")
      },
      async StartModeling(){
        DisplayLoad(false)
        this.InputLog.push({
          time: 0,
          flightState: "start modelling!"
        })
        

        let request = await FetchGet("/api/v1/modelling/satellite")
        console.log(request)
      }
      
    },
    /*
    created: function() {
      console.log("Start WebSocket ....")
      this.WebSocketLog.push("Start WebSocket ....")
      this.connection = new WebSocket("ws://localhost:10001/IPC_CLIENT_FRONT")
      

      //подключение
      this.connection.onmessage = (event) => {
          console.log(event)
          
          try {
              this.logs.push(JSON.parse(event.data.replace('[EOF]','')));
              this.WebSocketLog.push(JSON.parse(event.data.replace('[EOF]','')))
          } catch (error) {
            this.logs.push("Не удалось преобразовать входные данные в обьект "+event.data);
            this.WebSocketLog.push("Не удалось преобразовать входные данные в обьект "+event.data)
          }
      }
      this.connection.onopen = (event) => {
        //удачное подключение
        //this.WebSocketLog.push(event)
        console.log(event)
        this.WebSocketLog.push("Successfully connected to the echo websocket server...")
        console.log("Successfully connected to the echo websocket server...")
      }

      // если возникла ошибка
      this.connection.onerror = (error) => {
          this.WebSocketLog.push("WebSocket Error")
          console.log(`WebSocket Error: `, error);
          //alert("На WebSocket ошибка")
      };
      // если соединение закрыто
      this.connection.onclose = (event) => {
          this.WebSocketLog.push("Connection closed....")
          console.log("Connection closed", event);
      };
    }*/

  }
  </script>


<style lang="scss" scoped>


.log_list{
  text-align: left;
  padding: 30px;
  background-color: black;
  color: #2e8000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid #2e8000;
  margin: 20px 10px;

  div{
    border-bottom: 1px solid #2e8000;
  }
}
.flex_contain{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
table{
  width: 95%;
  background-color: black;
  padding: 10px;
  border: 2px solid blue;
  border-radius: 10px;
  color: white;
  tr{
    th{
      padding: 5px 0px;
      border-bottom: 1px solid blue;

    }
    td{
      padding: 5px 0px;
      &.td_flex_row{
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
}
.Logitem{
  display: flex;
  div{
    margin: 5px;
  }
}
.infoTable{
  color:white;
  margin: 10px 10%;
  width: 80%;
  padding: 15px;

  .infoSection{
    text-align: left;
    font-size: 20px;

    .infoObject{
      font-size: 16px;
      margin-left: 15px;
    }
  }

  .buttonStart{
    border-bottom: 1px solid white;
  }

}
</style>