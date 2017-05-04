// http://mcaule.github.io/d3-timeseries/
var drawTimeSeries = (authorID) => {

  var dateMap = new Map();
  var processData = [];

  dataCSV.forEach(d => {

    if (d[66] == authorID) { // filtra o author

      d.date = new Date(d[67]);
      var key = d.date.getTime();

      if (+d[29]+d[30]) { // permite somente um dado por data
        if (!dateMap.has(key)) {
          dateMap.set(key,{date: d.date, positive: +d[29], negative: +d[30] })
        } else {
          var v = dateMap.get(key);
          v.positive += +d[29];
          v.negative += +d[30];
          dateMap.set(key,v);
        }
      }

    }
  });

  console.log(dateMap);

  dateMap.forEach((value, key)=>{
    processData.push(value);
  });

  processData.sort(function(a, b) {
    return a.date - b.date;
  });

  console.log(processData);

  var chart = d3.timeseries()
                .addSerie(processData,{x:'date',y:'positive'},{interpolate:'linear',color:"red"})
                .addSerie(null,{x:'date',y:'negative'},{interpolate:'linear',color:"blue"})
                .width(900)

  $('#d3-timeseries').empty();
  chart('#d3-timeseries')

};