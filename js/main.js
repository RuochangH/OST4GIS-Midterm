/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [41.880684,-87.630630],
  zoom: 13
});

//mapboxgl.accessToken = 'pk.eyJ1IjoicnVvY2hhbmciLCJhIjoiY2plMGN5NmduNTBzMzJ3cXA4OHJqbTg1MCJ9.hVntg2f96UxD239bHHlQFw';
//var map = new mapboxgl.Map({
  //container: 'map',
  //center:[ -87.630630,41.880684],
  //zoom: 13,
  //style: 'mapbox://styles/ruochang/cjeutr1ns0uik2sp5e1sgmmnj'
//});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

//provide data
var dataURL = "https://raw.githubusercontent.com/RuochangH/OST4GIS-Midterm/master/map.geojson";
var featureGroup;

//create layer click sidebar modification
var showResults = function() {
  $('#intro').hide();
  //$('#results').show();
};

//create property json
var toJson = function(geoJSONObject){
  var geoObject = JSON.parse(geoJSONObject);
  var features = [];
  features = geoObject.features; return features;};

//create filtering JSON
var ftJson = function (a,b,c) {
  _.filter(c,function(d){return d.Id===a&&d.Week===b;});
};

/*
var eachFeatureFunction = function(layer,newData) {
  layer.on('click', function (event) {
    showResults();
    var station = layer.feature.properties.Id;
    var wked = layer.feature.properties.Week;
    ftJson(station,wked,newData);
    function (val) {if(val=="MON") {return "Monday";} else if (
      val=="TUE") {return "Tuesday";} else if (
        val=="WED") {return "Wedsday";} else if (
          val=="THU"){return "Thursday";} else if (
            val=="FRI"){return "Friday";}};
    var fulday = day(layer.feature.properties.COLLDAY);
    $('.day-of-week').text(fulday);
  });
};
*/


//Plot
$('button').click(function(){
  //read user input
  var hour = Number($('#ahour').find(":selected").text());
  function date() {switch ($('#aweek').find(":selected").text()){
    case 'Weekday': return 9;
    case 'Weekend': return 13;}}
  var week = date();


  var myFilter = function(feature){
    if(feature.properties.Week===week && feature.properties.Hour===hour){return true;}
  };

  $(document).ready(function(){
    $.ajax(dataURL).done(function(data) {
      if(featureGroup != undefined){
        map.removeLayer(featureGroup);
      }
    var parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData,{
      filter:myFilter,
      pointToLayer:function(feature,latlng){
        var geojsonMarkerOptions = {
            radius: feature.properties.dept+1,
            fillColor: "#F8B195",
            color: "#355C7D",
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.8
        };
        return L.circleMarker(latlng,geojsonMarkerOptions);
      }
    }
  ).addTo(map);
  });});
});
