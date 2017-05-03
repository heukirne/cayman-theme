var zip = new JSZip();

JSZipUtils.getBinaryContent('https://heukirne.github.io/wheel-of-life/js/corpus_liwc_mtx.csv.zip', (err, data) => {
    if(err) {
        throw err;
    }

    JSZip.loadAsync(data)
        .then(zip => {
            var content = zip.file("corpus_liwc_mtx.csv").async("string").then(content => {
              var data = d3.csvParseRows(content);
              console.log(data);
            }
        )
    });
});