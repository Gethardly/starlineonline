function waitForYmaps(callback) {
    if (window.ymaps) {
        callback();
    } else {
        setTimeout(() => waitForYmaps(callback), 500);
    }
}

waitForYmaps(() => {

    window.ymaps.ready(() => {
        window.addEventListener("message", (event) => {
            if (!event.origin.startsWith("chrome-extension://") ||
                !event.origin === "http://localhost:5173" ||
                !event.origin === "https://starline-online.ru") return;

            if (event.data.type === "POSITIONS") {
                event.data.positions.forEach(position => {
                    const yapos = new ymaps.Placemark(
                        [position.x, position.y],
                        {
                            balloonContent: `
                                <h4><b>Название:</b> ${position.name}</h4><br>
                                <b>Адрес:</b> ${position.address}<br>
                                <b>Контакты</b> ${position.contacts}<br>
                                <b>ID позиции:</b> ${position.id}<br>
                                <b>Номер позиции:</b> ${position.positionNumber}
                            `,
                            hintContent: position.name,
                            iconContent: position.positionNumber,
                        },
                        {preset: 'islands#redDotIcon'}
                    );

                    if (window.map) {
                        window.map.geoObjects.add(yapos)
                    }
                })

                event.source.postMessage({
                    type: "POSITIONS_CONFIRMED",
                    key: "positions"
                }, event.origin);
            }
        });

        /*const myPlacemark = new ymaps.Placemark(
            [42.861294, 74.607222],
            {balloonContent: 'Моя точка', hintContent: 'Наведи на точку'},
            {preset: 'islands#redDotIcon'}
        );

        if (window.map) {
            window.map.geoObjects.add(myPlacemark);
            //window.map.setCenter([42.861294, 74.607222], 14);
        }*/
    });
});
