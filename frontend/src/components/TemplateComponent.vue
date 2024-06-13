<template>
    <div class="SectionMenu">
      <div class="ButtonSection first">
        <button :class="ActiveComponent.NP ? 'active' : ''" @click="SelectComponent('NP')"><div :class="systemStatus.earthStatus ? 'approved' : 'Notapproved'"></div>НП</button>
        <button :class="ActiveComponent.OG ? 'active' : ''" @click="SelectComponent('OG')"><div :class="systemStatus.constellationStatus ? 'approved' : 'Notapproved'"></div>ОГ</button>
        <button :class="ActiveComponent.TypeKA ? 'active' : ''" @click="SelectComponent('TypeKA')">Типы КА</button>
        <button :class="ActiveComponent.SystemWindow ? 'active' : ''" @click="SelectComponent('SystemWindow')">Система</button>
        <button :class="ActiveComponent.TargetDZZ ? 'active' : ''" @click="SelectComponent('TargetDZZ')">Заявки ДЗЗ</button>
      </div>
      <div class="ButtonSection second">
        <button :class="ActiveComponent.EarthConstellation ? 'active' : ''" @click="SelectComponent('EarthConstellation')"><div :class="systemStatus.earthSatStatus ? 'approved' : 'Notapproved'"></div>План контактов НП – ОГ</button>
        <button><div :class="systemStatus.satSatStatus ? 'approved' : 'Notapproved'"></div>КА - КА</button>
        <button>КА - КА решетка</button>
        <button :class="ActiveComponent.EstimationConstellation ? 'active' : ''" @click="SelectComponent('EstimationConstellation')">Оценка ОГ</button>
        <button>Реконфигурация</button>
        <button>Обработка ТМИ</button>
      </div>
      <div class="ButtonSection third">
        <button :class="ActiveComponent.KA1 ? 'active' : ''" @click="SelectComponent('KA1')">КА</button>
        <button>КС 1</button>
        <button>КС 2</button>
        <button>КС 3</button>
      </div>
    </div>
</template>

<script>
export default {
  name: 'TemplateComponent',
  props:{
    systemStatus:{
          type: Object
        },
    ActiveComponent:{
          type: Object
        },
    
  },
  data(){
      return{

    }
  },
  methods: {
    SelectComponent(nameComponent) {
      if(this.ActiveComponent[nameComponent] == true)
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
        position: relative;



      button{
        
        transition: all 0.2s ease-out;
        border: none;
        color: white;
        flex: 1 0 auto;
        
        font-size: 25px;
        overflow: hidden;
        text-decoration: none;
        position: relative;

        border-top: 1px solid black;
        border-right: 1px solid black;
        background-color: rgba(29, 29, 29, 0.4);
        transform: translate(-1px, 1px);
        pointer-events: none;

        &.active{
          pointer-events: all;
          transform: translate(0px, 0px);
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

        }

        
        div{
          position: absolute;
          width: 10px;
          
          height: 10px;
          top: 20%;
          left: 10px;
          border-radius: 20px;
          

          &.approved{
            background-color: rgb(0, 139, 0);
            box-shadow: 0px 0px 5px rgb(11, 167, 11);
          }
          &.Notapproved{
            background-color: red;
            box-shadow: 0px 0px 5px #fe1a1a;
          }

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
