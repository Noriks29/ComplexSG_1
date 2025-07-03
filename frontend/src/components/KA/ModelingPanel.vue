<template>
    <div class="ModellingPanel" v-if="SettingsShow">
          <div class="PanelSettings"  @change="ValidateDataPostModellingSettings">
            <fieldset v-if="systemStatus.typeWorkplace in {1:null, 3:null}">
              <legend>Тип эксперимента:</legend>
              <div><input type="radio" :value="0" v-model="modellingSettings.experiment"/><label>планирование съемок</label></div>
              <div><input type="radio" :value="1" v-model="modellingSettings.experiment"/><label>планирование полёта</label></div>
              <div><input type="radio" :value="2" v-model="modellingSettings.experiment"/><label>моделирование полёта</label></div>
            </fieldset>
            <fieldset v-if="systemStatus.typeWorkplace in {1:null,2:null,3:null} && modellingSettings.flightPlanning == 1">
                <legend>Прогноз заряда АКБ при планировании:</legend>
                <div><input type="radio" :value="0" v-model="modellingSettings.chargeForecasting"/><label>не выполняется</label></div>
                <div><input type="radio" :value="1" v-model="modellingSettings.chargeForecasting"/><label>выполняется, не учитывается</label></div>
                <div><input type="radio" :value="2" v-model="modellingSettings.chargeForecasting"/><label>выполняется, учитывается</label></div>
              </fieldset>
              <fieldset v-if="systemStatus.typeWorkplace in {1:null, 3:null} && modellingSettings.planSimulation == 1">
                <legend>Моделирование полёта:</legend>
                <div><input type="checkbox" v-model="modellingSettings.chargeSimulation"/><label>Использование АКБ</label></div>
                <div><input type="checkbox" v-model="modellingSettings.optionPro42"/><label>Использование Pro</label></div>
              </fieldset>
            <fieldset v-if="systemStatus.typeWorkplace in {3:null, 4:null}">
              <legend>Межспутниковая связь для доставки данных:</legend>
              <div><input type="radio" :value="0" v-model="modellingSettings.useInteraction" true-value="1" false-value="0"/><label>не используется</label></div>
              <div><input type="radio" :value="1" v-model="modellingSettings.useInteraction"/><label>используется</label></div>
            </fieldset>
          </div>
    </div>
</template>
  
<script>

  export default {
    name: 'ModelingPanel',
    data(){
      return{
        modellingSettings:{
          experiment: 0,
          flightPlanning: 0,
          planSimulation: 0,
          chargeForecasting: 0,
          useInteraction: 0,
          chargeSimulation: 0,
          optionPro42: 0,
          experimentEddit: false
        },
        SettingsShow: false
      }
    },
    props:{
        systemStatus:{
            type: Object
        },
    },
    components:{

    },
    methods: {
        SettingsReset(){
            this.modellingSettings={
                experiment: 0,
                flightPlanning: 0,
                planSimulation: 0,
                chargeForecasting: 0,
                useInteraction: 0,
                chargeSimulation: 0,
                optionPro42: 0,
                experimentEddit: false
            }
            this.ValidateDataPostModellingSettings()
        },
        SettingsShowChange(stat){
            this.SettingsShow = stat
        },
        ValidateDataPostModellingSettings(){
        console.log(this.modellingSettings)
        if(this.modellingSettings.experiment < 1){
          this.modellingSettings.chargeForecasting = 0
          this.modellingSettings.flightPlanning = 0
        }
        if(this.modellingSettings.experiment < 2){
          this.modellingSettings.chargeSimulation = 0
          this.modellingSettings.planSimulation = 0
          this.modellingSettings.optionPro42 = 0
        }
        if(this.modellingSettings.experiment >= 1) this.modellingSettings.flightPlanning = 1
        if(this.modellingSettings.experiment >= 2) this.modellingSettings.planSimulation = 1
        this.$ReloadSettings(this.modellingSettings)

      },
    },
    async mounted(){

    }
  }
  </script>


<style lang="scss" scoped>
  .PanelSettings{
    display: flex;
    height: 100%;
    text-align: left;
    flex-direction: column;
    fieldset{
      flex: 1;
    }
  }

  .ModellingPanel{
    position: absolute;
    right: 0px;
    overflow: auto;
    max-width: 40%;
    border-left: 3px solid var(--color-border1);
    background-color: var(--color-bg-panel);
    padding: 2px 10px;
    z-index: 1;
    min-width: 30%;
    height: calc(100% - 4px);
    animation: 0.5s ease-out 0s 1 slideInFromRight;
  }
</style>