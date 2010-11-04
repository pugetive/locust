Locust
------

Locust is still a grasshopper.  It's being abstracted from a custom map project currently under development.

Basics
------

After including the Google Maps JavaScript library and locust.js:

Build, fetch, or include a JSON feed of marker details.  Note that we assign an ID and some tags to each marker.

    var marker_info = 
    [
      {
        id        : '1',
        name      : "Space Needle",
        latitude  : 47.62074,
        longitude : -122.349308,
        tags      : ['seattle center'],
        content   : "Space Needle: Seattle's gift to retro-futurism.",
        zoom      : 17
      },
      {
        id        : '2',
        name      : 'Experience Music Project',
        latitude  : 47.621283,
        longitude : -122.348514,
        tags      : ['music', 'seattle center'],
        content   : 'EMP: an architectural blob with a monorail and some Replacements memorabilia.',
        zoom      : 18
        },
      ...etc...
    ];

Then construct a Map object and show markers by tag or ID (this assumes you're grabbing query variables with a "param" function):

    map = new locust.Map({
      canvasID   : 'target-element-id', // defaults to "map-canvas"
      markerInfo : marker_info
    });

    if (param('tag')) {

      // Second argument is optional boolean to automatically open 
      // info windows containing the content for each marker
      map.showMarkersByTag(param('tag'), true); 

    } else if (param('show')){

      map.showMarkerById(param('show'));

    }

To automatically set a marker at the top left of each map tile (very handy for creating custom overlays), set markTileCorners:

    map = new locust.Map({
      canvasID        : 'target-element-id', // defaults to "map-canvas"
      markerInfo      : marker_info,
      markTileCorners : true
    });
