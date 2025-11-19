function waitForYmaps(callback) {
    if (window.ymaps) {
        callback();
    } else {
        setTimeout(() => waitForYmaps(callback), 500);
    }
}

waitForYmaps(() => {
    window.ymaps.ready(() => {
        const myPlacemark = new ymaps.Placemark(
            [42.861294, 74.607222],
            { balloonContent: 'Моя точка', hintContent: 'Наведи на точку' },
            { preset: 'islands#redDotIcon' }
        );

        if (window.map) {
            window.map.geoObjects.add(myPlacemark);
            //window.map.setCenter([42.861294, 74.607222], 14);
        }
    });
});
