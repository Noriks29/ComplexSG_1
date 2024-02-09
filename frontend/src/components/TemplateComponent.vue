<template>
  <div class="main_contain">
        <div class="button_flex">
            <div class="button_level">
                <div class="NP"><button  @click="SelectComponent('NP')">НП</button></div>
                <div class="NP"><button>ОГ</button></div>
                <div class="NP"><button>Типы КА</button></div>
                <div class="NP"><button>Система</button></div>
                <div class="NP"><button>Заявки ДЗЗ</button></div>
            </div>
            <div class="button_level">
                <div class="NP"><button>КА - НП</button></div>
                <div class="NP"><button>КА - КА</button></div>
                <div class="NP"><button>КА - КА решетка</button></div>
                <div class="NP"><button>Оценка ОГ</button></div>
                <div class="NP"><button>Реконфигурация</button></div>
                <div class="NP"><button>Обработка ТМИ</button></div>
            </div>
            <div class="button_level">
                <div class="NP"><button>Модель полета КА</button></div>
                <div class="NP"><button>Планирование заявок</button></div>
                <div class="NP"><button>Доставка данных</button></div>
                <div class="NP"><button>Планирование и доставка</button></div>
            </div>
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
<style scoped>
.button_flex{
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
}

.main_contain{
    height: 90vh;
    max-width: 99%;
}   
.button_level{
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    margin-top: 15px;
}
.button_level div{
    margin: 10px;
    padding: 3px;
    flex: 1;
}

.button_level button{
    background: none;
    height: 100%;
    width: 100%;
    font-size: 30px;
}
</style>
