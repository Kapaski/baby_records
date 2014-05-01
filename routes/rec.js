
function closeDb(db) {
    console.log("Db closed");
    db.close();
}
exports.getRows = function(req, res){
	var db = new sqlite3.Database(global.dbfile);
	db.all("select id, type, strftime('%m/%d/%Y %H:%M:%S',event_time) as event_timef, fact, comments from rec order by event_time desc",function(err,rows) {
		//console.log(rows)
		closeDb(db);		
		res.send(rows);
	})
	
	
};
exports.getList = function(req, res){
	var db = new sqlite3.Database(global.dbfile);
	db.all("select * from rec order by event_time desc",function(err,rows) {
		//console.log(rows)
		closeDb(db);
		res.render('index',
		{
		title:"Katie的日常任务",
		recs: rows
		});
	})
	
	
};

exports.addEvent = function(req,res){
	var db = new sqlite3.Database(global.dbfile);
	var stmt = db.prepare("insert into rec values(null,?,?,?,?)")
	console.log(req.body)
	stmt.run(req.body.type,req.body.time,req.body.fact,req.body.comments)
	stmt.finalize(function() {
		console.log("Saved: "+req.body.type)
		
		res.statusCode = 201;	
		res.end();
	});
	
	
	
	

};

exports.removeOne = function(req,res) {
	console.log(req)
	var id = req.params.id
	var db = new sqlite3.Database(global.dbfile);
	var stmt = db.prepare("delete from rec where id=?")
	stmt.run(id)
	stmt.finalize(function() {
		console.log("Deleted: "+id)
		res.statusCode=200;
		res.end();
	})
}