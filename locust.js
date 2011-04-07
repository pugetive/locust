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
    .showMarkerByDashedName(dashed_name)
    .getMarkerByDashedName(dashed_name)
    
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
  this.marker    = null;
  this.thumbnail = null; //'http://media.svennerberg.com/2009/09/bgma3-70.png'

  // Replace the defaults with any passed in parameters;
  for (var n in options) { this[n] = arguments[0][n]; }

  this.dashedName = dashed_string(this.name);

  if (typeof(this.tags) == 'string'){
    this.tags = [this.tags];
  }

  this.latLng = new google.maps.LatLng(this.latitude, this.longitude);
  if (!this.zoom){
    this.zoom = 17;
  }

  var info_window_content = '';
  if (this.thumbnail){
    var img_tag = '<img src="' + this.thumbnail + '" />';
    info_window_content += '<div class="marker-image">' + img_tag + '</div>';
  }
  
  info_window_content += '<div class="marker-text">'
  info_window_content += '<div class="marker-title">' + this.name + '</div>';
  info_window_content += '<div class="marker-body">' + this.content + '</div>';
  if (this.website_url){
    var a_tag = '<a href="' + this.website_url + '">Website</a>';
    info_window_content += '<div class="marker-hotlink">' + a_tag + '</div>';
  }
  info_window_content += '</div>'


  this.infowindow = new google.maps.InfoWindow({
    content: info_window_content
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
      position : new google.maps.LatLng(locus.latitude, locus.longitude), 
      map      : locus.map, 
      title    : locus.name
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

  // Common settings
  m.center          = new locust.Marker();
  m.zoomLevel       = 17;
  m.mapType         = 'roadmap'; // ['roadmap', 'satellite', 'hybrid']
  m.markerInfo      = [];
  m.canvasID        = 'map-canvas';

  // Custom tiling
  m.markTileCorners = false;
  m.tileSize        = 256;
  m.tileMarkerImage = 'tile-corner-marker.png';
  m.tileMarkerPath  = null; // Must be set to reference the client's image directory

  m.greyscale       = false;

  m.markers         = [];
  m.tileMarkers     = [];
  
  this.mapTypeControl = true;

  // Replace the defaults with any passed in parameters;
  for (var n in options) { this[n] = arguments[0][n]; }

  m.initialize();  

  if (m.markTileCorners){
    google.maps.event.addListener(this.map, 'zoom_changed', function() {
      m.clearTileMarkers();
    });
  }

  this._instantiateMarkers();
}

/**
* Display the map on screen 
* @param none
* @return null
*/

locust.Map.prototype.initialize = function() {
  var locust_map = this;


  var latlng = new google.maps.LatLng(this.center.latitude, this.center.longitude);

  var myOptions = {
    zoom               : this.zoomLevel,
    center             : latlng,
    mapTypeId          : this.mapType,
    mapTypeControl     : this.mapTypeControl,
    panControl         : this.panControl,
    zoomControl        : this.zoomControl,
    scaleControl       : this.scaleControl,
    streetViewControl  : this.streetViewControl,
    overviewMapControl : this.overviewMapControl
  };

  this.map = new google.maps.Map(document.getElementById(this.canvasID), myOptions);
  if (this.markTileCorners){
    this._setTileMarkers()
  }
  this._setCustomStyles();
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
* Returns the marker object corresponding to the given unique ID 
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
* Returns the marker object matching the given encoded name
* @param String url-string
* @return Marker name description
*/
locust.Map.prototype.getMarkerByDashedName = function(dashed_string){
  for(i = 0; i < this.markers.length; ++i){
    if (this.markers[i].dashedName == dashed_string){
      return this.markers[i];
    }
  }
  return false;
}

locust.Map.prototype.showMarkerByDashedName = function(dashed_string){
  this.showMarkerById(this.getMarkerByDashedName(dashed_string).id)
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
        tags[this_tag] = [];
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

locust.Map.prototype.clearTileMarkers = function() {
  for(var i in this.tileMarkers){
    var m = this.tileMarkers[i];
    if (m){
      m.setMap(null);
    }
  }
}

/**
* Reads the shortStyles data setting, rewrites in in long-form and sets teh custom styles. 
* @param none
* @return null
*/

locust.Map.prototype._setCustomStyles = function() {
  if (this.shortStyles || this.greyscale){
    var style_settings = []
    if (this.shortStyles){
      style_settings = this.shortStyles;
    } else {
      style_settings = [];
    }
    
    if (this.greyscale){
      var categories = ["administrative", "poi", "road", "transit", "water"];
      for (var i in categories){
        var setting = [categories[i], { saturation: -100 }]
        style_settings.push(setting)
      }
    }

    var massaged_settings = []
    for(i in style_settings){
      var setting = style_settings[i]
      if (typeof(setting[1]) == 'string'){
        element_type = setting[1];
        styles_hash = setting[2];
      } else {
        element_type = 'all';
        styles_hash = setting[1];
      }

      var stylers = [];
      for (var key in styles_hash){
        var s = {}
        s[key] = styles_hash[key];
        stylers.push(s)
      }
      var thing = {
        featureType : setting[0],
        elementType : element_type,
        stylers     : stylers
      }
      massaged_settings.push(thing);
    }
    var styledMapOptions = {
      name: "custom"
    }

    // console.log(massaged_settings)
    var customMapType = new google.maps.StyledMapType(
        massaged_settings, styledMapOptions);
    
    this.map.mapTypes.set('custom', customMapType);
    this.map.setMapTypeId('custom');
  }
  
}

/**
*  Adds a marker to the top left corner of each tile.
* @param none
* @return null
*/

locust.Map.prototype._setTileMarkers = function() {
  var locust_map = this;
  var tile_marker = null;
  if (locust_map.tileMarkerPath && locust_map.tileMarkerImage){
    var path_separator = '/';
    if (locust_map.tileMarkerPath.substr(-1, 1) == '/'){
      path_separator = '';
    }
    tile_marker = new google.maps.MarkerImage(locust_map.tileMarkerPath + path_separator + locust_map.tileMarkerImage, 
                                              null, 
                                              null, 
                                              new google.maps.Point(10, 10))
  }

  var image_map_type = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      if (locust_map.markTileCorners){
        var tile_size = locust_map.tileSize;
        var zfactor=Math.pow(2, zoom);
        var tile_point = new google.maps.Point(coord.x * tile_size / zfactor, coord.y * tile_size / zfactor);
        var tile_latlng = locust_map.map.getProjection().fromPointToLatLng(tile_point);

        var marker = new google.maps.Marker({
          position: tile_latlng, 
          map: locust_map.map, 
          title: "Tile at:" + coord,
          icon: tile_marker
        });
        locust_map.tileMarkers.push(marker);
      }
    },
    tileSize: new google.maps.Size(this.tileSize, this.tileSize),
    isPng: true
  });
  locust_map.map.overlayMapTypes.insertAt(0, image_map_type);
  
}

/**
* Instantiates locust.Marker objects from the JSON data and stores them in locust.Map.markers 
* @param none
* @return nil
*/

locust.Map.prototype._instantiateMarkers = function() {
  var locust_map = this;
  for(i = 0; i < locust_map.markerInfo.length; ++i){
    if (locust_map.alternateIdKey){  
      locust_map.markerInfo[i].id = locust_map.markerInfo[i][locust_map.alternateIdKey];
    }
    if (locust_map.alternateContentKey){
      locust_map.markerInfo[i].content = locust_map.markerInfo[i][locust_map.alternateContentKey];
    }
    if (locust_map.alternateNameKey){
      locust_map.markerInfo[i].name = locust_map.markerInfo[i][locust_map.alternateNameKey];
    }
    var locus = new locust.Marker(locust_map.markerInfo[i])
    locus.map = locust_map.map;

    locust_map.markers.push(locus);
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
  for(var i=0; i < a.length; i++)
  {
    o[a[i]]='';
  }
  return o;
}

function dashed_string(text){
  if (text == undefined) {
    return '';
  }

  var string_cleaning = {
    '[\(\)]' : '',
    "'"      : '',
    '&#039;' : '',
    '&amp;'  : 'and',
    ' '      : '-'
  };

  var clean_text = text.toLowerCase();
  for(key in string_cleaning) {
    var regex = new RegExp(key, 'g');
    clean_text = clean_text.replace(regex, string_cleaning[key]);
  };
  return clean_text;
}

