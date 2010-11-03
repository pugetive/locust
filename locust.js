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
    .showMarkersByTag(tag, <show_info_window:bool>)
    .getMarkersByTag(tag)
    
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
  this.name      = "Space Needle";
  this.latitude  =   47.62074; 
  this.longitude = -122.349308;
  this.marker    = null;

  // Replace the defaults with any passed in parameters;
  for (var n in options) { this[n] = arguments[0][n]; }

  this.latLng = new google.maps.LatLng(this.latitude, this.longitude);
  if (!this.zoom){
    this.zoom = 17;
  }

  // var info_window = $('<div>');
  // info_window.addClass('marker-info');
  // 
  // var marker_image = $('<img />');
  // marker_image.attr('src', 'http://media.svennerberg.com/2009/09/bgma3-70.png');
  // info_window.append(marker_image);
  // info_window.append(this.content);
  // 
  this.infowindow = new google.maps.InfoWindow({
    content: this.content
  });

}



/**
*  Pin a marker to the map and make it clickable.
*  NOTE: this does not alter the placement or zoom of the map.
* @param none
* @return null
*/

locust.Marker.prototype.show = function() {
  var locus = this;

  if (locus.marker){
    locus.marker.setMap(locus.map);
  } else {
    // var pointer_image = 'http://dev.todd.com/google_maps/images/flash.png'
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(locus.latitude, locus.longitude), 
      map   : locus.map, 
      title : locus.name,
      // icon  : pointer_image
    });
    locus.marker = marker;
  }


  google.maps.event.addListener(locus.marker, 'click', function() {
    locus.showInfoWindow();
  });
}


locust.Marker.prototype.showInfoWindow = function() {
  this.infowindow.open(this.map, this.marker);
}

locust.Marker.prototype.hideInfoWindow = function() {
  this.infowindow.close(this.map, this.marker);  
}






/**
-------------------------------------------------------------------------------- 
   Map class
-------------------------------------------------------------------------------- 
*/


/**
* locust.Map contructor - constructs and initializes map.
* @param Array options
* @return null
*/

locust.Map = function(options) {
  var m = this;

  m.center          = new locust.Marker();
  m.zoomLevel       = 17;
  m.mapType         = 'roadmap'; // ['roadmap', 'satellite', 'hybrid']
  m.markerInfo      = [];
  m.markers         = [];
  m.canvasID        = 'map_canvas';
  m.markerInfoClass = 'marker-info';

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

/**
* Display the map on screen 
* @param none
* @return null
*/

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


/**
* Recenter map to the given marker, and zoom as necessary. 
* @param String marker_id : Unique identifier for the marker
* @return null
*/

locust.Map.prototype.showMarkerById = function(id) {
  var locus = this.getMarkerById(id);

  if (locus){
    this.map.panTo(locus.latLng);
    locus.show();
    locus.showInfoWindow();
  }
  if (locus.zoom){
     this.conditionalZoom(locus.zoom);
  }
}


/**
* Retuns the marker object corresponding to the given unique ID 
* @param String id 
* @return locust.Marker or <false>
*/

locust.Map.prototype.getMarkerById = function(id){
  for(i = 0; i < this.markers.length; ++i){
    if (this.markers[i].id == id){
      return this.markers[i];
    }
  }
  return false;
}

/**
* Returns an array of arrays, first level containing all 
* the tags culled from the original JSON feed, second level
* containing all hte markers associated with each tag. 
* @param none
* @return Array of Arrays ["tag" : [locust.Marker, locust.Marker]}
*/

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


/**
* Returns all tags culled from the source JSON feed info. 
* @param none
* @return Array tags : An array of strings
*/

locust.Map.prototype.getTags = function() {
  var tags_with_markers = this.getTagsWithMarkers();
  var tags = []
  for(tag in tags_with_markers){
    tags.push(tag);
  }
  return tags.sort();
}

/**
* Displays all markers associated with a given tag, adjusts map bounds
* to encompass them all, and optionally opens their info windows 
* @param String tag 
* @param Boolean open_info_window
* @return null
*/

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
  if (markers.length > 1){
    this.map.fitBounds(bounds);
  } else if (markers[0]){
    this.map.panTo(markers[0].latLng);
    this.conditionalZoom(markers[0].zoom);
  }
}

/**
* Returns all Markers associated with a given tag. 
* @param String tag
* @return Array of locust.Marker objects
*/

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
* Clears all visible markers and info windows 
* @return null
*/

locust.Map.prototype.clearMarkers = function() {
  for(var i in this.markers){
    this.markers[i].hideInfoWindow();
    var m = this.markers[i].marker;
    if (m){
      m.setMap(null);
    }
  }
}

/**
* Resets the zoom level of the map only if it is at least 2 levels  
* different from current
*
* @param integer zoom_level The target level to set, if applicable
* @return null
*/

locust.Map.prototype.conditionalZoom = function(zoom_level) {
  if (Math.abs(zoom_level - this.map.getZoom()) > 2){
    this.map.setZoom(zoom_level);
  }  
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