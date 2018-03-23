/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [41.880684,-87.630630],
  zoom: 13
});

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
  opacity:0.7,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(map);


//var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
//  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//  subdomains: 'abcd',
//  minZoom: 0,
//  maxZoom: 20,
//  ext: 'png'
//}).addTo(map);


//provide data
var dataURL = "https://raw.githubusercontent.com/RuochangH/OST4GIS-Midterm/master/map.geojson";
var featureGroup;

function firstClick (event){
  layer.bindPopup("The current departure count is " + feature.properties.dept);
  map.setView(event.latlng,14);
}
//function highlight (event){
//  event.target.setStyle({weight:4, fillcolor:"#355C7D",color:"#000000"});
//  info.update(layer.feature.properties);
//}

//function removehigh (event){
//  featureGroup.resetStyle(event.target);
//  info.update();
//}

function onEachFeature1 (feature,layer) {
  layer.on('click',function(event){
    layer.bindPopup("The current departure count is " + feature.properties.dept);
    map.setView(event.latlng,14);
  });
}


    //var station = layer.feature.properties.Id;
    //var wked = layer.feature.properties.Week;
    //ftJson(station,wked,newData);
    //var fulday = day(layer.feature.properties.COLLDAY);
    //$('.day-of-week').text(fulday);
    // set the dimensions of the canvas





//Plot

$(document).ready(function(){
  $.ajax(dataURL).done(function(data) {

    var parsedData = JSON.parse(data);

    $('#s1').click(function(){
      if(featureGroup != undefined){
        map.removeLayer(featureGroup);
      }
      //read user input
      var hour = Number($('#ahour').find(":selected").text());
      function date() {switch ($('#aweek').find(":selected").text()){
        case 'Weekday': return 9;
        case 'Weekend': return 13;}}
      var week = date();

      var myFilter1 = function(feature){
        if(feature.properties.Week===week && feature.properties.Hour===hour){return true;}
      };

      featureGroup = L.geoJson(parsedData,{
        filter:myFilter1,
        pointToLayer:function(feature,latlng){
          var geojsonMarkerOptions = {
              radius: feature.properties.dept+1,
              fillColor: "#F67280",
              color: "#355C7D",
              weight: 1,
              opacity: 0.5,
              fillOpacity: 0.8
            };
            return L.circleMarker(latlng,geojsonMarkerOptions);
          },
          onEachFeature: onEachFeature1
        }).addTo(map);
      });


      var slideNum =0;

      var slideDisplay = function (num){
        switch(num){
          case 0:
          $('.prev').hide();
          $('.next').show();
          $('.slide1').show();
          $('.slide2').hide();
          $('.slide3').hide();
          $('.slide4').hide();
          $('.slide5').hide();
          map.removeLayer(featureGroup);
          break;
          case 1:
          $('.prev').show();
          $('.next').show();
          $('.slide1').hide();
          $('.slide2').show();
          $('.slide3').hide();
          $('.slide4').hide();
          $('.slide5').hide();
          map.removeLayer(featureGroup);
          break;
          case 2:
          $('.prev').show();
          $('.next').show();
          $('.slide1').hide();
          $('.slide2').hide();
          $('.slide3').show();
          $('.slide4').hide();
          $('.slide5').hide();
          map.removeLayer(featureGroup);
          break;
          case 3:
          $('.prev').show();
          $('.next').show();
          $('.slide1').hide();
          $('.slide2').hide();
          $('.slide3').hide();
          $('.slide4').show();
          $('.slide5').hide();
          break;
          case 4:
          $('.prev').show();
          $('.next').hide();
          $('.slide1').hide();
          $('.slide2').hide();
          $('.slide3').hide();
          $('.slide4').hide();
          $('.slide5').show();
          break;
        }
      };

      //slideDisplay(slideNum);

      $('.next').click(function(){
        slideNum +=1;
        if (slideNum>4) {slideNum = 0;}
        slideDisplay(slideNum);
      });

      $('.prev').click(function(){
          slideNum -=1;
          if(slideNum <0){slideNum = 4;}
          slideDisplay(slideNum);
        });
    });
});
