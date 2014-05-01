
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var rec = require('./routes/rec');
var http = require('http');
var path = require('path');
var sqlite3 = global.sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var favicon = require('static-favicon');
var cors = require('cors')
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 8887);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon('public/favicon.ico'));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

//db prepare
var file = global.dbfile =  'db/rec.db'
var exists = fs.existsSync(file);

var db = new sqlite3.Database(file);
db.serialize(function() {
	if(!exists) {
		console.log("recreating db..")
		db.run("CREATE TABLE rec ([id] integer PRIMARY KEY autoincrement,[type] varchar,[event_time] datetime,[fact] varchar,[comments] varchar);")
	}
})


app.route('/')
	.get(function(req,res) {		
		res.statusCode = 302;
		res.setHeader('location','http://'+req.headers['host']+'/rec')
		res.end();
	})

app.route('/rec')
	.get(rec.getList)
	.post(rec.addEvent)
app.route('/rec/:id')
	.delete(rec.removeOne)

app.route('/rows')
	.get(rec.getRows)

http.createServer(app).listen(app.get('port'),"0.0.0.0", function(){
  console.log('Express server listening on port ' + app.get('port'));
});
