/**
--------------------------------------------------------------------------------
Behaviors:
  x Can link directly to store from outside page
  x Can display markers for stores in a specific category
  - Can display store details and link by clicking on marker
  
Classes:
  Map
    * size
    * starting depth
    * draw()
  Marker
    * id
    * name
    * description
    * image
    .show()
  Tag
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
      :description => 'My teaser',
      :category    => Category
    }      
  ]
  
-------------------------------------------------------------------------------- 
*/


locust  = {
  Map    : function() {},
  Marker : function() {}
}





/**
-------------------------------------------------------------------------------- 
   Marker class
-------------------------------------------------------------------------------- 
*/

locust.Marker = function(options) {
  this.name      = "Unnamed Location";
  this.latitude  =   47.62074;
  this.longitude = -122.349308;
  // Replace the defaults with any passed in parameters;
  for (var n in options) { this[n] = arguments[0][n]; }

  this.latLng    = new google.maps.LatLng(this.latitude, this.longitude);
  this.infowindow = new google.maps.InfoWindow({
      content: this.content
  });

}

locust.Marker.prototype.show = function() {
  var locus = this;

  var pointer_image = 'http://dev.todd.com/google_maps/images/flash.png'
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(locus.latitude, locus.longitude), 
    map   : locus.map, 
    title : locus.name,
    icon  : pointer_image
  });

  locus.marker = marker;
  google.maps.event.addListener(marker, 'click', function() {
    locus.showInfoWindow();
  });
}

locust.Marker.prototype.showInfoWindow = function() {
  this.infowindow.open(this.map, this.marker);
}






/**
-------------------------------------------------------------------------------- 
   Map class
-------------------------------------------------------------------------------- 
*/

locust.Map = function(options) {
  var m = this;

  m.center      = new locust.Marker();
  m.zoomLevel   = 17;
  m.mapType     = 'roadmap'; // ['roadmap', 'satellite', 'hybrid']
  m.locus_info  = [];
  m.loci        = [];

  // Replace the defaults with any passed in parameters;
  for (var n in options) { this[n] = arguments[0][n]; }

  this.initialize();  

  for(i = 0; i < m.locus_info.length; ++i){
    var locus = new locust.Marker(m.locus_info[i])
    locus.map = m.map;

    m.loci.push(locus);
  }
}


locust.Map.prototype.initialize = function() {
  var latlng = new google.maps.LatLng(this.center.latitude, this.center.longitude);
  var myOptions = {
    zoom      : this.zoomLevel,
    center    : latlng,
    mapTypeId : this.mapType
  };
  this.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

locust.Map.prototype.showLocusById = function(id) {
  var locus = this.getLocusById(id);
  if (locus){
    this.map.center = new google.maps.LatLng(locus.latitude, locus.longitude)
    locus.show();
    return
  }
}

locust.Map.prototype.getLocusById = function(id){
  for(i = 0; i < this.loci.length; ++i){
    if (this.loci[i].id == id){
      return this.loci[i];
    }
  }
  return false;
}

locust.Map.prototype.showLociByTag = function(tag, open_info_window){
  var loci = this.getLociByTag(tag);
  var bounds = new google.maps.LatLngBounds();

  for(i = 0; i < loci.length; ++i){
    loci[i].show();
    bounds.extend(loci[i].latLng);
    if (open_info_window){
      loci[i].showInfoWindow();
    }
  }
  this.map.fitBounds(bounds);
}

locust.Map.prototype.getLociByTag = function(tag) {
  var matches = [];
  for (i = 0; i < this.loci.length; ++i){
    var locus = this.loci[i];
    var tags = locus.tags.split(',');
    if (tag in oc(tags)){
      matches.push(locus)
    }
  }
  return matches;
}





/**
-------------------------------------------------------------------------------- 
   Utilities
-------------------------------------------------------------------------------- 
*/

function oc(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}