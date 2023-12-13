mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    zoom: 10,
    center: campground.geometry.coordinates
});

const marker = new mapboxgl.Marker({color: 'orange'})
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${campground.title}</h4> <p>${campground.location}</p>`)
    )
    .addTo(map);