function waitForYmaps(callback) {
    if (window.ymaps) {
        callback();
    } else {
        setTimeout(() => waitForYmaps(callback), 500);
    }
}

waitForYmaps(() => {
    window.ymaps.ready(() => {
        console.log('Модуль скрытия изображений запущен');

        const style = document.createElement('style');
        style.id = 'hide-ymaps-images-style';
        style.textContent = `
            .ymaps-image-with-content[style*="/dist/images/"]:not([style*="width: 16px"]),
            .ymaps-default-cluster[style*="/dist/images/"]:not([style*="width: 16px"]) {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
        `;

        if (document.head) {
            document.head.appendChild(style);
        }

        function hideYmapsImages() {
            const elements = [
                ...document.querySelectorAll('.ymaps-image-with-content[style*="/dist/images/"]:not([style*="width: 16px"])'),
                ...document.querySelectorAll('.ymaps-default-cluster[style*="/dist/images/"]:not([style*="width: 16px"])')
            ];

            elements.forEach(element => {
                const styleAttr = element.getAttribute('style');

               // width element from inline style const iconWidth = parseInt(element.style.cssText.split(';')[3].replace(/\D+/g, ""));

                if (styleAttr && styleAttr.includes('/dist/images/')) {
                    element.style.setProperty('display', 'none', 'important');
                    element.style.setProperty('opacity', '0', 'important');
                    element.style.setProperty('visibility', 'hidden', 'important');
                }
            });
        }

        // Первоначальное скрытие пшек
        hideYmapsImages();

        if (window.map) {
            window.map.geoObjects.events.add('add', () => {
                setTimeout(hideYmapsImages, 50);
            });

            window.map.events.add('boundschange', () => {
                setTimeout(hideYmapsImages, 50);
            });

            // Событие окончания действия (actionend)
            window.map.events.add('actionend', () => {
                setTimeout(hideYmapsImages, 50);
            });

            console.log('✓ Подписка на события карты установлена');
        }

        console.log('✓ Модуль скрытия изображений инициализирован');

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

        let isRestoring = false;

        function restoreAllPlacemarks() {
            if (!window.map || window.myPlacemarksData.length === 0) return;

            console.log('Восстанавливаем метки:', window.myPlacemarksData.length);

            isRestoring = true;

            // Удаляем старые метки с карты
            window.myPlacemarkObjects.forEach(placemark => {
                window.map.geoObjects.remove(placemark);
            });

            // Очищаем старые объекты
            window.myPlacemarkObjects = [];

            // Создаем и добавляем метки заново
            window.myPlacemarksData.forEach(data => {
                const placemark = createPlacemark(data);
                window.myPlacemarkObjects.push(placemark);
                window.map.geoObjects.add(placemark);
            });

            isRestoring = false;
        }

        if (window.map) {
            // Следим за событиями удаления
            window.map.geoObjects.events.add('remove', (e) => {
                if (isRestoring) return;

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