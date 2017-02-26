const environment = process.env.NODE_ENV || 'development';
const express = require("express");
const passport = require("passport");

const config = require('./configurations/config')({ environment });

const app = express();

const imageDecoder = require('./utils/decode-base64-image');

const data = require("./data")();
const controllers = require("./controllers")({ data, passport, config, imageDecoder });

require('./configurations/database')({ config });
require('./configurations/express')({ app });

const User = require("./models/user-model");
require('./configurations/local-passport.js')({ User });

require('./routes')({ app, controllers });

app.listen(config.port, function () {
    console.log('App listening on port: ' + config.port);
});