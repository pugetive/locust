var map;

function loadMap() {
  map = new locust.Map({
    locus_info : locus_info
  });

  if (param('tag')) {
    map.showLociByTag(param('tag'), true);
  } else if (param('show')){
    map.showLocusById(param('show'));
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
    return results[1];
}

