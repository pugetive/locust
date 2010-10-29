Locust
------

Locust is still a grasshopper.

Basics
------

After including the Google Maps JavaScript library and locust.js:

Build, fetch, or include a JSON feed:

    var locus_info = 
    [
      {
        id        : '1',
        name      : "Space Needle",
        latitude  : 47.62074,
        longitude : -122.349308,
        tags      : ['seattle center'],
        content   : "Space Needle: Seattle's gift to retro-futurism."
      },
      {
        id        : '2',
        name      : 'Experience Music Project',
        latitude  : 47.621283,
        longitude : -122.348514,
        tags      : ['music', 'seattle center'],
        content   : 'EMP: an architectural blob with a monorail and some Replacements memorabilia.'
        },
      ...etc...
    ];

Then construct a Map object and show markers by tag or ID:

    map = new locust.Map({
      locus_info : locus_info
    });

    if (param('tag')) {
      // Second argument is optional boolean to automatically open 
      // info windows containing the content for each marker
      map.showLociByTag('sometag', true); 
    } else if (param('show')){
      map.showLocusById('someID');
    }
