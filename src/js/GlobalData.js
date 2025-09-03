import {ref} from "vue";
import SystemWindow from "@/components/PagesTab/SystemWindow.vue";

const GlobalDataPlugin = {
  install(app) {

    const apiVite = app.config.globalProperties
    let SystemObject = ref({typeWorkplace: -1});
    let AccessKey = null

    // работа с наземными пунктами 
    let NPList = ref([]);
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
    let OGList = ref([]);
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




    app.config.globalProperties.$InitAccess = async function (key) {
        AccessKey = key
    };
    app.config.globalProperties.$GetAccess = async function () {
        console.log("key", AccessKey)
        return AccessKey
    };
    app.config.globalProperties.$ChangeSystemObject = async function (param, value, dataS=null) {
        if(dataS == null)SystemObject.value[param] = value
        else{
          SystemObject.value = dataS
        }
        await this.$FetchPost('/api/v1/system/update', SystemObject.value, true)
        return SystemObject.value
    };
    
    
    app.config.globalProperties.$GetSystemObject = async function () {
        SystemObject.value = await this.$FetchGet('/api/v1/system/get', true) || {}
        return SystemObject.value
    };
    
    
    app.config.globalProperties.$SystemObject = function () {
        return SystemObject.value
    };
    
    
    app.config.globalProperties.$InitGlobalData = async function(){
      await $GetNPList()
      await $GetOGList()
      await this.$GetSystemObject()
      return
    }
    app.config.globalProperties.$ClearGlobalData = function(){
        NPList.value = []
        OGList.value = []
        SystemObject = ref({typeWorkplace: -1})
    }

    const toastComponent = ref(null);
    app.component('SystemWindow', SystemWindow);
    app.config.globalProperties.$reloadSystem = function () {
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