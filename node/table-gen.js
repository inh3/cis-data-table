var fs = require('fs');

var Handlebars = require('handlebars');
console.log(Handlebars);

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
                "tumors": [],
                "id": element.trim(),
                "tumorCount": 0
            });

            gcisLookup[element] = gcisData.length - 1;
        }
    });

    fileLines.shift();

    fileLines.forEach(function(element, index) {
        lineColumns = element.split(',');

        tumorName = lineColumns[0].trim();

        if(tumorName.length > 0) {

            tumorData.push({ "name": tumorName });

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

readTumorsFile();
buildHtmlFile();
