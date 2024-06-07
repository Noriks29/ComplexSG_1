import { adress  } from "./config_server";

function DisplayLoad(status){
    const element = document.getElementById("loadProcess");
    if(status){
        element.style.display = "flex"
    }
    else{
        element.style.display = "none"
    }
}
async function FetchGet(http){
    try {
        const response = await fetch('http://'+adress+http);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        else{
        return await response.json();
        }
    } catch (error) {
        console.log('Error during fetch:', error);
        alert("Ошибка запроса, дальнейшая работа может быть некорректной!")
        return []
    }

}
async function FetchPost(http,datapost){
    try {
        const response = await fetch('http://'+adress+http,{
          method:  'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datapost)
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        else{
            return await response.json();
        }
        } catch (error) {
            console.log('Error save:', error);
            alert("ОШИБКА ОТПРАВКИ")
            return error;
            
        }

}

export{
    DisplayLoad,
    FetchGet,
    FetchPost
}