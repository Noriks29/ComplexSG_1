import { ref } from 'vue';
import ModellingComponent from '@/components/KA/ModellingComponent.vue';
import ModelingPanel from '@/components/KA/ModelingPanel.vue';
import ModelingRezult from '@/components/KA/ModelingRezult.vue';
const ModellingProcess = {
  install(app) {
    const ModelComponent = ref(null);
    const SettingsComponent = ref(null);
    const RezultComponent = ref(null);

    app.component('ModellingComponent', ModellingComponent);
    app.config.globalProperties.$ReloadSettings = function (data) {
      if (ModelComponent.value && ModelComponent.value.ReloadSettings) {
        ModelComponent.value.ReloadSettings(data);
      } else {
        this.$showToast('Ошибка сохранения настроек','error',"LOAD");
      }
    };


    app.component('ModelingPanel', ModelingPanel);
    app.config.globalProperties.$SettingsShowChange = function (data) {
      if (SettingsComponent.value && SettingsComponent.value.SettingsShowChange) {
        SettingsComponent.value.SettingsShowChange(data);
      } else {
        this.$showToast('Ошибка сохранения настроек','error',"LOAD");
      }
    };

    app.component('ModelingRezult', ModelingRezult);
    app.config.globalProperties.$SettingsShowChange = function (data) {
      if (RezultComponent.value && RezultComponent.value.SettingsShowChange) {
        RezultComponent.value.SettingsShowChange(data);
      } else {
        this.$showToast('Ошибка сохранения настроек','error',"LOAD");
      }
    };
    /*
    app.config.globalProperties.$FetchGet = async function (http, AlertError = true, massage=null){

    }*/

    app.mixin({
      mounted() {
        if (this.$options.name === "ModellingComponent") {
          ModelComponent.value = this;
        }
        else if (this.$options.name === "ModelingPanel") {
          SettingsComponent.value = this;
        }
        else if (this.$options.name === "ModelingRezult") {
          RezultComponent.value = this;
        }
      },
    });
  },
};

export default ModellingProcess;