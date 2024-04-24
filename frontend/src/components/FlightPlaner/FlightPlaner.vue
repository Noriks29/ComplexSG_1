<template>
    <div class="main_contain">
          <div>
            <button class="ToMenuButtonDiv" @click="ShowModalWindow">
              <img src="../../assets/left-arrow.png">
            </button>
          </div>
          
          <div class="titleText" @click="StartLog">
             <button  @click="StartLog">Продолжить моделирование</button>
          </div>
          <div class="log_list">
            <div v-for="data, index in WebSocketLog"
            :key="index">
            {{ data }}
            </div>
            
          </div>
          <div class="flex_contain">
          <table>
            <tr>
              <th>nodeId</th>
              <th>orderId</th>
              <th>type</th>
              <th>plan</th>
              <th>time</th>
              
            </tr>
            <tr v-for="data, index in logs"
            :key="index">
              <td>{{ data.nodeId }}</td>
              <td>{{ data.orderId }}</td>
              <td>{{ data.type }}</td>
              <td class="td_flex_row">
                <div>{{ data.plan.charge }}</div>
                <div>{{ data.plan.numberRev }}</div>
                <div>{{ data.plan.state }}</div>
              </td>
              <td>{{ data.time }}</td>
            </tr>
          </table>
        </div>
      </div>
</template>
  
<script>
import StyleDefolt from '../../style/component.scss'
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
        WebSocketLog: [],
        logs: [],
      }
    },
    methods: {
      ChangeTableStatus(state){
        this.tableStatus = state.state
      },
      StartLog(){
        console.log("Страрт CONT_MODEL - ")
        this.WebSocketLog.push("Send -- Страрт CONT_MODEL - ")
        this.connection.send("CONT_MODEL")
      }
      
    },
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
          console.log(`WebSocket Error: ${error}`);
          alert("На WebSocket ошибка")
      };
      // если соединение закрыто
      this.connection.onclose = (event) => {
          this.WebSocketLog.push("Connection closed....")
          console.log("Connection closed", event);
      };
    }
  }
  </script>


<style lang="scss" scoped>


.log_list{
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
</style>