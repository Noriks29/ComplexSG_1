<template>
  <div class="notification-container">
    <div class="notification" :class="data.type+' '+data.delete" v-for="data, index in dataAlert" :key="index">
        <div>
        <strong class="Title">{{data.type+' - '+data.title}}</strong>
        {{ data.message }}
        </div>
        <button class="close-btn" @click="dismissToast(data.id)">x</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AlertToast",
  data() {
    return {
      dataAlert:{},
      maxid:0,
    };
  },
  methods: {
    showSuccess(message=null, type=null, title=null, time=5000) {
      this.dataAlert[this.maxid]={id: this.maxid,message: message, type: type, title: title, delete: ''}
      let id = this.maxid 
      setTimeout(() => {
        this.dismissToast(id)
      }, time);
      this.maxid++
      console.log(this.dataAlert)
    },
    dismissToast(id) {
      if(this.dataAlert[id] != undefined){
        this.dataAlert[id].delete = 'hide'
        setTimeout(() => {
            delete this.dataAlert[id]
        }, 400);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

/* Контейнер для уведомлений (фиксируется в правом верхнем углу) */
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 300px;
}

/* Базовые стили уведомлений */
.notification {
  position: relative;
  padding: 1rem 1.5rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(100%);
  animation: slideIn 0.3s ease-out forwards;
  transition: all 0.3s ease;

  &.hide {
    animation: fadeOut 0.3s ease-out forwards;
  }
  &::before {
    content: '';
    width: 24px;
    height: 24px;
    margin-right: 12px;
    background-size: contain;
    background-repeat: no-repeat;
  }
  .close-btn {
    margin-left: auto;
    background: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
    opacity: 0.5;
    transition: opacity 0.2s;
    font-size: 1.2rem;
    line-height: 1;
    &:hover{
        opacity: 1;
    }
  }
}

/* Анимации */
@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes fadeOut {
  from{
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* Стили для разных типов уведомлений */
.notification { background-color: #f8f9fa; border-color: #dee2e6; color: #212529; }
.notification::before { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236c757d'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E"); }

.notification.info { background-color: #e7f5ff; border-color: #74c0fc; color: #1864ab; }
.notification.info::before { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23228be6'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E"); }

.notification.warning { background-color: #fff9db; border-color: #ffd43b; color: #e67700; }
.notification.warning::before { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fcc419'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E"); }

.notification.error { background-color: #fff5f5; border-color: #ff8787; color: #c92a2a; }
.notification.error::before { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fa5252'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E"); }

.notification.success { background-color: #ebfbee; border-color: #69db7c; color: #2b8a3e; }
.notification.success::before { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2340c057'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E"); }

.notification.process { background-color: #f3f0ff; border-color: #b197fc; color: #5f3dc4; }
.notification.process::before { 
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237950f2'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3C/svg%3E");
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>