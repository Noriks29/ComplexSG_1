<template>
  <div>

      <div class="DataBody">
        <div class="TableDiv" style="max-height: 85vh;">
          <table>
            <thead>
              <tr>
                <th v-if="settings.showIndex"></th>
                <th v-for="data, index in dataTable.label" :key="index">
                  {{ data.name }}
                </th>
                <th v-if="settings.deleteMode"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data, index in dataTable.data" :key="index">
                <td v-if="settings.showIndex">{{ index+1 }}</td>
                <td v-for="dataLabel, label in dataTable.label" :key="label" >
                  <SelectDiv v-if="dataLabel.tag.name == 'SelectDiv'" :dataOption="dataLabel.tag.dataOption" :valueS="{lable: data[dataLabel.param][dataLabel.tag.valueS]}" :id="String(index)" @valueSelect="SelectChange($event, dataLabel.param)"/>
                  <component v-else :is="dataLabel.tag.name" :type="dataLabel.tag.type" :value="data[dataLabel.param]" :readonly="!settings.editAccess" placeholder="Введите значение"
                    @change="ChangeParam({value: $event.target.value, id: index, param: dataLabel.param})">{{ data[dataLabel.param] }}
                  </component>
                </td>
                <td v-if="settings.deleteMode" @click="DeletedRow(index)" class="delete"><img class="iconDelete" :class="settings.editAccess? '':'hide'" src="@/assets/delete.svg" alt="Удалить"></td>
              </tr>
            </tbody>
            <tfoot v-if="settings.deleteMode && settings.editAccess">
              <tr><td :colspan="dataTable.label.length+1+Number(settings.showIndex || 0)" class="addRowButton">
              <button @click="AddRow">
                <img src="@/assets/add.png" alt="" class="addButtonIcon">
                <span>Добавить</span>
              </button>
              </td></tr>
            </tfoot>
          </table>
        </div>  
      </div> 
</div>
</template>

<script>
import SelectDiv from '@/components/SelectDiv.vue';
import XLSX from 'xlsx-js-style';
  export default {
    name: 'TableData2',
    props: {
      dataTable:{
        type: Object
      },
      settings:{
        type: Object,
        default: function() {
          return { 
            closed: false,
            showIndex: false,
            deleteMode: false,
            editAccess: false
           }
        }
      }
    },
    components:
    {
      SelectDiv,
    },

    data() {
      return {
        data: {},
      }
    },
    methods:
      {
        CloseTable(){
          this.$emit('closetable', true)
        },
        ChangeParam(data){
          this.$emit('changeT', data)
        },
        AddRow(){
          this.$emit('addRow', null)
        },
        DeletedRow(index){
          this.$emit('DeletedRow', index)
        },
        SelectChange(data, param){
          this.$emit('changeT', {data:data,param:param})
        },

        LoadXLSX(){
          const workbook = XLSX.utils.book_new();
          let data = [[]]
          this.dataLableName.forEach(lable => {
            data[0].push(lable.lable)
          })
          this.dataTable.forEach(element => {
            let row = []
            this.dataLableName.forEach(lable => {
              row.push(element[lable.nameParam])
            })
            console.log(element)
            data.push(row)
          });

          let worksheet = XLSX.utils.aoa_to_sheet(data); // Создаем таблицу в файле с данными из массива
          workbook.SheetNames.push('Data'); // Добавляем лист с названием First list

          let style = {
            font: {
              name: 'Calibri',
              sz: 12,
              bold: true,
                  color: {rgb: '000000'} // red font
            },
            border: {
              bottom: { style: 'thin', color: { rgb: '000000' } }
            }}
          let keylist = Object.keys(worksheet)
          for (let keyid = 0; keyid < keylist.length; keyid++) {
            const key = keylist[keyid];
            console.log(worksheet[key].v, keylist, data[0])
            try {
              if (data[0].indexOf(worksheet[key].v) != -1) {
                worksheet[key].s = style
              }
            } catch (error) {
              console.log(error)
            }
          }
          console.log(worksheet)
          workbook.Sheets['Data'] = worksheet;
          XLSX.writeFile(workbook, 'dataTable.xlsx');
        }
        
    },
    mounted() {
      console.log(this.dataTable)
    }
  }
</script>


<style lang="scss" scoped>
tr{
  span{
    width: calc(100% - 10px);
    padding: 5px;
  }
}

</style>