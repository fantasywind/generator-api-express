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

  this.on('end', function () {
    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-message']
    });
  });

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
    }, {
      value: 'passport',
      name: 'Passport',
      checked: false
    }]
  }], function (props) {
    var hasModule = function (mod) { return props.modules.indexOf(mod) !== -1; };
    this.mongodb = hasModule('mongodb');
    this.mysql = hasModule('mysql');
    this.socketio = hasModule('socketio');
    this.passport = hasModule('passport');

    cb();
  }.bind(this));
}

Generator.prototype.askPassportModule = function askPassportModule() {
  if (this.passport) {
    // Check Database
    if (!this.mysql && !this.mongodb) {
      var err = new Error('[ERR] You should select a database to saving passport member data.');
      this.log(chalk.red(err.message));
      process.exit();
    }

    var cb = this.async();

    this.prompt([{
      type: 'checkbox',
      name: 'modules',
      message: 'Which passport modules would you like to use?',
      choices: [{
        value: 'local',
        name: 'Local Server',
        checked: true
      }, {
        value: 'facebook',
        name: 'Facebook',
        checked: false
      }, {
        value: 'twitter',
        name: 'Twitter',
        checked: false
      }, {
        value: 'google',
        name: 'Google',
        checked: false
      }]
    }], function (props) {
      var hasModule = function (mod) { return props.modules.indexOf(mod) !== -1; };
      this.passportMods = {}
      this.passportMods.local = hasModule('local');
      this.passportMods.facebook = hasModule('facebook');
      this.passportMods.twitter = hasModule('twitter');
      this.passportMods.google = hasModule('google');

      cb();
    }.bind(this));
  }
}

Generator.prototype.askMongoInfo = function askMongoInfo() {
  if (this.mongodb) {
    var cb = this.async();
    var prompt = [{
      name: 'mongoUser',
      message: 'Please type your mongodb username:',
      default: 'MONGO_USER'
    }, {
      name: 'mongoPass',
      type: 'password',
      default: 'MONGO_PASS',
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
      message: 'Please type your mysql username:',
      default: "MYSQL_USER"
    }, {
      name: 'mysqlPass',
      type: 'password',
      message: 'Please type your mysql password:',
      default: "MYSQL_PASS"
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

Generator.prototype.askPassportDatabase = function askPassportDatabase() {
  if (this.passport) {
    if (this.mysql && this.mongodb) {
      var cb = this.async();

      this.prompt([{
        type: 'list',
        name: 'passportDatabase',
        message: 'Which database would you like to storage member data with passport?',
        choices: ['MySQL', 'MongoDB']
      }], function (props) {
        this.passportDB = props.passportDatabase.toLowerCase();

        cb();
      }.bind(this));
    } else if (this.mongodb) {
      this.passportDB = 'mongodb'
    } else if (this.mysql) {
      this.passportDB = 'mysql'
    }
  }
}

Generator.prototype.createPassportMysqlTable = function createPassportMysqlTable() {
  if (this.passport && this.passportDB === 'mysql') {
    var cb = this.async();
    var mysql = require('mysql');
    var conn = mysql.createConnection("mysql://" + this.mysqlUser + ":" + this.mysqlPass + "@" + this.mysqlHost + ":" + this.mysqlPort + "/" + this.mysqlDB);
    conn.connect();
    conn.query("CREATE TABLE member (id int(10) NOT NULL AUTO_INCREMENT, email char(80), name char(42), password char(40), salt char(8), PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8", function (err, rows, field) {
      if (err) {
        this.log(chalk.yellow('Warning: Cannot create MySQL table: member (exist.)'));
      } else {
        this.log(chalk.green('Success: Create MySQL table: member'));
      }
      conn.destroy();
      cb();
    }.bind(this));
  }
}

Generator.prototype.createDatabaseConfig = function createDatabaseConfig() {
  if (this.mongodb || this.mysql) {
    this.appPath = this.env.options.appPath;
    this.template('templates/dbConfig.json', this.appPath + '/config/db.json', this);
  }
}

Generator.prototype.createIndex = function createIndex() {
  this.appPath = this.env.options.appPath;
  this.template('templates/index.coffee', this.appPath + "/index.coffee", this);
}

Generator.prototype.createPassportFiles = function createPassportFiles() {
  if (this.passport) {
    this.template('templates/lib/passport.coffee', this.appPath + "/config/passport.coffee", this);
    if (this.passportMods.local) {
      this.template('templates/lib/passport-local.coffee', this.appPath + "/config/passport-local.coffee", this);
    }
  }
}

Generator.prototype.copyCommon = function copyCommon() {
  this.copy('templates/static/favicon.ico', this.appPath + "/" + this.staticPath + "/favicon.ico");
  this.copy('templates/lib/session.binder.coffee', this.appPath + "/lib/session.binder.coffee");
  this.copy('templates/_package.json', this.appPath + "/../package.json");
  this.copy('templates/gitignore', this.appPath + "/../.gitignore");
}