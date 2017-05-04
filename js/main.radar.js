// Author: https://github.com/bessfernandez/radar-coffee-wheel

/* An SVG radial chart built to illustrate the flavors in a cup of coffee.
   Adjustable via range sliders.
   Features to improve:
   * allow user to add custom flavors,
   * allow user to name their cup of coffee with details (bean type, grind, type of beverage)
   * use local storage to save past flavors.
   * accessibility updates
   * unit tests
   * use a better design pattern here - singleton probs
*/

'use strict';

var dataRadial,
    coffeeInputs,
    coffeeColors = [],
    domainRange = 100;

var radialChart = radialBarChart()
  .barHeight(250)
  .reverseLayerOrder(true)
  .capitalizeLabels(true)
  .barColors(coffeeColors)
  .domain([0, domainRange])
  .tickValues([10,20,30,40,50,60,70,80,90,100])
  .tickCircleValues([10,20,30,40,50,60,70,80,90]);

var initChartData = () => {
  // data array used to build D3 chart
  dataRadial = [ { data: {} } ];

  // convert array-like inputs to array
  coffeeInputs = [];
  coffeeInputs.push({flavor: 'work', color: 'gray', value:'.4'});
  coffeeInputs.push({flavor: 'health', color: 'green', value:'.8'});
  coffeeInputs.push({flavor: 'family', color: 'blue', value:'.4'});
  coffeeInputs.push({flavor: 'friends', color: 'yellow', value:'.1'});
  coffeeInputs.push({flavor: 'social', color: 'orange', value:'.3'});
  coffeeInputs.push({flavor: 'sexual', color: 'red', value:'.3'});
  coffeeInputs.push({flavor: 'money', color: 'purple', value:'.5'});
  coffeeInputs.push({flavor: 'religion', color: 'brown', value:'.1'});
  coffeeInputs.push({flavor: 'death', color: 'black', value:'.4'});


  coffeeInputs.forEach(function(item, index) {
    var flavor = item.flavor,
        color = item.color;

    if (dataRadial && color) {
      dataRadial[0].data[flavor] = item.value * domainRange;

      // coffee colors push to own array, want to be able to
      // keep colors as an option potentially
      coffeeColors.push(color);
    } else {
      // both flavor and color are a current requirement for any
      // default input
      throw new Error('Inputs need color and flavor.');
    }
  });
};

var buildInitialTaste = () => {
  // chart assumes default coffee flavors and colors are input
  // elements in the DOM
  initChartData();

  //console.log(dataRadial);

  d3.select('#d3-radialbar')
    .datum(dataRadial)
    .call(radialChart);
}

var computePsycoCategories = (authorID) => {

  var dateMap = new Map();
  var processData = [];

/* LIWC Categories
24:"social"
25:"family"
26:"friend"
27:"humans"
48:"body"
49:"health"
50:"sexual"
56:"work"
57:"achieve"
58:"leisure"
59:"home"
60:"money"
61:"relig"
62:"death"
*/

  dataRadial[0].data['work'] = 40;
  dataRadial[0].data['health'] = 80;
  dataRadial[0].data['family'] = 10;
  dataRadial[0].data['friends'] = 30;
  dataRadial[0].data['social'] = 50;
  dataRadial[0].data['sexual'] = 20;
  dataRadial[0].data['money'] = 50;
  dataRadial[0].data['religion'] = 10;
  dataRadial[0].data['death'] = 10;

  dataCSV.forEach(d => {

    if (d[66] == authorID) { // filtra o author

      dataRadial[0].data['work'] += +d[56];
      dataRadial[0].data['health'] += +d[49] + +d[48];
      dataRadial[0].data['family'] += +d[25] + +d[59];
      dataRadial[0].data['friends'] += +d[26];
      dataRadial[0].data['social'] += +d[24] + +d[58];
      dataRadial[0].data['sexual'] += +d[50];
      dataRadial[0].data['money'] += +d[60];
      dataRadial[0].data['religion'] += +d[61];
      dataRadial[0].data['death'] += +d[62];

    }

  });

  var sum = 0
  for(var flavor in dataRadial[0].data) {
      sum += dataRadial[0].data[flavor];
  }

  for(var flavor in dataRadial[0].data) {
      dataRadial[0].data[flavor] = 100 * dataRadial[0].data[flavor] / sum;
  }

  //console.log(dataRadial);
  return dataRadial;

}

var redrawRadial = (authorID) => {
  
  dataRadial = computePsycoCategories(authorID);

  // update chart with new flavor
  d3.select('#d3-radialbar')
    .datum(dataRadial)
    .call(radialChart);
};

// kick off the jams
buildInitialTaste();