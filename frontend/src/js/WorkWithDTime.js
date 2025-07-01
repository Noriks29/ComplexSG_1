function DTimeToUnix(time) {
    return Math.floor(Date.parse(time)/1000)
}

function UnixToDtime(time,duration=false){
    let timeToUnix = time
    let miliseconds = ''
    try {
      miliseconds = String(timeToUnix % 1).split(".")[1]
      if(miliseconds != undefined) miliseconds = '.'+miliseconds.substr(0, 3)
      else miliseconds = ''
    } catch {miliseconds = ''}
    if(duration) timeToUnix = timeToUnix - 3600*3
    const timeL = new Date(timeToUnix * 1000)
    let time1 = ((timeL.getHours() < 10)?"0":"") + timeL.getHours() +":"+ ((timeL.getMinutes() < 10)?"0":"") + timeL.getMinutes() +":"+ ((timeL.getSeconds() < 10)?"0":"") + timeL.getSeconds()+miliseconds;
    let time2 = timeL.getFullYear() + "-" + (((timeL.getMonth()+1) < 10)?"0":"") + (timeL.getMonth()+1) +"-"+((timeL.getDate() < 10)?"0":"") + timeL.getDate();
    return {time: time1, date: time2}
}
function CreateDateTime(time, mode = 0){
    if(mode == 2){
      let Dtime = UnixToDtime(time, true)
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