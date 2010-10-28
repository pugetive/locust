/**
--------------------------------------------------------------------------------
Behaviors:
  - Can link directly to store from outside page
  - Can display markers for stores in a specific category
  - Can display store details and link by clicking on marker
  - 
  
Classes:
  Map
    * size
    * starting depth
    * draw()
  Locus
    * id
    * name
    * description
    * image
    .showMarker()
  Category
    * name
    .showMarkers()    
    

Example setup:

loci = 
  [
    {
      :name        => "My Store",
      :id          => 'unique key', 
      :latitude    => 123,
      :longitude   => 123,
      :thumbnail   => 'my-url.jpg',
      :descriptoin => 'My teaser',
      :category    => Category
    }      
  ]
  
-------------------------------------------------------------------------------- 
*/


locust  = {
  Map : function() {}
}

locust.Map = function(options) {
  var m = this;

  m.latitude  =   47.62074;  // Space needle
  m.longitude = -122.349308; // Space needle
  m.zoomLevel = 17;
  m.mapType   = 'hybrid'; // ['roadmap', 'satellite', 'hybrid']
  // Replace the defaults with any passed in parameters;
  for (var n in options) { this[n] = arguments[0][n]; }

  function initialize() {
    var latlng = new google.maps.LatLng(m.latitude, m.longitude);
    var myOptions = {
      zoom: m.zoomLevel,
      center: latlng,
      mapTypeId: m.mapType
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
  }
  initialize();  
}
