'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var util = require('util');
var chalk = require('chalk');
var MongoBase = require('../mongo-base.js');

var Generator = module.exports = function Generator() {
  MongoBase.apply(this, arguments);
}

util.inherits(Generator, MongoBase);

Generator.prototype.createModelFiles = function createModelFiles() {
  this.generateSource(
    'mongo-model',
    'models',
    this.options.fields || {name: 'String'},
    this.options['skip-add'] || false
  );
}