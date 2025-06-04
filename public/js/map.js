
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',
  center: lis.geometry.coordinates, // Change as needed
  zoom: 11,
  style: 'mapbox://styles/mapbox/streets-v11'
});

// console.log(coordinates)
// Optional: Add a marker
new mapboxgl.Marker({ color: "red", rotation: -90 })
  .setLngLat(lis.geometry.coordinates) //[long, lat]
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${lis.title} , ${lis.location}</p>
        <p>Exact Location Provided after booking</h5>`

    )
  )
  .addTo(map);
