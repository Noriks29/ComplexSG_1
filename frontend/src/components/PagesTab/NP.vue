<template>
    <div class="main_contain RowSection">
          <div>
            <button class="ToMenuButtonDiv" @click="SelectComponent('TemplateComponent')">
              <img src="../../assets/exit.svg">
            </button>
            <h1 class="TitleText">Список наземных пунктов</h1>
          </div>
    <div class="ContentDiv">
      <div class="Panel LeftPanel">
        <div class="ButtonApprovedDiv" v-if="!modellingStatus">
          <button @click="ChangeApproved(!approved)" class="ButtonCommand" :class="approved? 'green' : 'red'">
          <span v-if="approved"><img src="../../assets/edit.svg"></span>
          <span v-else><img src="../../assets/approve.svg"></span>
          <span>{{ approved ?  'Редактировать' : 'Утвердить'}}</span>
        </button>
      </div>
      </div>
    <div class="Panel RightPanel">
      <div class="TableDiv" style="max-height: 75%;">
      <table class="TableDefault">
        <thead>
          <tr>
            <th></th>
            <th>Название</th>
            <th>Широта</th>
            <th>Долгота</th>
            <th v-if="!approved && !modellingStatus" class="delete"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(data, index) in dataJson"
            :key="index"
            :class="approved || modellingStatus ? 'disable' :''"
            @change="ChangeParam(index)"
          >
            <td>{{ index+1 }}</td>
            <td><input v-model="data.nameEarthPoint"></td>
            <td><input type="number"  v-model="data.latitude"></td>
            <td><input type="number"  v-model="data.longitude" ></td>
            <td v-if="!approved && !modellingStatus" @click="DeleteRow(index)" class="delete"><img class="iconDelete" src="../../assets/delete.svg" alt="Удалить"></td>
          </tr>
        </tbody>
        <tfoot>
          <tr v-if="!approved && !modellingStatus" class="addRowButton">
            <td colspan="5"><button @click="AddRow">
              <img src="../../assets/add.png" alt="" class="addButtonIcon">
              Добавить наземный пункт
            </button></td>
          </tr> 
        </tfoot>
      </table>
    </div>
    <div class="LoadExel"><button @click="LoadXLSX" class="ButtonCommand"><img src="../../assets/excel.png"><span>&#8203;</span></button></div>
   </div> 
  </div>
  </div>
</template>
  
<script>
import {DisplayLoad} from '../../js/LoadDisplayMetod.js'
import { NPList, ChangeNP, SystemObject, ChangeSystemObject} from '@/js/GlobalData.js'; 
import { PagesSettings } from './PagesSettings.js';
import XLSX from 'xlsx-js-style';
  export default {
    name: 'NP',
    mixins: [PagesSettings],
    data(){
      return{
        dataJson: [], // локальное хранилище нп
        approved: true,
      }
    },
    methods: {
        async AddRow(){
          this.dataJson.push({'nameEarthPoint' : "", 'longitude' : 0, 'latitude' : 0, 'deleted': false});   
          this.dataJson = await ChangeNP(this.dataJson)
        },
        async ChangeParam(id){
          this.dataJson[id]
          let longitudecorrect = Number(this.dataJson[id].latitude)
            if(longitudecorrect < -90) longitudecorrect = -90
            if(longitudecorrect > 90) longitudecorrect = 90
            this.dataJson[id].latitude = longitudecorrect

          let latitudecorrect = Number(this.dataJson[id].longitude)
              if(latitudecorrect < -180) latitudecorrect = -180
              if(latitudecorrect > 180) latitudecorrect = 180
              this.dataJson[id].longitude = latitudecorrect

          await ChangeNP(this.dataJson, false)
        },
        async DeleteRow(index){
            this.dataJson[index].deleted = true
            this.dataJson = await ChangeNP(this.dataJson)
        },
        async ChangeApproved(status){
          await ChangeSystemObject('earthStatus', status)
          this.approved = status
        },
        LoadXLSX(){
          const workbook = XLSX.utils.book_new();
          let data = [["Название","Широта","Долгота"]]
            this.dataJson.forEach(element => {
              data.push([element.nameEarthPoint,element.latitude,element.longitude])
            });
          console.log(data)
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
          XLSX.writeFile(workbook, 'NP.xlsx');
        },
    },
    async mounted() {
      DisplayLoad(true)
      this.dataJson = await NPList
      this.approved = SystemObject.earthStatus
      DisplayLoad(false)
    }
  }
  </script>
<style lang="scss" scoped>
.LoadExel{
  display: flex;
  img{
    width: 30px;
  }
}

</style>
