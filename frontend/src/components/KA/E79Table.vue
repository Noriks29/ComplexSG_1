<template>
    <div class="DataTable">
      <div class="closebutton">
        <button @click="CloseTable">
          <img src="../../assets/close.svg" />
          <span>&#8203;</span>
        </button>
      </div>
      <div class="scroll-table">
        <table class="TableDefault">
          <thead>
            <tr>
              <th>Количество витков</th>
              <th>Начало</th>
              <th>Конец</th>
              <th>Свет/Тень</th>
              <th>Режим</th>
            </tr>
          </thead>
        </table>
        <div class="scroll-table-body">
          <table class="TableDefault">
            <tbody>
              <tr v-for="(flight, index) in flightPlan" :key="index">
                <td>{{ flight.numberRev }}</td>
                <td>{{ formatTime(flight.timeBegin) }}</td>
                <td>{{ formatTime(flight.timeEnd) }}</td>
                <td>{{ flight.sunMode === 0 ? 'Тень' : 'Свет' }}</td>
                <td>{{ flight.mode }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>  
<script>
import { UnixToDtime } from '../../js/WorkWithDTime'

export default {
  name: 'E78Data',
  props: {
    flightPlan: {
      type: Array,
      required: true,
    },
  },
  methods: {
    CloseTable() {
      this.$emit('closetable', true);
    },
    formatTime(unixTime) {
      const date = UnixToDtime(unixTime);
      return `${date.time} МСК`;
    },
  },
};
</script>

  
  
  <style lang="scss" scoped>
  .closebutton{
    display: flex;
    margin: 20px;
    flex-direction: row-reverse;
    button{
      background: none;
      border: none;
      img{
        width: 25px;
      }
    }
  }
  .DataTable{
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0%;
    left: 0;
    width: 100%;
    z-index: 4;
    max-width: 100%;
    .TableDefault{
      filter: drop-shadow(2px 4px 6px black);
  
    }
    .PanelTable{
      position: sticky;
      bottom: 20px;
      margin: 0px 5%;
      width: 90%;
    }
  }
  .PanelDefault{
    width: 95%;
    padding: 5px;
  
  }
  .scroll-table-body {
      height: 75vh;
  
  }
  .smallTh{
    width: 50px;
  }
  .scroll-table{
    margin: 0% 2%;
      background-color: rgba(151, 151, 151, 0.15);
      box-shadow: -4px 3px 1px rgba(63, 60, 60, 0.35);
      border: 2px solid rgba(0, 0, 0, 0.25);
  }
  tr{
    background-color: rgba(0, 0, 0, 0.755);
  }
  </style>