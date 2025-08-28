<template>
  <Toolbar class="mb-4" :style="'width: 100%;padding: 0px;'">
    <template #end>
      <Button icon="pi pi-file-excel" severity="help" @click="LoadXLSX" text label="Exel"/>
    </template>
  </Toolbar>
  <DataTable :value="dataT" scrollable stripedRows :size="'small'" scrollHeight="63vh">
      <Column :field="data.nameParam" :header="data.lable" v-for="data, index in dataLableName" :key="index"/>
  </DataTable>
  <div class="GrafDiv">
    <div id="plotlydiv">
    </div>
  </div>
</template>
  
  <script>
import XLSX from 'xlsx-js-style';

    export default {
      name: 'TableData',
      props: {
        dataTable:{
          type: Array
        },
      },
      data() {
        return {
            dataT: [],
          dataLableName: [{lable:"Начало",nameParam:'timeBegin'},{lable:"Конец",nameParam:'timeEnd'},{lable:"С/Т",nameParam:'lightName'},
            {lable:"Режим",nameParam:'modeName'},{lable:"Цель",nameParam:'orderName'},
            {lable:"Связь с НП",nameParam:'gsContactName'},{lable:"Передача в НП",nameParam:'timeGs'},{lable:"Межспутниковая связь",nameParam:'timeIs'},{lable:"Заряд АКБ",nameParam:'charge100'}
            ]
        }
      },
      methods:
        {
          LoadXLSX(){
            this.$showLoad(true);
            const workbook = XLSX.utils.book_new();
            let data = [[]]
            this.dataLableName.forEach(lable => {
                data[0].push(lable.lable)
            })
            this.dataT.forEach(element => {
                let row = []
                this.dataLableName.forEach(lable => {
                row.push(element[lable.nameParam])
                })
                data.push(row)
            });
            let worksheet = XLSX.utils.aoa_to_sheet(data); // Создаем таблицу в файле с данными из массива
            workbook.SheetNames.push('ShootingPlan'); // Добавляем лист с названием First list
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
            workbook.Sheets['ShootingPlan'] = worksheet;
            XLSX.writeFile(workbook, 'ShootingPlan.xlsx');
            this.$showLoad(false);
          },
          PrevrapData(){
            this.dataT = this.dataT.concat(this.dataTable)
            this.dataT.forEach(element => {
                element.lightName = element.light ? 'Свет':'Тень'
                element.charge100 = Math.floor(element.charge * 100)/100
            })
          },
      },
      mounted() {
        this.PrevrapData()
      }
    }
  </script>
  
  
  <style lang="scss" scoped>

  </style>