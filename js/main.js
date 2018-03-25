/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [41.880684,-87.630630],
  zoom: 13
});

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  minzoom:0,
	maxZoom: 19,
  opacity:0.65,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(map);


//provide data
var dataURL = "https://raw.githubusercontent.com/RuochangH/OST4GIS-Midterm/master/mapfinal.geojson";
var featureGroup;

//filter function for page one
function myFilter1 (feature) {
  if(feature.properties.Week===9 && feature.properties.Hour===1){return true;}
}

//define color for page one
function getColor1(d){
  return d> 200 ? '#355C7D':
         d> 120 ? '#6C5B7B':
         d> 80 ? '#C06C84':
         d> 40 ? '#F67280':
                 '#F8B195';
               }

//define cllor for page three
function getColor31(d){
  return d> 3000 ? '#355C7D':
         d> 534 ?  '#6C5B7B':
         d> 102 ?  '#C06C84':
         d> 21 ?   '#F67280':
                   '#F8B195';

}

function getColor32(d){
  return d> 43645 ?  '#355C7D':
         d> 24905 ?  '#6C5B7B':
         d> 14405 ?  '#C06C84':
         d> 10122 ?  '#F67280':
                     '#F8B195';
}

function getColor33(d){
  return d> 113250 ?  '#355C7D':
         d> 96379 ?  '#6C5B7B':
         d> 81064 ?  '#C06C84':
         d> 62776 ?  '#F67280':
                     '#F8B195';
}

function getColor34(d){
  return d> 26 ?  '#355C7D':
         d> 23 ?  '#6C5B7B':
         d> 19 ?  '#C06C84':
         d> 12 ?  '#F67280':
                  '#F8B195';
}

//add hover display for page one
var info1 = L.control();

info1.onAdd = function(map){
 this._div = L.DomUtil.create('div','info1');
 this.update();
 return this._div;
};

//$(".slide1").append($("<div class='info1'></div>"));

info1.update = function(props){
  this._div.innerHTML = '<h4>Station Overview</h4>' + (props ?
  '<b>' + props.name + '</b><br />' + props.total +' Weekly Departure' +
  '<br/>' + props.dpcapacity + ' Dock Capacity': 'Hover over a station');
};

var info3 = L.control();

info3.onAdd = function(map){
 this._div = L.DomUtil.create('div','info3');
 this.update();
 return this._div;
};

//add interaction with each feature for page one
   //highlight
function highlightFeature(e){
  var layer=e.target;
  layer.setStyle({
    radius:12,
    weight:3,
    color:'white',
    dashArray: '',
    fillOpacity:0.9
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
  info1.update(layer.feature.properties);
}

   //remove highlight
function resetHighlight(e){
  var layer=e.target;
  layer.setStyle({
  radius:10,
  weight: 1,
  opacity: 0.8,
  color:'white',
  dashArray: '3',
  fillOpacity:0.6
});
  info1.update();
}

  //click to zoom in
function zoomToFeature(e){
  map.setView(e.latlng,16);
}

  //incoorpearte each feature's interactions in one
function onEachFeature1 (feature,layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

//add legend for page one
var legend1 = L.control({position:'bottomright'});
legend1.onAdd = function(map) {
  var div = L.DomUtil.create('div','infoLegend1'),
  grades = [0,40,80,120,200],
  label = [];
  for (var i = 0; i<grades.length; i++){
    div.innerHTML +=
    '<i style = "background:' + getColor1(grades[i]+1) + '"></i> '+
    grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>' :'+');
  }
  return div;
};


//execute
$(document).ready(function(){
  $.ajax(dataURL).done(function(data) {

    var parsedData = JSON.parse(data);

//page one interaction
    $('#s').click(function (){
      if(featureGroup != undefined){
        map.removeLayer(featureGroup);
      }

      info1.addTo(map);
      legend1.addTo(map);

      //plot
      featureGroup = L.geoJson((parsedData),{
      filter:myFilter1,
      pointToLayer:function(feature, latlng){
        var MarkerOption = {
          radius: 10,
          fillColor:getColor1(feature.properties.total),
          weight: 1,
          opacity: 0.8,
          color:'white',
          dashArray: '3',
          fillOpacity:0.6
        };
        return L.circleMarker(latlng,MarkerOption);
      },
      onEachFeature: onEachFeature1
    }).addTo(map);

  });

//page 2 interaction
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

      //Filter distplay according to using input
      var myFilter2 = function(feature){
        if(feature.properties.Week===week && feature.properties.Hour===hour){return true;}
      };

      //add interaction with each feature for page two
      function onEachFeature2 (feature,layer) {
        layer.on('click',function(event){
          layer.bindPopup("The current departure count is " + feature.properties.dept);
          map.setView(event.latlng,15);
        });
      }

      //plot
      featureGroup = L.geoJson(parsedData,{
        filter:myFilter2,
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
          onEachFeature: onEachFeature2
        }).addTo(map);
      });

//page three interactions
    $('#s2').click(function(){
      if(featureGroup != undefined){
        map.removeLayer(featureGroup);
      }

      //add hover display for page three


      info3.update = function(props){
        function text() {switch ($('#apredictor').find(":selected").text()){
          case 'Employment Density': return props.empDen + ' Employment Density';
          case 'Population Density': return props.popDen + ' Population Density';
          case 'Median Household Income': return props.medHHInc + 'Median Household Income';
          case 'Transit Stations Nearby': return props.num_stat + "Transit Stations Nearby";}}
        this._div.innerHTML = '<h4>Predictors</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.dept +' Weekly Departure' +
        '<br/>' + text(): 'Hover over a station');
      };

      info3.addTo(map);

      //add interaction with each feature for page one
         //highlight
      function highlightFeature3(e){
        var layer=e.target;
        layer.setStyle({
          weight:3,
          color:'white',
          dashArray: '',
          fillOpacity:0.9
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
        info3.update(layer.feature.properties);
      }

         //remove highlight
      function resetHighlight3(e){
        var layer=e.target;
        layer.setStyle({
        weight: 1,
        opacity: 0.5,
        color:'white',
        dashArray: '3',
        fillOpacity:0.6
      });
        info3.update();
      }


        //incoorpearte each feature's interactions in one
      function onEachFeature3 (feature,layer) {
        layer.on({
          mouseover: highlightFeature3,
          mouseout: resetHighlight3,
          click: zoomToFeature
        });
      }


      featureGroup = L.geoJson(parsedData,{
        filter:myFilter1,

        pointToLayer:function(feature,latlng){

          //customize style
          function style() {switch ($('#apredictor').find(":selected").text()){
            case 'Employment Density': return getColor31(feature.properties.empDen);
            case 'Population Density': return getColor32(feature.properties.popDen);
            case 'Median Household Income': return getColor33(feature.properties.medHHInc);
            case 'Transit Stations Nearby': return getColor34(feature.properties.num_stat);}}
          var geojsonMarkerOptions = {
              radius: feature.properties.total/22,
              fillColor: style(),
              color: "white",
              weight: 1,
              opacity: 0.5,
              fillOpacity: 0.6
            };
            return L.circleMarker(latlng,geojsonMarkerOptions);
          },
          onEachFeature: onEachFeature3
        }).addTo(map);
      });



//slideshow
      var slideNum =0;


//define slides contents
      var slideDisplay = function (num){
        switch(num){
          case 0:
          $('.prev').hide();
          $('.next').show();
          $('.slide1').show();
          $('.slide2').hide();
          //$('.slide3').hide();
          //$('.slide4').hide();
          $('.slide5').hide();
          map.removeLayer(featureGroup);
          break;
          case 1:
          $('.prev').show();
          $('.next').show();
          $('.slide1').hide();
          $('.slide2').show();
          $('.slide3').hide();
          //$('.slide4').hide();
          //$('.slide5').hide();
          $('.info1').hide();
          $('.infoLegend1').hide();
          map.removeLayer(featureGroup);
          break;
          case 2:
          $('.prev').show();
          $('.next').show();
          //$('.slide1').hide();
          $('.slide2').hide();
          $('.slide3').show();
          $('.slide4').hide();
          //$('.slide5').hide();
          map.removeLayer(featureGroup);
          break;
          case 3:
          $('.prev').show();
          $('.next').show();
          //$('.slide1').hide();
          //$('.slide2').hide();
          $('.slide3').hide();
          $('.slide4').show();
          $('.slide5').hide();
          break;
          case 4:
          $('.prev').show();
          $('.next').hide();
          $('.slide1').hide();
          //$('.slide2').hide();
          //$('.slide3').hide();
          $('.slide4').hide();
          $('.slide5').show();
          break;
        }
      };

//add next interaction
      $('.next').click(function(){
        slideNum +=1;
        if (slideNum>4) {slideNum = 0;}
        slideDisplay(slideNum);
      });

//add previous interaction
      $('.prev').click(function(){
          slideNum -=1;
          if(slideNum <0){slideNum = 4;}
          slideDisplay(slideNum);
        });
    });
});
