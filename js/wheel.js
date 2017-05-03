var zip = new JSZip();

var loadViz = function(){
  loadData();
};

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
                  var data = d3.csv.parseRows(content);


                  //remove linha de cabeçalho
                  console.log(data[0]);
                  data.splice(0,1);

                  // deixa somente 20 linhas para depuração
                  data.splice(2000, data.length)

                  //imprime os dados no console do browser
                  console.log(data);

                  // remove "Loading..." e imprime o gráfico
                  $('#title').text("Visualization");
                  draw(data);

                }
            )
        });
    });

};

// http://mcaule.github.io/d3-timeseries/

var draw = function (data) {

  var dateMap = new Map();
  var processData = [];

  data.forEach(d => {
    d.date = new Date(d[67]);

    if (+d[29]) { // permite somente um dado por data
      dateMap.set(d.date.getTime(),{date: d.date, positive: +d[29], negative: +d[30] })
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
                .addSerie(null,{x:'date',y:'negative'},{color:"blue"})
                .width(900)

  chart('#d3chart')

};