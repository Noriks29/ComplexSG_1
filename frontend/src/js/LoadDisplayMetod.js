import { adress, adressDEV  } from "./config_server";

const ShowFetchData = true

function DisplayLoad(status){
    const element = document.getElementById("loadProcess");
    if(status){
        element.style.display = "flex"
    }
    else{
        element.style.display = "none"
    }
}
async function FetchGet(http, AlertError = true, massage=null){
    let AcsessKey = localStorage.data
    let MODE = window.location.search
    let add = adress
    if(MODE == "?DEV")
        add = adressDEV
    try {
        const response = await fetch('http://'+add+http+'?accessKey='+AcsessKey);
        if (!response.ok) {
            let rezult = await response.json()
            if(ShowFetchData) console.log(http,rezult)
            throw new Error(rezult.MESSAGE);
        }
        else{
            let rezult = await response.json()
            if(ShowFetchData) console.log(http, rezult)
            if(massage != null) alert(massage)
            return rezult;
        }
    } catch (error) {
        console.log('Error during fetch:', error);
        if(AlertError) alert("Ошибка запроса, дальнейшая работа может быть некорректной!" + error)
        return undefined
    }

}

async function FetchPost(http,datapost,dopparamhttp, AlertError = true, massage=null){
    if(ShowFetchData) console.log(JSON.stringify(datapost))
    let AcsessKey = localStorage.data
    let MODE = window.location.search
    let add = adress
    if(MODE == "?DEV")
        add = adressDEV
    if(dopparamhttp != undefined){
        AcsessKey = AcsessKey +"&"+dopparamhttp
    }
    try {
        const response = await fetch('http://'+add+http+'?accessKey='+AcsessKey,{
          method:  'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datapost)
        })
        if (!response.ok) {
            let rezult = await response.json()
            if(ShowFetchData) console.log(http,rezult)
            throw new Error(rezult.MESSAGE);
        }
        else{
            let rezult = await response.json()
            if(ShowFetchData) console.log(http, rezult)
            if(massage != null) alert(massage)
            return rezult;
        }
        } catch (error) {
            console.log('Error save:', error);
            if(AlertError) alert("ОШИБКА ОТПРАВКИ  " + error)
            return undefined;
        }
}


async function FetchPostFile(http,formData){
    DisplayLoad(true)
    if(ShowFetchData) console.log(formData)
    let AcsessKey = localStorage.data
    let add = adress
    
    try {
        const response = await fetch('http://'+add+http+'?accessKey='+AcsessKey,{
          method:  'POST',
          mode: 'cors',
          body: formData
        })
        if (!response.ok) {
            let rezult = await response.json()
            if(ShowFetchData) console.log(http,rezult)
            throw new Error(rezult.MESSAGE);
        }
        else{
            let rezult = await response.json()
            if(ShowFetchData) console.log(http, rezult)
            DisplayLoad(false)
            return rezult;
        }
        } catch (error) {
            console.log('Error save:', error);
            alert("ОШИБКА ОТПРАВКИ  " + error)
            DisplayLoad(false)
            return undefined;
        }

}


export{
    DisplayLoad,
    FetchGet,
    FetchPost,
    FetchPostFile
}