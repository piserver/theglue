const Fs = require('fs');
// https://nodejs.org/api/fs.html
const CsvReadableStream = require('csv-reader');
// https://www.npmjs.com/package/csv-reader
const Mustache = require('mustache');
// https://github.com/janl/mustache.js/

let inputStream = Fs.createReadStream(`./import/import-file.csv`, 'utf8');

let tableHead = '';
let tableBody = '';
let idx = 0;

inputStream
    .pipe(new CsvReadableStream({ parseNumbers: false, parseBooleans: false, trim: true, delimiter: ';' }))
    .on('data', function (row) {
        if (idx === 0) {
            tableHead += rowHtmlHeaderTemplate(parseCsvRow(row));
        } else {
            tableBody += rowHtmlTemplate(parseCsvRow(row));
        }
        idx++;
    })
    .on('end', function () {
        console.log('No more rows!');
        const filePath = `./export/export.html`;
        Fs.writeFile(filePath, baseHtmlTemplate({head: tableHead, body: tableBody}), (err) => {
            if (err) return console.error(err);
            console.log('file written to ', filePath);
        });
    });

const parseCsvRow = (col) => {
    return {
        participant: col[0],
        date1: col[1],
        date2: col[2],
        date3: col[3],
        date4: col[4],
        date5: col[5],
        date6: col[6],
        date7: col[7],
        date8: col[8]
    }
}

const baseHtmlTemplate = (vars) => {
    return Mustache.render(`
    <!doctype html>
    <html lang="en">
      <head>
        <title>Table</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
      </head>
      <body>
        <table class="table">
            <caption>I am a Table</caption>
            <thead>{{{head}}}</thead>
            <tbody>{{{body}}}</tbody>
        </table>
      </body>
    </html>
    `, vars);
}

const rowHtmlHeaderTemplate = (csvRow) => {
    return Mustache.render(`
    <tr>
        <th scope="col">{{participant}}</th>
        <th scope="col">{{date1}}</th>
        <th scope="col">{{date2}}</th>
        <th scope="col">{{date3}}</th>
        <th scope="col">{{date4}}</th>
        <th scope="col">{{date5}}</th>
        <th scope="col">{{date6}}</th>
        <th scope="col">{{date7}}</th>
        <th scope="col">{{date8}}</th>
    </tr>
    `, csvRow);
}

const rowHtmlTemplate = (csvRow) => {
    return Mustache.render(`
    <tr>
        <td>{{participant}}</td>
        <td>{{date1}}</td>
        <td>{{date2}}</td>
        <td>{{date3}}</td>
        <td>{{date4}}</td>
        <td>{{date5}}</td>
        <td>{{date6}}</td>
        <td>{{date7}}</td>
        <td>{{date8}}</td>
    </tr>
    `, csvRow);
}
