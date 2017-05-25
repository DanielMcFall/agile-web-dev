/* -----------------------------------------------------
  use Google Maps API to reverse geocode our location
 ------------------------------------------------------ */
function myCurrentPosition() {

  /* google map  api -- used for post code and address fetching*/
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(printAddress); //calling print address function to filter the location and display
  }
}

function printAddress(position) {
  // set up the Geocoder object

  var geocoder = new google.maps.Geocoder();

  var longitude = position.coords.longitude;
  var latitude = position.coords.latitude;

  console.log(longitude, latitude);

  // turn coordinates into an object
  var yourLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  // find out info about our location
  geocoder.geocode({
    'latLng': yourLocation
    }, function(results, status) {

      if (status == google.maps.GeocoderStatus.OK) {

        for (var i = 0; i < results[0].address_components.length; i++) {
          var component = results[0].address_components[i];

          if (component.types[0] == "postal_code") {
            document.getElementById("postcode").value = component.long_name;
          }
          if(component.types[0] == "locality") {
            document.getElementById("suburb").value = component.long_name;
			    }
        }
      } else {
        error("Reverse Geocoding failed due to: " + status);
      }
    });
}

function error(msg) {
  alert(msg);
}
