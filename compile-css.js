/* global require, module */
var sass = require('node-sass');
var fs = require('fs');
var path = require('path');

var inputFile = path.join(__dirname, 'app', 'styles', 'ember-basic-dropdown.scss');
var outputFile = path.join(__dirname, 'vendor', 'ember-basic-dropdown.css');
var buf = fs.readFileSync(inputFile, "utf8");

// Compile main file
var result = sass.renderSync({
  data: buf,
  includePaths: ['app/styles', 'node_modules/ember-basic-dropdown/app/styles/']
});

fs.writeFileSync(outputFile, result.css);