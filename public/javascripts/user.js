$(document).ready( function() { 
	// mapSetup();
});

function mapSetup() {
	mapboxgl.accessToken = 'pk.eyJ1IjoiZGFubnlmYWJyaWNhbnQiLCJhIjoiY2l1ZWpzZTlyMDBjdTJvbnc1emxrZmh3eiJ9.ON6PyM9fXDMRmFW22BZsTw';
	
	var map = new mapboxgl.Map({
	    container: 'user-location-map',
	    style: 'mapbox://styles/mapbox/streets-v9',
	    center: [-73.9925, 40.7359],
	    zoom: 10
	});

	var geocoder = new MapboxGeocoder({
	    accessToken: mapboxgl.accessToken,
	    country: 'us',
	    proximity: { longitude: -73.9925, latitude: 40.7359 },
	});

	map.addControl(geocoder);

	var location;

	map.on('load', function() {
		$('#user-location-map').animate({'opacity': 1}, 400);

		map.addSource('single-point', {
	        "type": "geojson",
	        "data": {
	            "type": "FeatureCollection",
	            "features": []
	        }
	    });

	    map.addLayer({
	        "id": "point",
	        "source": "single-point",
	        "type": "circle",
	        "paint": {
	            "circle-radius": 10,
	            "circle-color": "#007cbf"
	        }
	    });

	    // Listen for the `geocoder.input` event that is triggered when a user
	    // makes a selection and add a symbol that matches the result.
	    geocoder.on('result', function(ev) {
	        map.getSource('single-point').setData(ev.result.geometry);
	        loction = ev.result.geometry;
	    });
	})

	map.on('click', function(e) {
		console.log(e.lngLat);
	});
}