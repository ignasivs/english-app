//require the just installed express app
var express = require('express');
var bodyParser = require("body-parser");
//then we call express
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

var task = ["buy socks", "practise with nodejs", "hola", "adios", "bien"];
var complete = ["finish jquery"];

//takes us to the root(/) URL
app.get('/', function (req, res) {
    res.render("index", { task: task, complete: complete });
});
app.get('/list', function (req, res) {
    res.render("list", { task: task, complete: complete });
});
app.post('/addtask', function (req, res) {
    var newName = req.body.newName;
    var newTranslation = req.body.newTranslation;
    task.push(newName);
    task.push(newTranslation);
    res.redirect("/");
 });
 app.post("/removetask", function(req, res) {
    var completeTask = req.body.check;
    //check for the "typeof" the different completed task, then add into the complete task
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        //check if the completed task already exist in the task when checked, then remove using the array splice method
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {     complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect("/list");
});
//the server is listening on port 3000 for connections
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});