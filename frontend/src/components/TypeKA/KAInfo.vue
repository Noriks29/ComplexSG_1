<template>
    <div class="Panel_flex_column">
        <div class="Column_contain">
            <div>
                <p> Описание </p>
                <div> Фото </div>
                <div> Текстовое описание </div>
            </div>
            <div>
                <p> Целевая аппаратура </p>
                <div>
                    <table>
                        <tr>
                            <th>Название</th><th>Вт</th><th>Коэф-нт</th>
                        </tr>
                        <tr>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div>
                <p> Бортовые устройства </p>
                <div>
                    <table>
                        <tr>
                            <th>Название</th><th>Вт</th><th>Солнце</th><th>Земля</th><th>Цель</th>
                        </tr>
                        <tr>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="Column_contain">
            <div>
                <p> Бортовые устройства с постоянным потреблением энергии </p>
                <div>
                    <table>
                        <tr>
                            <th>Название</th><th>Вт</th><th>Солнце</th><th>Земля</th><th>Цель</th>
                        </tr>
                        <tr>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div>
                <p> Бортовые устройства с переменным потреблением </p>
                <div>
                    <table>
                        <tr>
                            <th>Название</th><th>Вт</th><th>Солнце</th><th>Земля</th><th>Цель</th>
                        </tr>
                        <tr>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div>
                <p> Параметры функционирования </p>
                <div>
                    <table>
                        <tr>
                            <th colspan="3">Параметры разворота</th>
                        </tr>
                        <tr>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                        </tr>
                        <tr>
                            <th colspan="3">Скорость передачи данных</th>
                        </tr>
                        <tr>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>

export default {
    name: 'KAInfo'
  }
</script>

<style lang="scss" scoped>

.Panel_flex_column{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    flex-direction: row;

    .Column_contain{

    }
}

</style>
  
