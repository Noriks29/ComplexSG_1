<template>
  <div class="DataTable">
      <div class="closebutton"><button @click="CloseTable">
        <img src="../assets/close.svg"><span>&#8203;</span>
      </button>
      <button @click="LoadXLSX" class="LoadExel">
        <img src="../assets/excel.png"><span>&#8203;</span>
      </button>
      </div>

      <div class="DataBody">
        <div class="TableDiv" style="max-height: 85vh;">
          <table class="TableDefault">
          <thead>
            <tr><th 
                v-for="(data, index) in dataLableName"
                :key="index"
                :name="data.nameParam"
                >{{ data.lable }}</th></tr>
          </thead>
          <tbody>
                  <tr
                v-for="(data, index) in dataTable"
                :key="index"
                
              >
                <td
                  v-for="(dataLable, index) in dataLableName"
                  :key="index"
                  :class="(prevrap) ? 'prevrap': ''"
                  :style="dataLable.style"
                >{{ data[dataLable.nameParam] }}</td>
              </tr>
            </tbody>
          </table>
        </div>  
      </div> 
  </div>
</template>

<script>

import XLSX from 'xlsx-js-style';
  export default {
    name: 'TableData',
    props: {
      dataLableName:{
        type: Array
      },
      dataTable:{
        type: Array
      },
      prevrap:{
        type: Boolean
      }
    },

    data() {
      return {
        data: {}
      }
    },
    methods:
      {
        CloseTable(){
          this.$emit('closetable', true)
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
      this.data = this.dataLableName
      console.log(this.dataLableName, this.dataTable)
    }
  }
</script>


<style lang="scss" scoped>

.prevrap{
  white-space: pre-wrap;
}

</style>