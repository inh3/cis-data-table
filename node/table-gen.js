
var os = require('os');
var fs = require('fs');
var path = require('path');

var Handlebars = require('handlebars');
//console.log(Handlebars);

var gcisData = [];
var gcisLookup = {};
var tumorData = [];
var tumorMap = {};

function debugGcisData() {
    gcisData.forEach(function(element, index) {
        console.log(element["id"] + ": " + element["tumorCount"]);

        if(index == 22) {
            console.log(element);
        }
    });
}

function readTumorMapFile() {
    //var fileName = path.join(__dirname, 'test.csv');
    var fileName = path.join(__dirname, '37_tumors_pathology.csv');
    var fileContents = fs.readFileSync(fileName).toString();
    var fileLines = fileContents.split("\n");

    fileLines.forEach(function(element, index) {
        lineColumns = element.split(',');

        // fix mistake with tumor
        if(lineColumns[0] == 'G447T5') {
            lineColumns[0] = 'G447T9'
        }

        tumorMap[lineColumns[0]] = {
            "pathology": lineColumns[2],
            "has_match": false
        };
    });

    //console.log(tumorMap);
    console.log("Tumor Map Size: " + Object.keys(tumorMap).length);
}

function readTumorsFile() {
    var fileName = path.join(__dirname, 'tumors.csv');
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
    var fileName = path.join(__dirname, 'tumors.csv');
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

            //console.log(tumorName);
            //console.log(tumorMap[tumorName]);
            //console.log('');
            pathology = undefined;
            if(tumorMap[tumorName]) {
                tumorMap[tumorName].has_match = true;
                pathology = tumorMap[tumorName].pathology;
            }

            tumorRows.push({
                "name": tumorName,
                "genes": [],
                "pathology": pathology
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

    fs.writeFile(path.join(__dirname, "..", "data.html"), dataHtml, function(error) {
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

    fs.writeFile(path.join(__dirname, "..", "data-2.html"), dataHtml, function(error) {
        if (error) throw error
        console.log("data-2.html is written!");
    });
}


//readTumorsFile();
//buildHtmlFile();

readTumorMapFile();
readTumorsFileTransposed();
buildHtmlFileTransposed();

//console.log(tumorMap);
