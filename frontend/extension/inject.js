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

            if (event.data.type === "POSITIONS") {
                console.log(event.data.positions);
                event.data.positions.forEach(position => {
                    const yapos = new ymaps.Placemark(
                        [position.x, position.y],
                        {balloonContent: position.name, hintContent: position.address },
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

        const myPlacemark = new ymaps.Placemark(
            [42.861294, 74.607222],
            {balloonContent: 'Моя точка', hintContent: 'Наведи на точку'},
            {preset: 'islands#redDotIcon'}
        );

        if (window.map) {
            window.map.geoObjects.add(myPlacemark);
            //window.map.setCenter([42.861294, 74.607222], 14);
        }
    });
});
