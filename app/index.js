/**
 * Main JS file for project.
 */

// Define globals that are added through the js.globals in
// the config.json file, here, mostly so linting won't get triggered
// and its a good queue of what is available:
// /* global _ */

// Dependencies
import utils from './shared/utils.js';

// Mark page with note about development or staging
utils.environmentNoting();


// Auto enable Pym for embedding.  This will enable a Pym Child if
// the url contains ?pym=true
utils.autoEnablePym();


// Adding dependencies
// ---------------------------------
// Import local ES6 or CommonJS modules like this:
// import utilsFn from './shared/utils.js';
//
// Or import libraries installed with npm like this:
// import module from 'module';

// Adding Svelte templates in the client
// ---------------------------------
// We can bring in the same Svelte templates that we use
// to render the HTML into the client for interactivity.  The key
// part is that we need to have similar data.
//
// First, import the template.  This is the main one, and will
// include any other templates used in the project.
// import Content from '../templates/_index-content.svelte.html';
//
// Get the data parts that are needed.  There are two ways to do this.
// If you are using the buildData function to get data, then ?
//
// 1. For smaller datasets, just import them like other files.
// import content from '../assets/data/content.json';
//
// 2. For larger data points, utilize window.fetch.
// let content = await (await window.fetch('../assets/data/content.json')).json();
//
// Once you have your data, use it like a Svelte component:
//
// const app = new Content({
//   target: document.querySelector('.article-lcd-body-content'),
//   data: {
//     content
//   }
// });

//chart selection parameters
$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results != null) {
        return results[1] || 0;
    } else {
        return null;
    }
}

var selected = $.urlParam('chart');

if (selected != null) {
    $(".slide").hide();
    $("#" + selected).show();
}
if (selected == "all") {
    $(".slide").show();
}

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhZG93ZmxhcmUiLCJhIjoiS3pwY1JTMCJ9.pTSXx_LFgR3XBpCNNxWPKA';

var dzoom = 10.5;
var mzoom = 10.5;
var latlong = [-93.267278, 44.965363];

var map = new mapboxgl.Map({
    container: 'tags',
    style: 'mapbox://styles/shadowflare/ciqzo0bu20004bknkbrhrm6wf',
    center: latlong, 
    zoom: dzoom,
    minZoom: mzoom
});

map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();
map.doubleClickZoom.disable();


map.on('load', function() {

//CITY
map.addSource('mpls', {
    type: 'geojson',
    data: './shapefiles/minneapolis.geojson'
  });
 
   map.addLayer({
        'id': 'mpls-layer',
        'interactive': true,
        'source': 'mpls',
        'layout': {},
        'type': 'fill',
             'paint': {
            'fill-antialias' : true,
            'fill-opacity': 1,
            'fill-color': 'rgba(255, 255, 255, 0)',
            'fill-outline-color': '#888888'
      }
    }, 'road-primary');

//TAGS
 map.addSource('tags', {
   type: 'geojson',
   data: './shapefiles/tags_hex.geojson'
 });

  map.addLayer({
       'id': 'tags-layer',
       'interactive': true,
       'source': 'tags',
       'layout': {},
       'type': 'fill',
            'paint': {
           'fill-antialias' : true,
           'fill-opacity': 0.7,
           'fill-color': {
            "property": "NUMPOINTS",
            "stops": [
              [0, "rgba(255, 255, 255, 0)"],
              [1, "#D1E6E1"],
              [50, "#A7E6E3"],
              [100, "#67B4C2"],
              [150, "#3580A3"],
              [200, "#0D4673"],
              [250, "#0D4673"]
           ]
        },
           'fill-outline-color': {
            "property": "NUMPOINTS",
            "stops": [
              [0, "rgba(255, 255, 255, 0)"],
              [1, "#888888"],
              [20, "#888888"],
              [40, "#888888"],
              [60, "#888888"],
              [80, "#888888"],
              [100, "#888888"]
           ]
        }
     }
   }, 'road-street');


map.addSource('tows', {
  type: 'geojson',
  data: './shapefiles/tows.geojson'
});

        map.addLayer({
                 "id": "tows-layer",
                 "type": "circle",
                 "source": "tows",
                 "paint": {
                    "circle-radius": 2,
                    "circle-color": '#E07242',
                    "circle-opacity": 0.6
                 }
       }, 'place-neighbourhood');


});

$(document).ready(function() {
  if ($("#wrapper").width() < 600) {
      map.flyTo({
        center: latlong, 
        zoom: mzoom,
        minZoom: mzoom
      });
  } else {
      map.flyTo({
        center: latlong,  
        zoom: dzoom,
        minZoom: mzoom
      });
  }
  $(window).resize(function() {
      if ($("#wrapper").width() < 600) {
          map.flyTo({
            center: latlong,  
            zoom: mzoom,
            minZoom: mzoom
          });
      } else {
          map.flyTo({
            center: latlong,  
            zoom: dzoom,
            minZoom: mzoom
          });
      }
  });
});