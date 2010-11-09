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

    locust_map = new locust.Map({
      canvasID   : 'target-element-id', // defaults to "map-canvas"
      markerInfo : marker_info
    });

    if (param('tag')) {

      // Second argument is optional boolean to automatically open 
      // info windows containing the content for each marker
      locust_map.showMarkersByTag(param('tag'), true); 

    } else if (param('show')){

      locust_map.showMarkerById(param('show'));

    }


Linking to Markers
------------------
Markers can be looked up by a URL-safe "dashed name" which Locust can match to the original string.  The marker for "Merle's Country & Western Records" might be reference online with:

    http://example.com/map/#/merles-country-and-western-records

...which can be constructed like so:

    var url = 'http://example.com/map/#/' + locust_marker.dashedName;

...and then direct links to display the marker and its info window could be handled like so:

    var target_marker = window.location.toString().split('#/')[1];
    locust_map.showMarkerByDashedName(target_marker);

Custom Styling
--------------
Locust provides a shorter means of specifying custom styles via the shortStyles property.  You pass an array of specs in this format:
    [<featureType>, <elementType: optional, defaults to "all">, <hash_of_stylers>]

...and Locust rewrites them into the data structure Google expects:

    var stylez = [
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [
            { visibility: "simplified" }
          ]
        },
        {
          featureType: "all",
          elementType: "all",
          stylers: [
            { gamma: 2.0 }
          ]
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "all",
          stylers: [
            { visibility: "off" }
          ]
        },
        {
          featureType: "landscape.man_made",
          elementType: "all",
          stylers: [
            { hue: "#330066" },
            { saturation: 100 },
            { lightness: -100 }
          ]
        }
      ];


As an example, here we are making a "clear blue sky" map by simplifying the display and tweaking its color:

    locust_map.shortStyles = [["road", "geometry", { visibility : "simplified" }],
                              ["administrative.land_parcel", { visibility : "off" }],
                              ["all",  { hue        : '#87cefa', 
                                         saturation : 100, 
                                         lightness  : 25,
                                         gamma      : 2.0 }]
                              ];
    

For convenience, a "greyscale" property will automatically draw the map in black and white:

    var map = new locust.Map({greyscale: true})

Custom Tiling
-------------

To pin a marker at the top left corner of each map tile (making handy screenshots for custom tiling), set markTileCorners. A custom marker image to delineate corners is included, but the client must set its directory prefix with tileMarkerPath.  If markTileCorners is true but a tileMarkerPath is unspecified, the default marker pin will be used.

    locust_map = new locust.Map({
      markerInfo      : marker_info,
      markTileCorners : true,
      tileMarkerPath  : 'http://example.com/images',
      tileSize        : 512          // default is 256
    });
