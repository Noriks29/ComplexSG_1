<template>
  <div class="DataTable">
      <div class="closebutton"><button @click="CloseTable">
        <img src="../assets/close.svg"><span>&#8203;</span>
      </button>
      <button @click="LoadXLSX" class="LoadExel">
        <img src="../assets/excel.png"><span>&#8203;</span>
      </button>
      </div>

      <div class="scroll-table">
        <table class="TableDefault">
      <thead>
        <tr>
          <th 
            v-for="(data, index) in data"
            :key="index"
            :name="data.nameParam"
            >{{ data.lable }}</th>

        </tr>
        </thead>
      </table>
      <div class="scroll-table-body">
      <table class="TableDefault">
        <tbody>
        <tr
          v-for="(data, index) in dataTable"
          :key="index"
        >

          <td
            v-for="(dataLable, index) in dataLableName"
            :key="index"
            :class="(prevrap) ? 'prevrap': ''"
          >{{ data[dataLable.nameParam] }}</td>
        </tr>
      </tbody>
      </table>
    </div>
    </div>
    
  </div>
</template>

<script>

//import jsons from '../../res/testOGFree.json'
//import * as XLSX from 'xlsx/xlsx.mjs';
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

    &.LoadExel{
      margin-right: 45px;
    }
  }
  
}
.DataTable{
  -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0%;
    left: 0;
    width: 100%;
    z-index: 10;
    max-width: 100%;
    height: 100%;
  .TableDefault{
    filter: drop-shadow(2px 4px 6px black);

  }
  .PanelTable{
    position: sticky;
    bottom: 20px;
    margin: 0px 5%;
    width: 90%;
  }
}
.PanelDefault{
  width: 95%;
  padding: 5px;

}
.scroll-table-body {
	height: 75vh;

}
.smallTh{
  width: 50px;
}
.scroll-table{
  margin: 0% 2%;
    background-color: rgba(151, 151, 151, 0.15);
    box-shadow: -4px 3px 1px rgba(63, 60, 60, 0.35);
    border: 2px solid rgba(0, 0, 0, 0.25);
}
tr{
  background-color: rgba(0, 0, 0, 0.755);
}
.prevrap{
  white-space: pre-wrap;
}
</style>