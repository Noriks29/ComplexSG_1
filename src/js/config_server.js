
//let adress = "82.179.36.248:8081" 
let adress = undefined
const GetAddres = async () => {
    if(adress != undefined) return adress
    try {
        const response = await fetch('/config.json');
        let config = await response.json();
        adress = config.addres
        return adress;
    } catch (error) {
        console.error('Ошибка загрузки конфига:', error);
        return {
            apiUrl: '82.179.36.248:8081'
        };
    }
}
export {
    GetAddres
}
