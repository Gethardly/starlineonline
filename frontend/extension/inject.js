function waitForYmaps(callback) {
    if (window.ymaps) {
        callback();
    } else {
        setTimeout(() => waitForYmaps(callback), 500);
    }
}

waitForYmaps(() => {
    window.ymaps.ready(() => {
        // Храним данные о наших метках
        window.myPlacemarksData = window.myPlacemarksData || [];
        window.myPlacemarkObjects = window.myPlacemarkObjects || [];

        // Функция создания метки из данных
        function createPlacemark(data) {
            return new ymaps.Placemark(
                [data.x, data.y],
                {
                    balloonContent: `
                        <h4><b>Название:</b> ${data.name}</h4><br>
                        <b>Адрес:</b> ${data.address}<br>
                        <b>Контакты:</b> ${data.contacts}<br>
                        <b>ID позиции:</b> ${data.id}<br>
                        <b>Номер позиции:</b> ${data.positionNumber}
                    `,
                    hintContent: data.name,
                    iconContent: data.positionNumber,
                },
                {preset: 'islands#redDotIcon'}
            );
        }

        // Функция восстановления всех меток
        function restoreAllPlacemarks() {
            if (!window.map || window.myPlacemarksData.length === 0) return;

            console.log('Восстанавливаем метки:', window.myPlacemarksData.length);

            // Очищаем старые объекты
            window.myPlacemarkObjects = [];

            // Создаем и добавляем метки заново
            window.myPlacemarksData.forEach(data => {
                const placemark = createPlacemark(data);
                window.myPlacemarkObjects.push(placemark);
                window.map.geoObjects.add(placemark);
            });
        }

        // Следим за картой
        if (window.map) {
            // Следим за событиями удаления
            window.map.geoObjects.events.add('remove', (e) => {
                const removed = e.get('child');

                // Если удалена одна из наших меток - восстанавливаем все
                if (window.myPlacemarkObjects.includes(removed)) {
                    console.log('Метка удалена, восстанавливаем...');
                    setTimeout(restoreAllPlacemarks, 100);
                }
            });
        }

        window.addEventListener("message", (event) => {
            const allowedOrigins = [
                "https://starline-online.ru",
                "http://localhost:5173"
            ];

            const isAllowed =
                allowedOrigins.includes(event.origin) ||
                event.origin.startsWith("chrome-extension://");

            if (!isAllowed) return;

            if (event.data.action === "SET_POINTS") {
                console.log('Получено точек:', event.data.positions.length);

                // Сохраняем данные
                window.myPlacemarksData = event.data.positions;

                // Создаем метки
                restoreAllPlacemarks();

                event.source.postMessage({
                    type: "POSITIONS_CONFIRMED",
                    key: "positions"
                }, event.origin);
            }
        });

        // Восстанавливаем метки при инициализации (если данные уже есть)
        if (window.myPlacemarksData.length > 0) {
            restoreAllPlacemarks();
        }
    });
});