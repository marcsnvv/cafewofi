"use client"

export function initMap(map, coffees) {
    console.log(coffees)
    const styledMapType = new google.maps.StyledMapType(
        [
            { elementType: "geometry", stylers: [{ color: "#E8E8E8" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#ACACAC" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#FFFFFF" }] },
            {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [{ color: "#cc7843" }],
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "geometry.stroke",
                stylers: [{ color: "#cc7843" }],
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                stylers: [{ color: "#ae9e90" }],
            },
            {
                featureType: "landscape.natural",
                elementType: "geometry",
                stylers: [{ color: "#DFCFC5" }],
            },
            {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#E8CBB9" }],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#93817c" }],
            },
            {
                featureType: "poi.park",
                elementType: "geometry.fill",
                stylers: [{ color: "#E8CBB9" }],
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#447530" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#FFFFFF" }],
            },
            {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [{ color: "#fdfcf8" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#f8c967" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#e9bc62" }],
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry",
                stylers: [{ color: "#e98d58" }],
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry.stroke",
                stylers: [{ color: "#db8555" }],
            },
            {
                featureType: "road.local",
                elementType: "labels.text.fill",
                stylers: [{ color: "#806b63" }],
            },
            {
                featureType: "transit.line",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }],
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.fill",
                stylers: [{ color: "#8f7d77" }],
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#ebe3cd" }],
            },
            {
                featureType: "transit.station",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }],
            },
            {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{ color: "#b9d3c2" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#92998d" }],
            },
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
        ],
        { name: "Styled Map" },
    )
    //Associate the styled map with the MapTypeId and set it to display.

    const iconCircle = {
        path: `
          M14.9179 0
          A14.9179 14.2504 0 0 0 14.9179 28.5008
          A14.9179 14.2504 0 0 0 14.9179 0
          Z
          M14.9726 8.7501
          A4.97262 4.75014 0 0 1 14.9726 18.7501
          A4.97262 4.75014 0 0 1 14.9726 8.7501
          Z
        `,
        fillColor: "#CC7843", // Color de relleno del ícono
        fillOpacity: 1, // Opacidad del relleno (valor entre 0 y 1)
        scale: 1, // Escala del ícono
        anchor: new google.maps.Point(15, 29), // Punto de anclaje del ícono
    };


    const iconBack = {
        path: `
          M0,0
          L110.31,0
          L110.31,49.8765
          L0,49.8765
          Z
        `,
        fillColor: "#CC7843", // Color de relleno del ícono
        fillOpacity: 1, // Opacidad del relleno (valor entre 0 y 1)
        scale: 1, // Escala del ícono
        anchor: new google.maps.Point(55, 49.8765), // Punto de anclaje del ícono
    }

    const iconRectangle = {
        path: `
          M10.5583 18.0097
          C10.7512 18.3406 11.2293 18.3406 11.4222 18.0097
          L20.9359 1.6895
          C21.1302 1.35617 20.8898 0.937696 20.5039 0.937696
          H1.47661
          C1.09078 0.937696 0.850338 1.35618 1.04465 1.6895
          L10.5583 18.0097
          Z
        `,
        fillColor: "#CC7843", // Color de relleno del ícono
        fillOpacity: 1, // Opacidad del relleno (valor entre 0 y 1)
        scale: 1, // Escala del ícono
        anchor: new google.maps.Point(10.5583, 18.0097), // Punto de anclaje del ícono
    };

    var icon = new google.maps.Polygon({
        path: [{}]
    })




    coffees.map((coffee, index) => {
        new google.maps.Marker({
            position: { lat: coffee.lng, lng: coffee.lat },
            map: map,
            icon: [
                {
                    icon: iconBack,
                    offset: '0%'
                }, {
                    icon: iconRectangle,
                    offset: '50%'
                }, {
                    icon: iconCircle,
                    offset: '100%'
                }
            ],
            title: coffee.name,
        });
    })

    map.mapTypes.set("styled", styledMapType);
    map.setMapTypeId("styled");
}