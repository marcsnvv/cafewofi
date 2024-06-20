"use client";

import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { useMemo, useEffect, useState } from 'react';

import { initMap } from './styled-map';
import { Planet } from './icons';

const Maps = ({ data, cafes }) => {
    const [type, setType] = useState("styled");
    const libraries = useMemo(() => ['places'], []);
    const mapOptions = useMemo(
        () => ({
            disableDefaultUI: true,
            scrollwheel: false,
            clickableIcons: false,
        }),
        []
    );

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBisiHp1Wp69xVN0SXLEQb4WdzMXxqOnh8",
        libraries: libraries,
    });

    useEffect(() => {
        if (window.google && window.google.maps && window.google.maps.Marker) {
            console.warn("google.maps.Marker is deprecated. Please use google.maps.marker.AdvancedMarkerElement instead.");
        }
    }, []);

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <div className="m-10 mt-24 lg:fixed right-0 rounded-xl hidden lg:block">
            <button
                onClick={() => setType(type === "hybrid" ? "styled" : "hybrid")}
                className='fixed p-3 bg-white rounded-lg m-5 z-40 hover:bg-lightgray shadow-xl'
            >
                <Planet fillColor={type === "hybrid" && true} />
            </button>
            <GoogleMap
                options={mapOptions}
                zoom={18}
                center={data}
                mapTypeId={"styled"}
                mapContainerClassName='lg:w-[45vw] 2xl:w-[55vw] h-[85vh] rounded-xl'
                onLoad={(map) => initMap(map, cafes)}
            />
        </div>
    );
};

export default Maps