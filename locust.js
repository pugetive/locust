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
    .showLocusById(id)
    .getLocusById(id)
    .showLociByTag(tag, <show_info_window:bool>)
    .getLociByTag(tag)
    
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

  m.center      = new locust.Marker();
  m.zoomLevel   = 17;
  m.mapType     = 'roadmap'; // ['roadmap', 'satellite', 'hybrid']
  m.locusInfo  = [];
  m.loci        = [];
  m.canvasID    = 'map_canvas';

  // Replace the defaults with any passed in parameters;
  for (var n in options) { this[n] = arguments[0][n]; }

  this.initialize();  

  for(i = 0; i < m.locusInfo.length; ++i){
    var locus = new locust.Marker(m.locusInfo[i])
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
  this.map = new google.maps.Map(document.getElementById(this.canvasID), myOptions);
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