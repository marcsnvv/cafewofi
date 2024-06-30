"use client"

import React, { useEffect, useCallback } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '400px',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const position = { lat: -25.344, lng: 131.031 };

function Maps({ data, cafes }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        libraries: ['marker'] // Asegúrate de incluir la librería 'marker'
    });

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        // Set map bounds to include the center position
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map);

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
            fillColor: "#CC7843",
            fillOpacity: 1,
            scale: 1,
            anchor: new window.google.maps.Point(15, 29),
        };

        const iconBack = {
            path: `
            M0,0
            L110.31,0
            L110.31,49.8765
            L0,49.8765
          `,
            fillColor: "#CC7843",
            fillOpacity: 1,
            scale: 1,
            anchor: new window.google.maps.Point(55, 49.8765),
        };

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
            fillColor: "#CC7843",
            fillOpacity: 1,
            scale: 1,
            anchor: new window.google.maps.Point(10.5583, 18.0097),
        };

        // Verifica si AdvancedMarkerElement está disponible
        if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
            // Add the advanced marker for Uluru
            new window.google.maps.marker.AdvancedMarkerElement({
                map,
                position: position,
                title: 'Uluru',
            });

            // Add advanced markers for coffee locations
            cafes.map((coffee, index) => {
                new window.google.maps.marker.AdvancedMarkerElement({
                    position: { lat: coffee.lng, lng: coffee.lat },
                    map: map,
                    content: createMarkerIcon(iconBack, iconRectangle, iconCircle),
                    title: coffee.name,
                });
            });
        } else {
            console.error('AdvancedMarkerElement is not available.');
        }
    }, [cafes]);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
            mapId="1b49c35fdb4ecd80" // Map ID is required for advanced markers.
        >
            { /* Child components, such as markers, info windows, etc. */}
            <></>
        </GoogleMap>
    ) : <></>
}

function createMarkerIcon(iconBack, iconRectangle, iconCircle) {
    const markerDiv = document.createElement('div');
    markerDiv.style.position = 'relative';

    const iconBackDiv = document.createElement('div');
    iconBackDiv.innerHTML = createSVG(iconBack);
    iconBackDiv.style.position = 'absolute';
    iconBackDiv.style.left = '0';
    iconBackDiv.style.top = '0';

    const iconRectangleDiv = document.createElement('div');
    iconRectangleDiv.innerHTML = createSVG(iconRectangle);
    iconRectangleDiv.style.position = 'absolute';
    iconRectangleDiv.style.left = '50%';
    iconRectangleDiv.style.top = '50%';

    const iconCircleDiv = document.createElement('div');
    iconCircleDiv.innerHTML = createSVG(iconCircle);
    iconCircleDiv.style.position = 'absolute';
    iconCircleDiv.style.left = '100%';
    iconCircleDiv.style.top = '100%';

    markerDiv.appendChild(iconBackDiv);
    markerDiv.appendChild(iconRectangleDiv);
    markerDiv.appendChild(iconCircleDiv);

    return markerDiv;
}

function createSVG(icon) {
    return `
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <path d="${icon.path}" fill="${icon.fillColor}" fill-opacity="${icon.fillOpacity}" transform="scale(${icon.scale})"/>
    </svg>
  `;
}

export default React.memo(Maps);
