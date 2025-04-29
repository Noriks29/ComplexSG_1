function DTimeToUnix(time) {
    //console.log(time)
    return Math.floor(Date.parse(time)/1000)
}

function UnixToDtime(time){
    const timeL = new Date(time * 1000)
    let time1 = ((timeL.getHours() < 10)?"0":"") + timeL.getHours() +":"+ ((timeL.getMinutes() < 10)?"0":"") + timeL.getMinutes() +":"+ ((timeL.getSeconds() < 10)?"0":"") + timeL.getSeconds();
    let time2 = timeL.getFullYear() + "-" + (((timeL.getMonth()+1) < 10)?"0":"") + (timeL.getMonth()+1) +"-"+((timeL.getDate() < 10)?"0":"") + timeL.getDate();
    return {time: time1, date: time2}
}
function CreateDateTime(time, mode = 0){
    if(mode == 2){
      let Dtime = UnixToDtime(time-10800)
      return Dtime.date + " " + Dtime.time
    }
    let Dtime = UnixToDtime(time) 
    return Dtime.date + " " + Dtime.time
  }

export {
    DTimeToUnix,
    UnixToDtime,
    CreateDateTime
}