const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
const Mustache = require('mustache');
const {templateTable} = require("./src/models");

function CsvToHtml() {
    const constructor = () => {
        readCsvFile(`./import/import-file.csv`).then((tableData) => {
            const htmlTableString = renderTemplate(
                `./templates/table.template.html`,
                templateTable.table(tableData.headerRows, tableData.bodyRows)
            );
            const htmlIndexString = renderTemplate(
                `./templates/index.template.html`,
                templateTable.index(null, htmlTableString)
            );
            writeHtmlToFile(`./export/index.html`, htmlIndexString);
        });
    }

    const readCsvFile = (filePath) => {
        return new Promise((resolve, reject) => {
            let idx = 0;
            const headerRows = [];
            const bodyRows = [];
            Fs.createReadStream(filePath, 'utf8')
                .pipe(new CsvReadableStream({ parseNumbers: false, parseBooleans: false, trim: true, delimiter: ';' }))
                .on('data', function (row) {
                    if (idx === 0) {
                        headerRows.push(row.map(element => templateTable.element(element)));
                    } else {
                        bodyRows.push(row.map(element => templateTable.element(element)));
                    }
                    idx++;
                })
                .on('end', function () {
                    console.log(`File ${filePath} read`);
                    resolve({headerRows, bodyRows});
                });
        });
    }

    const writeHtmlToFile = (filePath, html ='') => {
        Fs.writeFile(filePath, html, (err) => {
            if (err) return console.error(err);
            console.log('file written to ', filePath);
        });
    }

    const renderTemplate = (path, data = {}) => {
        return Mustache.render(readTemplateFile(path), data);
    }

    const readTemplateFile = (path) => {
        return Fs.readFileSync(path, {encoding: 'utf8', flag: 'r'});
    }

    return constructor();
}

(() => new CsvToHtml())();
