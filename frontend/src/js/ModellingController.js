import { ref } from 'vue';
import ModellingComponent from '@/components/KA/ModellingComponent.vue';
import ModelingRezult from '@/components/KA/ModelingRezult.vue';
import { UnixToDtime } from '@/js/WorkWithDTime';
const ModellingProcess = {
  install(app) {
    const ModelComponent = ref(null);
    const RezultComponent = ref(null);
    const ModelingPanelComponent = ref(null)
    let ModellingRezultData = ref(undefined)

    let ModellingSettings = ref({
      experiment: 0,flightPlanning: 0,planSimulation: 0,chargeForecasting: 0,useInteraction: 0,chargeSimulation: 0,optionPro42: 0
    })
    function ValidateDataPostModellingSettings(){
      if(ModellingSettings.value.experiment < 1){
        ModellingSettings.value.chargeForecasting = 0
        ModellingSettings.value.flightPlanning = 0
      }
      if(ModellingSettings.value.experiment < 2){
        ModellingSettings.value.chargeSimulation = 0
        ModellingSettings.value.planSimulation = 0
        ModellingSettings.value.optionPro42 = 0
      }
      if(ModellingSettings.value.experiment >= 1) ModellingSettings.value.flightPlanning = 1
      if(ModellingSettings.value.experiment >= 2) ModellingSettings.value.planSimulation = 1
    }
    app.config.globalProperties.$SetSettings = async function (data=null) {
      if(data == null){
        let system = this.$SystemObject()
        ModellingSettings.value = {experiment: 0,flightPlanning: 0,planSimulation: 0,chargeForecasting: 0,useInteraction: 0,chargeSimulation: 0,optionPro42: 0}
        if (system.typeWorkplace in {2:null}) {
          ModellingSettings.value.experiment = 1
        }
        if (system.typeWorkplace in {4:null}) {
          ModellingSettings.value.experiment = 2
          ModellingSettings.value.chargeForecasting = 2
          ModellingSettings.value.chargeSimulation = 1
        }
      }
      else ModellingSettings.value = data
      await ValidateDataPostModellingSettings()
      return ModellingSettings.value
    }
    app.config.globalProperties.$GetSettings = function () {
      return ModellingSettings.value
    }
    app.component('ModellingComponent', ModellingComponent);
    app.config.globalProperties.$ReloadSettings = function () {
      if (ModelComponent.value && ModelComponent.value.ReloadSettings) {
        ModelComponent.value.ReloadSettings(ModellingSettings.value);
      } else {
        this.$showToast('Ошибка сохранения настроек','error',"LOAD");
      }
    };


    app.config.globalProperties.$SetModellingRezult = function (ModellingData, eventsList) {
      try{ModellingRezultData.value.Smao.push(ModellingData.smaoLogResponse)} //лог движка 
          catch (error) {console.error(error)}
        try {//лог событий
          let dataevents = {}
          eventsList.forEach(element => dataevents[element.codeEvent]=element.descriptionEvent)
          ModellingData.logResponse.logDataArray.forEach(element => {
            const e = Object.assign({}, element);
            e.timeUnix = UnixToDtime(e.time).time
            e.event = dataevents[e.type]
            ModellingRezultData.value.events.push(e)
          })
        }catch (error) {console.error(error)}

        try { //обработка лога полёта
          ModellingRezultData.value.fcLog = []
          ModellingData.logResponse.fcLogArray.forEach(element => {
            element.timeBegin = UnixToDtime(element.timeBegin).time
            element.timeEnd = UnixToDtime(element.timeEnd).time
            let flag = true
            for (let index = 0; index < ModellingRezultData.value.fcLog.length; index++)
              if(element.idSender == ModellingRezultData.value.fcLog[index].idSender){
                ModellingRezultData.value.fcLog[index].data.push(element)
                flag = false
                break
              }
            if(flag) ModellingRezultData.value.fcLog.push({idSender: element.idSender, data:[element]})
          })
        }catch (error) {console.error(error)}
        
        ModellingData.engineLogResponse.forEach(element => { //обработка других событий
          try {
            element.time = this.CreateDateTime(element.time)
            ModellingRezultData.value.log.push(element)
            if(element.type == "E77"){ //план съёмок 
              let oneE77 = {idSender:  element.idSender, data: []}
              for (let index = 0; index < element.visualFormsData.visualFormsDataShooting.length; index++) {
                const e = Object.assign({}, element.visualFormsData.visualFormsDataShooting[index]);
                e.wsUnix = UnixToDtime(Math.floor(e.ws)).time
                e.weUnix = UnixToDtime(Math.floor(e.we)).time
                e.tsUnix = UnixToDtime(Math.floor(e.ts)).time
                e.teUnix = UnixToDtime(Math.floor(e.te)).time
                e.pitch =  Math.round(e.pitch * 100) / 100
                e.roll =  Math.round(e.roll * 100) / 100
                oneE77.data.push(e)
              }
              ModellingRezultData.value.E77.push(oneE77)
            }
            else if (element.type == "E78"){
              if (element.dataDownPlan.partsPlan.length > 0) {
                ModellingRezultData.value.E78.push(element)
              }
            }
            else if (element.type == "E79"){
              if (element.mainFlightPlan !== null) {
                let E79Create = []
                element.mainFlightPlan.flightPlan.forEach(E79D =>{
                  const e = Object.assign({}, E79D);
                  e.timeUnix = UnixToDtime(e.timeBegin).time +' - '+ UnixToDtime(e.timeEnd).time
                  E79Create.push(e)
                })
                ModellingRezultData.value.E79.push({idSender: element.idSender, data: E79Create})
              }
            }
          } catch (error) {
            console.error(error, element)
            ModellingRezultData.value.log.push("-!-!-!-!-ОШИБКА обработки на строке - " + element)
          }
        });
        console.log("Результат моделлирования и обработки", ModellingRezultData.value)
        this.$dataTransfer(ModellingRezultData)
    };
    app.config.globalProperties.$SetModellingRezultSelect = function (id) {
        let data = {
          E77: [],
          E78: [],
          E79: [],
          fcLog: [],
          selectKA: id
        }
        ModellingRezultData.value.E77.forEach(E77 =>{
          if (E77.idSender == id) {data.E77 = E77.data}
        })
        ModellingRezultData.value.E78.forEach(E78 =>{
          if (E78.idSender == id) {data.E78 = E78.dataDownPlan.partsPlan}
        })
        ModellingRezultData.value.E79.forEach(E79 =>{
          if (E79.idSender == id) {data.E79 = E79.data}
        })
        ModellingRezultData.value.fcLog.forEach(fcLog =>{
          if (fcLog.idSender == id) {data.fcLog = fcLog.data}
        })
      ModellingRezultData.value.Select = data
      console.log("Выбранный КА", ModellingRezultData)
      return data
    }
    app.config.globalProperties.$InitModellingRezult = function () {
      ModellingRezultData = ref({
            log: [],
            E77: [],
            E78: [],
            hide: [],
            E79: [],
            Smao: [],
            events: [],
            fcLog:[],
            Select:{
              E77: [],
              E78: [],
              E79: [],
              fcLog:[],
              selectKA: undefined
            }
      });
    }
    app.config.globalProperties.$GetModellingRezult = function () {
      console.log(ModellingRezultData.value, "получение данных")
      return ModellingRezultData.value
    }

    app.component('ModelingRezult', ModelingRezult);
    app.config.globalProperties.$RezultShow = function (status) {
      if (RezultComponent.value && RezultComponent.value.RezultShowChange) {
        RezultComponent.value.RezultShowChange(status);
      } else {
        this.$showToast('Ошибка сохранения настроек','error',"LOAD");
      }
    };
    app.config.globalProperties.$dataTransfer = function (data) {
      if (RezultComponent.value && RezultComponent.value.dataTransfer) {
        RezultComponent.value.dataTransfer(data);
      } else {
        this.$showToast('Ошибка сохранения настроек','error',"LOAD");
      }
    };


    app.mixin({
      mounted() {
        if (this.$options.name === "ModellingComponent") {
          ModelComponent.value = this;
        }
        else if (this.$options.name === "ModelingRezult") {
          RezultComponent.value = this;
        }
        else if (this.$options.name === "ModelingPanel") {
          ModelingPanelComponent.value = this;
        }
      }
    });
  },
};

export default ModellingProcess;