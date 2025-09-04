import {ref} from "vue";
import SystemWindow from "@/components/PagesTab/SystemWindow.vue";

const GlobalDataPlugin = {
  install(app) {

    const apiVite = app.config.globalProperties
    
    let AccessKey = null

    // работа с наземными пунктами 
    const NPList = ref([]);
    const $NPList = function () {
        return NPList
    };
    const $ChangeNPList = async function (data, reload = false) {
        //console.log("Позже сделать через отдельный запрос на сохранение изменения одного нп", data)
        await apiVite.$FetchPost("/api/v1/earth/update/byList", NPList.value)
        if(reload) $GetNPList()
    };
    const $GetNPList = async function () {
        NPList.value = await apiVite.$FetchGet('/api/v1/earth/get/list') || []
    };
    apiVite.$ChangeNPList = $ChangeNPList
    apiVite.$GetNPList = $GetNPList
    apiVite.$NPList = $NPList

    //Работа с орбитальными группировками
    const OGList = ref([]);
    const $OGList = function () {
        return OGList
    };
    const $ChangeOGList = async function (index, reload = false) {
      console.log(index, OGList)
      await apiVite.$FetchPost('/api/v1/constellation/update', OGList.value[index])
      if(reload) await $GetOGList()
    };
    const $GetOGList = async function () {
        OGList.value = await apiVite.$FetchGet('/api/v1/constellation/get/list') || []
    };
    apiVite.$GetOGList = $GetOGList
    apiVite.$OGList = $OGList 
    apiVite.$ChangeOGList = $ChangeOGList



    //Работа с системой
    const SystemObject = ref({typeWorkplace: -1});
    const $ChangeSystemObject = async function (param, value, dataS=null) {
      console.log(param, value, dataS, "Система")
      await apiVite.$FetchPost('/api/v1/system/update', SystemObject.value, true)
    };
    const $GetSystemObject = async function () {
      SystemObject.value = await apiVite.$FetchGet('/api/v1/system/get', true) || {}
    };
    const $SystemObject = function () {
      return SystemObject
    };
    apiVite.$ChangeSystemObject = $ChangeSystemObject
    apiVite.$GetSystemObject = $GetSystemObject
    apiVite.$SystemObject = $SystemObject


    const Targets = ref({
      datarequest:[], catalog:[], request:[]
    })
    const $ChangeTargets = async function (typeTarget, reload=false) {
      switch (typeTarget) {
        case 'request':
          await apiVite.$FetchPost("/api/v1/satrequest/request/update", Targets.value.request)
          break;
        case 'catalog':
          await apiVite.$FetchPost("/api/v1/satrequest/catalog/update", Targets.value.catalog)
          break;
        case 'datarequest':
          await apiVite.$FetchPost("/api/v1/satrequest/data/update", Targets.value.datarequest)
          break;
        default:
          console.error("Какое то несоответствие запросов на заявки!")
          return
      }
      if(reload) $GetTargets(typeTarget)
    };
    const $GetTargets = async function (typeTarget=null) {
      if((typeTarget == null || typeTarget == 'datarequest') && ([4, 5].includes(SystemObject.value.typeWorkplace))){
        Targets.value.datarequest = await apiVite.$FetchGet('/api/v1/satrequest/data/get/all') || []
        Targets.value.datarequest.forEach(request => {
          request.timeDate = new Date(request.time * 1000) || null
        })
      }
      else if(typeTarget == 'catalog' && !([4, 5].includes(SystemObject.value.typeWorkplace))){
        Targets.value.catalog = await apiVite.$FetchGet('/api/v1/satrequest/catalog/get/all') || []
      }
      else if(typeTarget == 'request' && !([4, 5].includes(SystemObject.value.typeWorkplace))){
        Targets.value.request = await apiVite.$FetchGet('/api/v1/satrequest/request/get/all') || []
      }
      else if(typeTarget == null && !([4, 5].includes(SystemObject.value.typeWorkplace))){
        Targets.value.catalog = await apiVite.$FetchGet('/api/v1/satrequest/catalog/get/all') || []
        Targets.value.request = await apiVite.$FetchGet('/api/v1/satrequest/request/get/all') || []
      }
      else{
        console.error("Какое то несоответствие запросов на заявки!")
      }
      if(Targets.value.request.length > 0){
        Targets.value.request.forEach(request => {
          request.timeDate = new Date(request.time * 1000) || null
          request.termDate = new Date(request.term * 1000) || null
        })
      }
    };
    const $Targets = function () {
      return Targets
    };
    apiVite.$ChangeTargets = $ChangeTargets
    apiVite.$GetTargets = $GetTargets
    apiVite.$Targets = $Targets


    apiVite.$InitAccess = async function (key) {
        AccessKey = key
    };
    apiVite.$GetAccess = async function () {
        console.log("Запрос", AccessKey)
        return AccessKey
    };
    
    apiVite.$InitGlobalData = async function(){
      await $GetSystemObject()
      await $GetNPList()
      await $GetOGList()
      await $GetTargets()
      return
    }
    apiVite.$ClearGlobalData = function(){
        NPList.value = []
        OGList.value = []
        SystemObject.value = {typeWorkplace: -1}
        Targets.value = {datarequest:[], catalog:[], request:[]}
    }

    const toastComponent = ref(null);
    app.component('SystemWindow', SystemWindow);
    apiVite.$reloadSystem = function () {
      if (toastComponent.value && toastComponent.value.reload) {
        toastComponent.value.reload();
      } else {
        console.error('Error reload system');
      }
    };
    app.mixin({
      mounted() {
        if (this.$options.name === "SystemWindow") {
          toastComponent.value = this;
        }
      },
    });

  },
};

export default GlobalDataPlugin;