<template>
    <div class="DataTable">
      <div class="PanelDefault">
        <div class="closebutton"><button @click="CloseTable">
          <img src="../../assets/close.svg"><span>&#8203;</span>
        </button></div>
        

        <div class="flexrow">
          <div class="inputdiv"><input type="text" v-model="OG_Param.inputName"></div>
          <div class="SelectDivInFlex">
            <SelectDiv  
                :dataOption="[{value: true, lable: 'Произвольное построение' },
                  {value: false, lable: 'Плоскостное построение' },
                ]" @valueSelect="SelectChange"/>
          </div>
          <div>
            <button @click="AddRow" class="ButtonDefault">Создать</button> 
          </div>
        </div>
      {{ OG_Param }}
      <div class="Panel">
        <table>
            <tr>
                <td>Количество плоскостей</td><td><input name="countPl" type="number"></td>
            </tr>
        </table>
      </div>

    </div>  
    </div>
</template>
  
  <script>
  
  import SelectDiv from '../SelectDiv.vue';

  
    export default {
      name: 'CreateOGPanel',
      props: {
        dataLableName:{
          type: Object
        },
      },
      components:{
        SelectDiv
      },

      data() {
        return {
            OG_Param:{
                inputName: '',
                type: undefined
            }
        }
      },
      methods:
        {
          CloseTable(){
            this.$emit('closetable', true)
          },
          SelectChange(data){
            console.log(data)
            this.OG_Param.type = data.value
          }
          
      },
      mounted() {
      }
    }
  </script>
  
  
  <style lang="scss" scoped>
  .closebutton{
    display: flex;
    margin: 20px;
    flex-direction: row-reverse;
    button{
      background: none;
      border: none;
      img{
        width: 25px;
      }
    }
  }
  .DataTable{
    backdrop-filter: blur(10px);
    position: fixed;
    top: 1%;
    left: 0;
    width: 100%;
    z-index: 4;
    max-width: 100%;
    height: 99%;
  }
  .PanelDefault{
    width: 95%;
    padding: 5px;
    height: 90%
  }

  .flexrow{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    div{
      margin: 0px 25px;
      position: relative;

      &.inputdiv{
        flex: 1;
        background-color: rgba(151, 151, 151, 0.15);
        border: 2px solid rgba(0, 0, 0, 0.25);
        padding: 5px;
      }
      &.SelectDivInFlex{
        flex: 1;
      }

      input{
        height: 35px;
        width: 99%;
        background: none;
        border: none;
        color: white;
        font-size: 20px;
      }

      .ButtonDefault{
        height: 40px;
        width: 150px;
      }
    }

  }
  </style>