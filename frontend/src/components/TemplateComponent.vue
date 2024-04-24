<template>
    <div class="SectionMenu">
      <div class="ButtonSection first">
        <button @click="SelectComponent('NP')">НП</button>
        <button @click="SelectComponent('OG')">ОГ</button>
        <button @click="SelectComponent('TypeKA')">Типы КА</button>
        <button>Система</button>
        <button>Заявки ДЗЗ</button>
      </div>
      <div class="ButtonSection second">
        <button>КА - НП</button>
        <button>КА - КА</button>
        <button>КА - КА решетка</button>
        <button>Оценка ОГ</button>
        <button>Реконфигурация</button>
        <button>Обработка ТМИ</button>
      </div>
      <div class="ButtonSection third">
        <button @click="SelectComponent('FlightPlaner')">Модель полета КА</button>
        <button>Планирование заявок</button>
        <button>Доставка данных</button>
        <button>Планирование и доставка</button>
      </div>
    </div>
</template>

<script>
export default {
  name: 'TemplateComponent',
  methods: {
    SelectComponent(nameComponent) {
        this.$emit('updateParentComponent', {
            nameComponent: nameComponent
        })
      }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.SectionMenu{
    width: 81%;
    height: 600px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    margin: 1% 9%;

    

    .ButtonSection{
        width: 30%;
        background-color: rgba(151, 151, 151, 0.15);
        box-shadow: -4px 3px 1px rgba(63, 60, 60, 0.35);
        border: 2px solid rgba(0, 0, 0, 0.25);
        height: 70%;
        /*transform: skew(15deg, 0deg);*/
        margin-left: 1%;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        padding: 10px;
        transition: all 0.2s ease-out;



      button{
        background-color: rgba(61, 61, 61, 0.3);
        transition: all 0.2s ease-out;
        border: none;
        color: white;
        flex: 1 0 auto;
        border-bottom: 1px solid black;
        border-left: 1px solid black;
        font-size: 25px;
        overflow: hidden;
        text-decoration: none;
        position: relative;
        

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
      }

      &:hover{
        &.first {
            box-shadow: -4px 3px 3px rgba(12, 12, 73, 0.7);
            button:hover{
                box-shadow: -4px 4px 1px rgba(12, 12, 73, 0.6);
            }
        }
        &.second {
            box-shadow: -4px 3px 3px rgba(35, 12, 73, 0.7);
            button:hover{
                box-shadow: -4px 4px 1px rgba(35, 12, 73, 0.6);
            }
        }
        &.third {
            box-shadow: -4px 3px 3px rgba(12, 54, 73, 0.7);
            button:hover{
                box-shadow: -4px 4px 1px rgba(12, 54, 73, 0.6);
            }
        }
        border: 2px solid rgba(71, 71, 71, 0.25);
      }
      

    }
  }
</style>
