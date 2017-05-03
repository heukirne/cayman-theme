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
                  data.splice(200, data.length)

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

var draw = function (data) {

  var dateMap = new Map();

  data.forEach(d => {
    d.date = new Date(d[67]);
    d.n = +d[29]; // posemo
    d.n3 = +d[30]; //negemo
  });

  var chart = d3.timeseries()
                .addSerie(data,{x:'date',y:'n',diff:'n3'},{color:"#333"})
                .width(900)

  chart('#d3chart')

};