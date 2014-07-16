'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var generatorUtils = require('./util.js');

var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  try {
    this.appname = this.env.options.appname || require(path.join(process.cwd(), '/package.json')).name;
  } catch (e) {
    this.appname = path.basename(process.cwd());
  }
  this.appname = this._.slugify(this._.humanize(this.appname));
  this.scriptAppName = this._.camelize(this.appname);

  this.cameledName = this._.camelize(this.name);
  this.classedName = this._.classify(this.name);
  this.lowerName = this.name.toLowerCase();

  if (typeof this.env.options.appPath === 'undefined') {
    this.env.options.appPath = this.options.appPath;

    if (!this.env.options.appPath) {
      try {
        this.env.options.appPath = require(path.join(process.cwd(), '/package.json')).appPath;
      } catch (e) {}
    }
    this.env.options.appPath = this.env.options.appPath || 'src';
    this.options.appPath = this.env.options.appPath;
  }

  // Check MongoDB mode
  try {
    this.mongodb = this.env.options.mongodb || require(path.join(process.cwd(), '/package.json')).devDependencies.mongoose;
  } catch (e) {
    this.mongodb = false;
  }

  this.sourceRoot(path.join(__dirname, '/templates/scripts'));
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.scriptTemplate = function scriptTemplate (src, dest, fields) {
  this.fields = fields;
  yeoman.generators.Base.prototype.template.apply(this, [
    src + '.coffee',
    path.join(this.env.options.appPath, dest.toLowerCase()) + '.coffee'
  ]);
}

Generator.prototype.addScriptToIndex = function addScriptToIndex (script) {
  try {
    var appPath = this.env.options.appPath;
    var fullPath = path.join(appPath, 'index.coffee');
    var fs = require('fs');
    generatorUtils.rewriteFile({
      file: fullPath,
      needle: '# End MongoDB Models',
      splicable: [
        this.classedName + 'Model = require "./models/' + this.lowerName + '"'
      ]
    });
  } catch (e) {
    this.log.error(chalk.yellow(
      '\nUnable to find ' + fullPath + '. Reference to ' + script + '.js ' + 'not added.\n'
    ));
  }
}

Generator.prototype.generateSource = function generateSource (scriptTemplate, targetDirectory, fields, skipAdd) {
  if (this.mongodb) {
    this.scriptTemplate(scriptTemplate, path.join(targetDirectory, this.name), fields);
    if (!skipAdd) {
      this.addScriptToIndex(path.join(targetDirectory, this.name));
    }
  } else {
    this.log.error(chalk.bold.red('You have to include mongoose to create a MongoDB Model.'));
  }
}