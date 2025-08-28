
//let adress = "82.179.36.248:8081" 
const GetAddres = async () => {
    try {
        const response = await fetch('/config.json');
        let config = await response.json();
        return config.addres;
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
