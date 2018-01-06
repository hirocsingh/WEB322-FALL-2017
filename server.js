/*********************************************************************************
 *  WEB322 – Assignment 04 
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: _Avinash Singh_ Student ID: _115408163_ Date: 15-OCT-2017
 *
 * Online (Heroku) URL: https://lit-brook-78873.herokuapp.com/managers
 *
 ********************************************************************************/
var express = require("express");
var app = express();
var path = require("path");
var data_service = require("./data-service.js");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
    return new Promise(function(res, req) {
        data_service.initialize().then(function(data) {
            console.log(data)
        }).catch(function(err) {
            console.log(err);
        });
    });
}


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: 'layout',
    helpers: {
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set("view engine", ".hbs");


app.get("/", function(req, res) {
    res.render("home");
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.get("/employees", function(req, res) {

    if (req.query.status) {
        data_service.getEmployeesByStatus(req.query.status).then(function(data) {
            res.render("employeeList", { data: data, title: "Employees" });
        }).catch(function(err) {
            res.json({ message: err });
        });
    } else if (req.query.department) {
        data_service.getEmployeesByDepartment(req.query.department).then(function(data) {
            res.render("employeeList", { data: data, title: "Employees" });
        }).catch(function(err) {
            res.json({ message: err });
        });
    } else if (req.query.manager) {
        data_service.getEmployeesByManager(req.query.manager).then(function(data) {
            res.render("employeeList", { data: data, title: "Employees" });
        }).catch(function(err) {
            res.json({ message: err });
        });
    } else {
        data_service.getAllEmployees().then(function(data) {
            res.render("employeeList", { data: data, title: "Employees" });
        }).catch(function(err) {
            res.json({ message: err });
        });
    }
});


app.get("/employee/:num", function(req, res) {
    data_service.getEmployeeByNum(req.params.num).then(function(data) {
        res.render("employee", { data: data });
    }).catch(function(err) {
        res.status(404).send("Employee Not Found");
    });
});

app.get("/managers", function(req, res) {
    data_service.getManagers().then(function(data) {
        res.render("employeeList", { data: data, title: "Employees (Managers)" });
    }).catch(function(err) {
        res.render("employeeList", { data: {}, title: "Employees (Managers)" });
    });
});

app.get("/departments", function(req, res) {
    data_service.getDepartments().then(function(data) {
        res.render("departmentList", { data: data, title: "Departments" });
    }).catch(function(err) {
        res.render("departmentList", { data: {}, title: "Departments" });
    });
});

app.get("/employees/add", (req, res) => {
    res.render("addEmployee");
});

app.post("/employees/add", (req, res) => {
    data_service.addEmployee(req.body).then((data) => {
        console.log(req.body);
        res.redirect("/employees");
    }).catch((err) => {
        console.log(err);
    })
});

app.post("/employee/update", (req, res) => {
    data_service.updateEmployee(req.body).then((data) => {
        console.log(req.body);
        res.redirect("/employees");
    }).catch((err) => {
        console.log(err);
    })
});


app.use(function(req, res) {
    res.status(404).send("Page Not Found.");
});

app.listen(HTTP_PORT, onHttpStart);