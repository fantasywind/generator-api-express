'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var util = require('util');
var yosay = require('yosay');
var chalk = require('chalk');

var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  // App name
  this.argument('appname', {type: String, require: false});
  this.appname = this.appname || path.basename(process.cwd());
  this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));
  this.env.options.appname = this.appname;

  // Static Files Path
  this.option('static-path', {
    desc: 'Set static file folder name',
    type: String,
    defaults: 'public',
    required: 'false'
  });
  this.staticPath = this.options['static-path'] || 'public';
  this.staticPath = this._.camelize(this._.slugify(this._.humanize(this.staticPath)));
  this.env.options.staticPath = this.staticPath;

  this.env.options.appPath = this.options.appPath = 'src';

  // Server Listen Port
  this.option('port', {
    desc: 'Set server listen port',
    type: String,
    defaults: 3030,
    required: 'false'
  });
  this.port = parseInt(this.options.port, 10) || 3030;

  this.sourceRoot(__dirname + '/../');
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
  this.log(yosay());
}

Generator.prototype.askModules = function askModules() {
  var cb = this.async();

  this.prompt([{
    type: 'checkbox',
    name: 'modules',
    message: 'Which modules would you like to use?',
    choices: [{
      value: 'mongodb',
      name: 'MongoDB (Mongoose)',
      checked: true
    }, {
      value: 'mysql',
      name: 'MySQL',
      checked: false
    }, {
      value: 'socketio',
      name: 'Socket.io',
      checked: false
    }]
  }], function (props) {
    var hasModule = function (mod) { return props.modules.indexOf(mod) !== -1; };
    this.mongodb = hasModule('mongodb');
    this.mysql = hasModule('mysql');
    this.socketio = hasModule('socketio');

    cb();
  }.bind(this));
}

Generator.prototype.askMongoInfo = function askMongoInfo() {
  if (this.mongodb) {
    var cb = this.async();
    var prompt = [{
      name: 'mongoUser',
      message: 'Please type your mongodb username:'
    }, {
      name: 'mongoPass',
      type: 'password',
      message: 'Please type your mongodb password:'
    }, {
      name: 'mongoDB',
      type: 'input',
      default: 'test',
      message: 'Please type your mongodb database name:'
    }, {
      name: 'mongoHost',
      type: 'input',
      default: 'localhost',
      message: 'Please type your mongodb host:'
    }, {
      name: 'mongoPort',
      type: 'input',
      default: 27017,
      message: 'Please type your mongodb listen port:',
      validate: function (port) {
        if (isNaN(parseInt(port, 10))) {
          return false;
        } else {
          return true;
        }
      }
    }];
    this.prompt(prompt, function (prop) {
      this.mongoUser = prop.mongoUser;
      this.mongoPass = prop.mongoPass;
      this.mongoDB = prop.mongoDB;
      this.mongoHost = prop.mongoHost;
      this.mongoPort = prop.mongoPort;

      cb()
    }.bind(this));
  }
}

Generator.prototype.askMysqlInfo = function askMysqlInfo() {
  if (this.mysql) {
    var cb = this.async();
    var prompt = [{
      name: 'mysqlUser',
      message: 'Please type your mysql username:'
    }, {
      name: 'mysqlPass',
      type: 'password',
      message: 'Please type your mysql password:'
    }, {
      name: 'mysqlDB',
      type: 'input',
      default: 'test',
      message: 'Please type your mysql database name:'
    }, {
      name: 'mysqlHost',
      type: 'input',
      default: 'localhost',
      message: 'Please type your mysql host:'
    }, {
      name: 'mysqlPort',
      type: 'input',
      default: 3306,
      message: 'Please type your mysql listen port:',
      validate: function (port) {
        if (isNaN(parseInt(port, 10))) {
          return false;
        } else {
          return true;
        }
      }
    }];
    this.prompt(prompt, function (prop) {
      this.mysqlUser = prop.mysqlUser;
      this.mysqlPass = prop.mysqlPass;
      this.mysqlDB = prop.mysqlDB;
      this.mysqlHost = prop.mysqlHost;
      this.mysqlPort = prop.mysqlPort;

      cb()
    }.bind(this));
  }
}

Generator.prototype.createDatabaseConfig = function createDatabaseConfig() {
  if (this.mongo || this.mysql) {
    this.appPath = this.env.options.appPath;
    this.template('templates/dbConfig.json', this.appPath + '/config/db.json', this);
  }
}

Generator.prototype.createIndex = function createIndex() {
  this.appPath = this.env.options.appPath;
  this.template('templates/index.coffee', this.appPath + "/index.coffee", this);
}

Generator.prototype.copyCommon = function copyCommon() {
  this.copy('templates/_package.json', this.appPath + "/../package.json");
  this.copy('templates/gitignore', this.appPath + "/../.gitignore");
}