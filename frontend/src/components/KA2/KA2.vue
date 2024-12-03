<template>
  <div class="main_contain">
    <DefaultTable v-if="ShowDefaultTable" :dataLableName="dataLableName" :dataTable="dataTable" @closetable="ShowDefaultTable = false" :prevrap="PreWrapDefaultTable"/>
    <div>
      <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
        <img src="../../assets/exit.svg">
      </button>
    </div>

    <div class="ContentDiv">
      <h1 class="TitleText">Моделирование доставки данных</h1>

      <div class="Panel">
        <table>
          <tr><td>Начальное время расчетов:</td><td v-html="CreateDateTime(systemStatus.startTime)"></td></tr>
          <tr><td>Начало горизонта моделирования:</td><td v-html="CreateDateTime(systemStatus.modelingBegin)"></td></tr>
        </table>
      </div>
      <div class="Panel MaxWidth">
        <div>
          <fieldset @change="ChangeInputRadio">
            <legend>Тип эксперимента:</legend>
            <div>
              <input type="radio" name="experimentType" value="1" checked />
              <label>Планирование заявок</label>
            </div>
            <div>
              <input type="radio" name="experimentType" value="2" />
              <label>Планирование заявок и планирование полёта</label>
            </div>
            <div>
              <input type="radio" name="experimentType" value="3" />
              <label>Планирование заявок и моделирование полёта</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="Panel MaxWidth">
        <div>
          <button class="ButtonCommand rightPadding" @click="StartModelling">
            <img src="../../assets/start.png" alt="" class="iconButton">Начать
          </button>
        </div>
      </div>

      <div class="Panel MaxWidth" v-if="true">
        <div class="PanelWork">
          <table class="colum">
            <tr>
              <td>Заявки</td>
              <td><button class="ButtonCommand">Невыполнимые</button></td>
            </tr>
            <tr>
              <td></td>
              <td colspan="3"><button @click="ShowLogEvent" class="ButtonCommand">Лог движка</button></td>
              <td colspan="1"><button @click="ShowLogSMAO" class="ButtonCommand icon">
                  <img src="../../assets/instructions.png" alt="smaoResponse">
                </button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UnixToDtime } from '@/js/WorkWithDTime';
import { DisplayLoad, FetchPost } from '@/js/LoadDisplayMetod';
import DefaultTable from '@/components/DefaultTable.vue'
export default {
  name: 'KA2',
  data() {
    return {
      modellingResult: null,
      dataTable: [],
      dataLableName: [],
      PreWrapDefaultTable: false,
      ShowDefaultTable: false
    };
  },
  props: {
    systemStatus: {
      type: Object
    }
  },
  components:{
      DefaultTable
    },
  methods: {
    SelectComponent(nameComponent) {
      this.$emit('updateParentComponent', { nameComponent: nameComponent });
    },
    CreateDateTime(time, text = true) {
      let Dtime = UnixToDtime(time);
      if (!text) {
        return Dtime.date + " " + Dtime.time;
      }
      return Dtime.date + " " + Dtime.time + " МСК";
    },
    async StartModelling() {
      DisplayLoad(true);
      let datamodelling = {
        "experimentType": 1,
        "modellingMode": 1
      };
      let rezult = await FetchPost("/api/v1/modelling/smao/dtn", datamodelling);
      console.log(rezult);

      this.modellingResult = rezult; // Проверка, что данные моделирования получены

      DisplayLoad(false);
    },
    ShowLogEvent() {
    // Проверяем наличие данных
      if (!this.modellingResult.engineLogResponse) {
        console.error('Логи движка отсутствуют или данные моделирования не загружены.');
        return;
      }

      // Очищаем предыдущие данные
      this.dataTable = [];
      this.dataLableName = [
        { label: "Данные", nameParam: "data" }
      ];

      // Формируем данные для отображения
      this.modellingResult.engineLogResponse.forEach(log => {
        this.dataTable.push({
          data: log
        });
      });

      this.PreWrapDefaultTable = false;
      this.ShowDefaultTable = true;
    },
    ShowLogSMAO() {
      // Добавляем проверку на наличие данных
      if (this.modellingResult.dtnRoutingResponse) {
        this.dataTable = [];
        this.dataLableName = [{ label: "data", nameParam: "data" }];
          this.dataTable.push({ data: this.modellingResult.dtnRoutingResponse });
        this.PreWrapDefaultTable = true;
        this.ShowDefaultTable = true;
      } else {
        console.error('Smao is undefined or modellingRezult is missing.');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
fieldset {
  text-align: left;
}
.PanelWork {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.colum {
  flex: 1;
  button {
    width: 99%;
  }
}

.FlexColum {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;

  button {
    margin: 5px;
  }
}

.SelectMode {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  height: 45px;
  font-size: 18px;
  div {
    img {
      width: 40px;
      &:active {
        width: 30px;
      }
      &.disable {
        pointer-events: none;
      }
    }
  }
}

.ContentDiv {
  height: fit-content;
}
</style>
