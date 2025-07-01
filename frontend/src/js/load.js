import { ref } from 'vue';
import LoadProcess from '@/components/LoadProcess.vue';
import {adress} from "@/js/config_server";
const LoadProcessPlugin = {
  install(app) {
    const LoadComponent = ref(null);

    app.component('LoadProcess', LoadProcess);
    app.config.globalProperties.$showLoad = function (status, title=null) {
      if (LoadComponent.value && LoadComponent.value.showSuccess) {
        LoadComponent.value.showSuccess(status, title);
      } else {
        this.$showToast('Ошибка отображения загрузки','error',"LOAD");
      }
    };
    app.config.globalProperties.$FetchGet = async function (http, AlertError = true, massage=null){
        let key = await this.$GetAccess()
        try {
            const response = await fetch('http://'+adress+http+'?accessKey='+key);
            if (!response.ok) { // для мэссэджей ильяса
                let rezult = await response.json()
                throw new Error(rezult.MESSAGE);
            }
            else{
                let rezult = await response.json()
                if(massage != null) this.$showToast(massage,'success',"Запрос выполнен");
                return rezult;
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            if(AlertError) this.$showToast(error,'error',"Запрос не выполнен");
            return undefined
        }
    }
    app.config.globalProperties.$FetchPost = async function (http,datapost,dopparamhttp, AlertError = true, massage=null){
        
        let key = await this.$GetAccess()
        if(dopparamhttp != undefined){
            key = key +"&"+dopparamhttp
        }
        try {
            const response = await fetch('http://'+adress+http+'?accessKey='+key,{
              method:  'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(datapost)
            })
            if (!response.ok) {
                let rezult = await response.json()
                throw new Error(rezult.MESSAGE);
            }
            else{
                let rezult = await response.json()
                if(massage != null) this.$showToast(massage,'success',"Запрос выполнен");
                return rezult;
            }
            } catch (error) {
                console.error('Error save:', error);
                if(AlertError) this.$showToast(error,'error',"Запрос не выполнен");
                return undefined;
            }
    }
      app.config.globalProperties.$FetchPostFile = async function (http,formData){
            let key = await this.$GetAccess()
            let add = adress
            
            try {
                const response = await fetch('http://'+add+http+'?accessKey='+key,{
                  method:  'POST',
                  mode: 'cors',
                  body: formData
                })
                if (!response.ok) {
                    let rezult = await response.json()
                    throw new Error(rezult.MESSAGE);
                }
                else{
                    let rezult = await response.json()
                    //DisplayLoad(false)
                    return rezult;
                }
                } catch (error) {
                    console.log('Error save:', error);
                    //DisplayLoad(false)
                    return undefined;
                }
    }

    app.mixin({
      mounted() {
        if (this.$options.name === "LoadProcess") {
          LoadComponent.value = this;
        }
      },
    });
  },
};

export default LoadProcessPlugin;