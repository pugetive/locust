Locust
------

Locust is not written yet.

Basics
------

      <!DOCTYPE html>
      <html>
      <head>
      <style type="text/css">
        html { height: 100% }
        body { height: 100%; margin: 0px; padding: 0px }
        #map_canvas { height: 100% }
      </style>
      <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
      <script src="locust.js" type="text/javascript" charset="utf-8"></script>

      <script type="text/javascript" charset="utf-8">
        function loadMap() {
          new locust.Map({
            latitude: 47.675988,
            longitude: -122.372604
          });
        }
      </script>

      </head>
      <body onload="loadMap()">
        <div id="map_canvas" style="width:100%; height:100%"></div>
      </body>
      </html>