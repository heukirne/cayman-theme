var zip = new JSZip();

var loadViz = function(){
  loadData();
};

var loadData = function(){

    var zipFile = "corpus_liwc_mtx.csv";
    //var zipFile = "story_liwc_author.csv";
    JSZipUtils.getBinaryContent('https://heukirne.github.io/wheel-of-life/js/' + zipFile + '.zip', (err, dataLoad) => {
        if(err) {
            throw err;
        }

        JSZip.loadAsync(dataLoad)
            .then(zip => {
                  var content = zip.file(zipFile).async("string").then(content => {
                  var data = d3.csv.parseRows(content);
                  data.splice(20, data.length)
                  console.log(data);
                  $('#title').text("Visualization");

                  draw(data);
                }
            )
        });
    });

};

// sentiment time-series mouseover
// https://bl.ocks.org/BBischof/75ed4879d155c31412f58840480ae1d6

var draw = function (data) {

    var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var bisecttime = d3.bisector(function(d) { return d.time; }).left,
        formatValue = d3.format(",.2f"),
        displayValue = function(d) { return formatValue(d); };
        
    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.sentiment); });

    var svg = d3.select("#d3chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //d3.csv("https://bl.ocks.org/BBischof/raw/75ed4879d155c31412f58840480ae1d6/b9df15a40b5563841a724b95afae3449910cd818/data.csv", function(error, data) {
    //  if (error) throw error;

      data.splice(0,1);

      data.forEach(function(d) {
        d.time = +d[0];
        d.sentiment = +d[5];
      });

      data.sort(function(a, b) {
        return a.time - b.time;
      });
      
      x.domain([data[0].time, data[data.length - 1].time]);
      y.domain(d3.extent(data, function(d) { return d.sentiment; }));

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Sentiment");

      svg.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);

      var focus = svg.append("g")
          .attr("class", "focus")
          .style("display", "none");

      focus.append("circle")
          .attr("r", 4.5);

      focus.append("text")
          .attr("x", 9)
          .attr("dy", ".35em");

      svg.append("rect")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function() { focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mousemove);

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisecttime(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.time > d1.time - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.time) + "," + y(d.sentiment) + ")");
        focus.select("text").text("Sentiment Value: " 
                                  + displayValue(d.sentiment) 
                                  + "\n Words: "
    //                                                          + d.words
                                 );
      }
    //});

};