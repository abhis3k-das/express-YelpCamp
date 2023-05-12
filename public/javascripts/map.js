
mapboxgl.accessToken = mapToken
console.log(camp.geometry)
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

const marker1 = new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<div style="min-width:180px"> <h3>${camp.title}</h3><p>${camp.location}</p></div>`))
    .addTo(map);


