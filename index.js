//require the just installed express app
var express = require('express');
var bodyParser = require("body-parser");
var mysql = require('mysql');
//then we call express
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

let words = [];

var connection = mysql.createPool({
    host     : 'remotemysql.com',
    database : 'AUr9u7g0jl',
    user     : 'AUr9u7g0jl',
    password : '5Dytz7Tu3i',
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected');
});

loadWords();

//takes us to the root(/) URL
app.get('/', function (req, res) {
    res.render("index", { words });
});
app.get('/list', function (req, res) {
    res.render("list", { words });
});
 app.post('/addword', async function (req, res) {
    var newName = req.body.newName;
    var newTranslation = req.body.newTranslation;
    await saveNewWord(newName, newTranslation);
    words.push({name: newName, translation: newTranslation});
    res.redirect("/");
 });
 app.post("/removeword", async function(req, res) {
    let values = req.body.values.split(",");
    const index = words.findIndex(val => {
        return val.name == values[0] && val.translation == values[1];
    });
    words.splice(index, 1);
    await deleteWord(values[0], values[1]);
    //await loadWords();
    res.redirect("/list");
});
//the server is listening on port process.env.PORT for connections
app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ', process.env.PORT);
});

function saveNewWord(name, translation) {
    let sql = `INSERT INTO words (name, translation) VALUES ('${name}', '${translation}')`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
}

function deleteWord(name, translation) {
    let sql = `DELETE FROM words WHERE name = '${name}' and translation = '${translation}'`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
      });
}

function loadWords() {
    words = [];
    connection.query('SELECT * FROM words', function (error, results, fields) {
        if (error)
            throw error;
    
        results.forEach(result => {
            words.push({name: result.name, translation: result.translation});
        });
    });
}
