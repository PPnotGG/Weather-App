function createWidget() {
    let latInput =  Number(document.querySelector('.geocoordinates__input-lat').value);
    let lonInput =  Number(document.querySelector('.geocoordinates__input-lon').value);
    if (!checkForMistakes(latInput, lonInput)) {
        return;
    }
    let widgets = document.querySelector('.widgets');
    let invisible = document.querySelector('.invisible');
    invisible.remove();
    let widget = document.createElement('div');
    createElem(widget, 'widget', widgets);
    createLayout(widget, latInput, lonInput);
    widget.querySelector('.lat').textContent = `Широта: ${latInput}`;
    widget.querySelector('.lon').textContent = `Долгота: ${lonInput}`; 
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latInput}&longitude=${lonInput}&current_weather=true`)
        .then(function(resp) { return resp.json() })
        .then(function(data) {
            widget.querySelector('.temperature').innerHTML = `Температура: ${data.current_weather.temperature}` + '&deg';
            widget.querySelector('.wind-speed').textContent = `Скорость ветра: ${data.current_weather.windspeed}` + ' ' + 'км/ч';
            let weather = Number(data.current_weather.weathercode);
            let weatherIcon = chooseIcon(weather);
            widget.querySelector('.widget_right').innerHTML = `<img class="icon" src="${weatherIcon}">`;
        })
    widgets.append(invisible);
}

function createLayout(widget, latInput, lonInput) {
    let map = document.createElement('div');
    map.classList.add('widget__map');
    widget.append(map);
    getMap(map, latInput, lonInput);
    createInfoBlock(widget);
}

function createInfoBlock(widget) {
    let infoBlock = document.createElement('div');
    createElem (infoBlock, 'widget__info', widget);
    let leftEl = document.createElement('div');
    createElem (leftEl, 'widget_left', infoBlock);
    let coordinates = document.createElement('div');
    createElem (coordinates, 'coordinates', leftEl);
    let lat = document.createElement('span');
    createElem (lat, 'lat', coordinates);
    let lon = document.createElement('span');
    createElem (lon, 'lon', coordinates);
    let temperature = document.createElement('span');
    createElem (temperature, 'temperature', leftEl);
    let windSpeed = document.createElement('span');
    createElem (windSpeed, 'wind-speed', leftEl);
    let widgetRight = document.createElement('div');
    createElem (widgetRight, 'widget_right', infoBlock);
}

function createElem (elem, name, parent) {
    elem.classList.add(name);
    parent.append(elem);
}

function getMap (map, latInput, lonInput) {
    // Почему-то яндекс.карта не отображается при широте выше 85 и ниже -85
    let myMap = new ymaps.Map(map, {
        center: [latInput, lonInput],
        zoom: 7
    });
    let myPlaceMark = new ymaps.Placemark([latInput, lonInput]);
    myMap.geoObjects.add(myPlaceMark);
}

function chooseIcon(weather) {
    if (weather === 0) {
        return "./icons/sunny.png"
    }
    else if (weather <= 3) {
        return "./icons/cloudy.png"
    }
    else if (weather <= 48) {
        return "./icons/fog.png"
    }
    else if (weather <= 57) {
        return "./icons/rainy-day.png"
    }
    else if (weather <= 67 || weather <= 82 && weather >= 80) {
        return "./icons/rainy.png"
    }
    else if (weather <= 77 || weather <= 86 && weather >= 85) {
        return "./icons/snowfall.png"
    }
    return "./icons/thunderstorm.png"
}

function deleteWidget() {
    let widgets = document.querySelector('.widgets');
    let widget = widgets.querySelectorAll('.widget').item(widgets.querySelectorAll('.widget').length - 1);
    if (widget !== null){
        widget.remove();
    }
}

function checkForMistakes(lat, lon) {
    return (lat >= -90 && lat <= 90 && lon >= -180 && lon < 180);
}