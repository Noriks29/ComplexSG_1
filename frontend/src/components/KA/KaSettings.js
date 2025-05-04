import { UnixToDtime } from '@/js/WorkWithDTime';

let KaSettings = {
    data(){
      return{
  
      }
    },
    methods:{
      CreateDateTime(time, onlyTime = false){
            let Dtime = UnixToDtime(time)
            if(onlyTime) return Dtime.time
            return Dtime.date + " " + Dtime.time
      },
      ShowLog(Rezult){
          this.dataTable = []
          this.dataLableName = [{label: "data", nameParam: "data"}]
          Rezult.forEach(element => {
            this.dataTable.push({data: element}) 
          })
          this.PreWrapDefaultTable = false
          this.ShowDefaultTable = true
      },
  
    },
    props:{
      systemStatus:{
        type: Object
      },
      reload:{
        type: Number
      },
      ExperimentStatus:{
        type: Boolean
      }
    },
    watch: {
      reload(newreload, oldreload) {
        console.log(newreload, oldreload)
        this.ReLoadComponent()
      }
    }
  }

export {
    KaSettings
} 