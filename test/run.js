var map;

function loadMap() {
  map = new locust.Map({
    canvasID   : 'map_canvas',
    markerInfo  : marker_info
  });

  if (param('tag')) {
    map.showMarkersByTag(param('tag'), true);
  } else if (param('show')){
    map.showMarkerById(param('show'));
  }
}


function param( name ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURI(results[1]);
}
