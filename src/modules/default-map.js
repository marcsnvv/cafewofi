export default function initDefaultMap() {
    // The location of Uluru
    const position = { lat: -25.344, lng: 131.031 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: position,
        mapId: "1b49c35fdb4ecd80", // Map ID is required for advanced markers.
    })

    // The advanced marker, positioned at Uluru
    const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: position,
        title: 'Uluru',
    })
}