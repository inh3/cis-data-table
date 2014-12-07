var fs = require('fs');

var Handlebars = require('handlebars');
//console.log(Handlebars);

var gcisData = [];
var gcisLookup = {};
var tumorData = [];

function debugGcisData() {
    gcisData.forEach(function(element, index) {
        console.log(element["id"] + ": " + element["tumorCount"]);

        if(index == 22) {
            console.log(element);
        }
    });
}

function readTumorsFile() {
    var fileName = __dirname + '\\' + 'tumors.csv';
    var fileContents = fs.readFileSync(fileName).toString();
    var fileLines = fileContents.split(/\n/);

    fileLines[0].split(',').forEach(function(element, index) {
        if(index != 0) {
            gcisData.push({
                "id": element.trim()
            });

            gcisLookup[element] = gcisData.length - 1;
        }
    });

    fileLines.shift();

    fileLines.forEach(function(element, index) {
        lineColumns = element.split(',');

        tumorName = lineColumns[0].trim();

        if(tumorName.length > 0) {

            tumorData.push({
                "name": tumorName,
                "tumors": [],
                "tumorCount": 0
            });

            lineColumns.shift();

            lineColumns.forEach(function(element, index) {
                element = element.trim();
                if(element === 'x') {
                    gcisData[index]["tumors"].push({ "hasTumor": true });
                    gcisData[index]["tumorCount"]++;
                }
                else {
                    gcisData[index]["tumors"].push({ "hasTumor": false });
                }
            });
        }
    });

    console.log("*** GCIS Count: " + gcisData.length + "\n");
    debugGcisData();
    console.log(tumorData);
}

var geneColumns = [];
var tumorRows = [];

function readTumorsFileTransposed() {
    var fileName = __dirname + '\\' + 'tumors.csv';
    var fileContents = fs.readFileSync(fileName).toString();
    var fileLines = fileContents.split(/\n/);

    fileLines[0].split(',').forEach(function(element, index) {
        if(index != 0) {
            geneColumns.push({
                "id": element.trim(),
                "tumorCount": 0
            });
        }
    });

    fileLines.shift();

    fileLines.forEach(function(element, index) {
        lineColumns = element.split(',');

        tumorName = lineColumns[0].trim();

        if(tumorName.length > 0) {

            tumorRows.push({
                "name": tumorName,
                "genes": []
            });
            tumorRowIndex = tumorRows.length - 1;

            lineColumns.shift();

            lineColumns.forEach(function(element, index) {
                element = element.trim();
                if(element === 'x') {
                    tumorRows[tumorRowIndex]["genes"].push({ "hasTumor": true });
                    geneColumns[index]["tumorCount"]++;
                }
                else {
                    tumorRows[tumorRowIndex]["genes"].push({ "hasTumor": false });
                }
            });
        }
    });

    console.log("*** Gene Count: " + geneColumns.length + "\n");
    console.log("*** Tumor Count: " + tumorRows.length + "\n");
    //debugGcisData();
    //console.log(tumorRows);
}

function buildHtmlFile() {

    var fileContents = fs.readFileSync("template.html").toString();
    var template = Handlebars.compile(fileContents);

    var dataHtml = template({
        "tumorData": tumorData,
        "gcisData": gcisData
    })

    fs.writeFile(__dirname + "\\..\\" + "data.html", dataHtml, function(error) {
        if (error) throw error
        console.log("data.html is written!");
    });
}

function buildHtmlFileTransposed() {

    var fileContents = fs.readFileSync("template-2.html").toString();
    var template = Handlebars.compile(fileContents);

    var dataHtml = template({
        "tumorRows": tumorRows,
        "geneColumns": geneColumns
    })

    fs.writeFile(__dirname + "\\..\\" + "data-2.html", dataHtml, function(error) {
        if (error) throw error
        console.log("data-2.html is written!");
    });
}


//readTumorsFile();
//buildHtmlFile();

readTumorsFileTransposed();
buildHtmlFileTransposed();
