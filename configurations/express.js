const express = require('express');
const path = require('path');
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");

module.exports = function ({ app }) {

    app.use(express.static(path.join(__dirname, '/../../dist/')));

    app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
    app.use(bodyParser.json({limit: '5mb'}));
    app.use(session({
        secret: "42noissesterces",
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};