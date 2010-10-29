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
        tags      : ['tourist'],
        content   : 'Space Needle: a shining example of retro-futurism.'
      },
      {
        id        : '2',
        name      : 'EMP',
        latitude  : 47.621283,
        longitude : -122.348514,
        tags      : ['tourist', 'music'],
        content   : 'EPM: an architectural blob featuring a monorail and some Replacements memorabilia.'
      },
      ...etc...
    ];

Then construct a Map object and show markers by tag or ID:

    function loadMap() {
      map = new locust.Map({
        locus_info : locus_info
      });

      if (param('tag')) {
        // Second argument is optional boolean to automatically open info windows
        // for each marker
        map.showLociByTag(param('tag'), true); 
      } else if (param('show')){
        map.showLocusById(param('show'));
      }
    }
