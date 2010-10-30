/**
Locust: a JavaScript wrapper for the Google Maps API
@author Todd Gehman (toddgehman@gmail.com)
Copyright (c) 2010 Todd Gehman


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


/**
--------------------------------------------------------------------------------
Classes and methods:

  Map
    .showMarkerById(id)
    .getMarkerById(id)
    .showMarkerByTag(tag, <show_info_window:bool>)
    .getMarkerByTag(tag)
    
  Marker
    .show()
    
Example data feed in js/feed.js

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
  this.name           = "Unnamed Location";
  this.latitude       =   47.62074;  // space
  this.longitude      = -122.349308; // needle

  // Replace the defaults with any passed in parameters;
  for (var n in options) { this[n] = arguments[0][n]; }

  this.latLng    = new google.maps.LatLng(this.latitude, this.longitude);
  this.infowindow = new google.maps.InfoWindow({
      content: this.content
  });

}


locust.Marker.prototype.show = function() {
  var locus = this;

  // var pointer_image = 'http://dev.todd.com/google_maps/images/flash.png'
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(locus.latitude, locus.longitude), 
    map   : locus.map, 
    title : locus.name,
    // icon  : pointer_image
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

  m.center     = new locust.Marker();
  m.zoomLevel  = 17;
  m.mapType    = 'roadmap'; // ['roadmap', 'satellite', 'hybrid']
  m.markerInfo = [];
  m.markers    = [];
  m.canvasID   = 'map_canvas';

  this.mapTypeControl = true;

  // Replace the defaults with any passed in parameters;
  for (var n in options) { this[n] = arguments[0][n]; }

  m.initialize();  

  for(i = 0; i < m.markerInfo.length; ++i){
    var locus = new locust.Marker(m.markerInfo[i])
    locus.map = m.map;

    m.markers.push(locus);
  }
}


locust.Map.prototype.initialize = function() {
  var latlng = new google.maps.LatLng(this.center.latitude, this.center.longitude);
  var myOptions = {
    zoom           : this.zoomLevel,
    center         : latlng,
    mapTypeId      : this.mapType,
    mapTypeControl : this.mapTypeControl
  };
  this.map = new google.maps.Map(document.getElementById(this.canvasID), myOptions);
}


locust.Map.prototype.showMarkerById = function(id) {
  var locus = this.getMarkerById(id);
  if (locus){
    this.map.center = new google.maps.LatLng(locus.latitude, locus.longitude)
    locus.show();
    return
  }
}


locust.Map.prototype.getMarkerById = function(id){
  for(i = 0; i < this.markers.length; ++i){
    if (this.markers[i].id == id){
      return this.markers[i];
    }
  }
  return false;
}


locust.Map.prototype.getTagsWithMarkers = function() {
  var markers = this.markers
  var tags = {}
  
  for(i = 0; i < markers.length; ++i){
    var locus = markers[i];
    var locus_tags = locus.tags;
    for(j = 0; j < locus_tags.length; ++j){
      var this_tag = locus_tags[j];
      if (tags[this_tag]){
      } else {
        tags[this_tag] = []
      }
      tags[this_tag].push(locus)
    }
  }
  return tags;
}

locust.Map.prototype.showMarkersByTag = function(tag, open_info_window){
  var markers = this.getMarkersByTag(tag);
  var bounds = new google.maps.LatLngBounds();

  for(i = 0; i < markers.length; ++i){
    markers[i].show();
    bounds.extend(markers[i].latLng);
    if (open_info_window){
      markers[i].showInfoWindow();
    }
  }
  this.map.fitBounds(bounds);
}


locust.Map.prototype.getMarkersByTag = function(tag) {
  var matches = [];
  for (i = 0; i < this.markers.length; ++i){
    var locus = this.markers[i];
    var tags = locus.tags;
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