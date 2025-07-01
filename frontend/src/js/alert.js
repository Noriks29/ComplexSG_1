import { ref } from 'vue';
import AlertToast from '@/components/AlertToast.vue'; 

const AlertToastPlugin = {
  install(app) {
    const toastComponent = ref(null);

    app.component('AlertToast', AlertToast);
    app.config.globalProperties.$showToast = function (message, type, title) {
      if (toastComponent.value && toastComponent.value.showSuccess) {
        toastComponent.value.showSuccess(message, type, title);
      } else {
        console.error('Error showing success toast');
      }
    };

    app.mixin({
      mounted() {
        if (this.$options.name === "AlertToast") {
          toastComponent.value = this;
        }
      },
    });
  },
};

export default AlertToastPlugin;