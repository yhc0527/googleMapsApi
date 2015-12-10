// reference by (https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete)
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 13
    });

    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);

        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);

    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', function() {
            autocomplete.setTypes(types);
        });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);
};


function getCurrentPosition() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(movePosition, function(error) {
            alert("브라우저의 위치추적을 허용하지 않으셨습니다. 기본좌표로 이동합니다.");
            var position = {};
            position.coords = {};
            position.coords.latitude = '37.5175';
            position.coords.longitude = '127.0995';
            movePosition(position);
        });
        /*
         navigator object는 HTML5의 spec에 포함된 내용이다.
         여기서 displayLocation 은 callback function 명을 지정해 주는 것이다.
         */
    }else{
        alert("Oops, no geolocation suppport");
    }
};

function movePosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    alert("latitude " + latitude + ", longitude" + longitude);

    var googleLatAndLong = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
        center: googleLatAndLong,
        zoom: 13
    }

    map.setOptions(mapOptions);
    addMarker(googleLatAndLong);
}

function addMarker(latlong) {
    var markerOptions = {
        position: latlong,
        map: map,
        title: "Your loaction",
        clickable: true
    };

    var marker = new google.maps.Marker(markerOptions);
    marker.setVisible(true);

    var infoWindowOptions = {
        content: "Your loaction content",
        position: latlong
    };

    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    google.maps.event.addListener(marker, "click", function(){
        infoWindow.open(map);
    });
}