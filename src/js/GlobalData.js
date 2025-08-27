import {ref} from "vue";
import SystemWindow from "@/components/PagesTab/SystemWindow.vue";

const GlobalDataPlugin = {
  install(app) {
    let SystemObject = ref({typeWorkplace: -1});
    let NPList = ref([]);
    let OGList = ref([]);
    let AccessKey = null
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
    app.config.globalProperties.$ChangeNPList = async function (data) {
        await this.$FetchPost("/api/v1/earth/update/byList", data)
        NPList.value = data
        return NPList.value
    };
    app.config.globalProperties.$ChangeOGList = async function (data) {
      for (let i = 0; i < OGList.value.length; i++) {
        if(OGList.value[i].id == data.id){OGList.value[i] = data}
      }
        await this.$FetchPost('/api/v1/constellation/update', data)
    };
    app.config.globalProperties.$GetSystemObject = async function () {
        SystemObject.value = await this.$FetchGet('/api/v1/system/get', true) || {}
        return SystemObject.value
    };
    app.config.globalProperties.$GetNPList = async function () {
        NPList.value = await this.$FetchGet('/api/v1/earth/get/list') || []
        return NPList.value
    };
    app.config.globalProperties.$GetOGList = async function () {
        OGList.value = await this.$FetchGet('/api/v1/constellation/get/list') || []
        return OGList.value
    };
    app.config.globalProperties.$SystemObject = function () {
        return SystemObject.value
    };
    app.config.globalProperties.$NPList = function () {
        return NPList.value
    };
    app.config.globalProperties.$OGList = function () {
        return OGList.value
    };

    app.config.globalProperties.$InitGlobalData = async function(){
        NPList.value = await this.$FetchGet('/api/v1/earth/get/list', false) || []
        OGList.value = await this.$FetchGet('/api/v1/constellation/get/list', false) || []
        await this.$GetSystemObject()
        return
    }
    app.config.globalProperties.$ClearGlobalData = function(){
        NPList = ref([])
        OGList = ref([])
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