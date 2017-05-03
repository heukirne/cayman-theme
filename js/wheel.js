var zip = new JSZip();

var loadViz = function(){
  loadData();
};

var data = data;

var loadData = function(){

    var zipFile = "story_liwc_author_tiny.csv"; // arquivo com 4K samples
    //var zipFile = "story_liwc_author.csv"; // arquivo com 130K samples
    JSZipUtils.getBinaryContent('https://heukirne.github.io/wheel-of-life/js/' + zipFile + '.zip', (err, dataLoad) => {
        if(err) {
            throw err;
        }

        JSZip.loadAsync(dataLoad)
            .then(zip => {

                  // descompacta arquivo csv
                  var content = zip.file(zipFile).async("string").then(content => {
                  data = d3.csv.parseRows(content);


                  //remove linha de cabeçalho
                  console.log(data[0]);
                  data.splice(0,1);

                  // deixa somente 20 linhas para depuração
                  data.splice(2000, data.length)

                  //imprime os dados no console do browser
                  console.log(data);

                  // remove "Loading..." e imprime o gráfico
                  $('#title').text("Visualization");
                  selectAuthors();
                  draw(data[0][66]);

                }
            )
        });
    });

};

// http://mcaule.github.io/d3-timeseries/

var draw = (authorID) => {

  var dateMap = new Map();
  var processData = [];

  data.forEach(d => {

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

  $('#d3chart').empty();
  chart('#d3chart')

};


var selectAuthors = () => { 
  var authorMap = new Map();

  data.forEach(d => {
    authorMap.set(d[66],d[66])
  });

  authorMap.forEach( (key, value) => {   
       $('#authorID')
           .append($("<option></option>")
                      .attr("value",key)
                      .text(value)); 
  });

  console.log(authorMap);

};

$( "#authorID" ).change( () => {
  draw($('#authorID option:selected').val());
});
