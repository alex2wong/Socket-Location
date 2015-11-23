
var lon = 5;
var lat = 40;
var zoom = 5;
var map, layer;

function init(){
    map = new OpenLayers.Map( 'map' );
    /*layer = new OpenLayers.Layer.WMS( "OpenLayers WMS", 
            "http://vmap0.tiles.osgeo.org/wms/vmap0",
            {layers: 'basic'} );
    map.addLayer(layer);*/
    layer2 = new OpenLayers.Layer.WMS(
                "Global Imagery",
                "http://demo.opengeo.org/geoserver/wms",
                {layers: "bluemarble"},
                {maxExtent: [-160, -88.759, 160, 88.759], numZoomLevels: 10}
            );
    //layer = new OpenLayers.Layer.Vetor("base Map");
    map.addLayer(layer2);

    map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);
    var featurecollection = {
      "type": "FeatureCollection", 
      "features": [
        {"geometry": {
            "type": "GeometryCollection", 
            "geometries": [
                {
                    "type": "LineString", 
                    "coordinates": 
                        [[11.0878902207, 45.1602390564], 
                        [15.01953125, 48.1298828125]]
                }, 
                {
                    "type": "Polygon", 
                    "coordinates": 
                        [[[11.0878902207, 45.1602390564], 
                          [14.931640625, 40.9228515625], 
                          [0.8251953125, 41.0986328125], 
                          [7.63671875, 48.96484375], 
                          [11.0878902207, 45.1602390564]]]
                },
                {
                    "type":"Point", 
                    "coordinates":[15.87646484375, 44.1748046875]
                }
            ]
        }, 
        "type": "Feature", 
        "properties": {}}
      ]
   };

   var styleMap = new OpenLayers.StyleMap({
                        
                        "select": {
                            cursor: "crosshair",
                            fillColor: "#ff0000",
                            pointRadius:12
                        }
                    });

   var geojson_format = new OpenLayers.Format.GeoJSON();
   var vector_layer = new OpenLayers.Layer.Vector("randomSocketPoints",{
    renderers:['Canvas'],
    styleMap:styleMap
  }); 
   map.addLayer(vector_layer);
   vector_layer.addFeatures(geojson_format.read(featurecollection));

}



