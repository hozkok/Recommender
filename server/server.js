var app = require('express');
var body_parser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./db');

db.connect();
