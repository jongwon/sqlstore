var db = require('mongojs').connect('sqlstorage', ['users']);

var num = function(val){return isNaN(val) ? 0 : Number(val);}

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};


exports.user = user = {

	listAllJson:function(req, res){
		var callback = req.query.callback;
		db.users.count({}, function(err, total){
			db.users.find({}).sort({updated:-1}, function(err, docs){
				var result={
					total:total,
					data:docs
				};
				res.writeHead(200, {'Content-Type': 'text/javascript; charset=utf-8'});
				res.end(callback+'('+JSON.stringify(result)+')');
			});
			
		});
	},
	
	list:function(req, res){
		this.user._listout(res);
	},

	listJson : function(req, res){
		var page = num(req.query.page);
		var limit = num(req.query.limit);
		var callback = req.query.callback;
		db.users.count({}, function(err, total){
			db.users.find({}).skip((page-1)*limit).limit(limit).sort({updated:-1}, function(err, docs){
				var result={
					total:total,
					data:docs
				};
				res.writeHead(200, {'Content-Type': 'text/javascript; charset=utf-8'});
				res.end(callback+'('+JSON.stringify(result)+')');
			});
			
		});
	},

	_listout:function(res){
		db.users.find({}).sort({updated:-1},function(err, docs){
			res.render('users/list', {users:docs});
		});
	},

	create:function(req, res){
		db.users.insert(req.query.user, function(err, docs){
			if(!err){
				res.redirect('/user/list');
			}
		});
	},

	update:function(req, res){
		
		console.log(req.query);
		var user = req.query.user;
		this.user.updateUser(user, res, function(){
			res.redirect('/user/input');
		});
	},

	updateUser:function(user, res, callback){
		user.updated=Date.now();
		if(user){
			if(user._id && user._id != ''){
				db.users.update(
					{_id:db.ObjectId(user._id)}, 
					{$set:{
						name:user.name,
						age:user.age,
						updated:user.updated
					}}, 
					function(err, doc){
						if(callback) callback(doc);
				});
			}else{
				delete user._id;
				db.users.insert(user, function(err, docs){
					if(!err){
						if(callback) callback(docs);
					}
				});
			}
		}else{
			if(callback) callback();
		}
	},
	
	updateJson:function(req, res){
		var data = req.query.user, user={};
		user._id = data[0];
		user.name = data[1];
		user.age = Number(data[2]);

		console.log(user);
		this.user.updateUser(user, res, function(user){
			var callback = req.query.callback;
			var result = user ? {data:user} : {data:null};
			res.end(callback+'('+JSON.stringify(result)+')');
		});
	},

	remove:function(req, res){
		if(req.query.user_id){
			db.users.remove({_id:db.ObjectId(req.query.user_id)}, function(err, id){
				res.redirect('/user/list');
			});
		}
	},

	input:function(req, res){
		if(req.query.user_id){
			db.users.findOne({_id:db.ObjectId(req.query.user_id)}, function(err, user){
				console.log(user);
				res.render('users/input', {user:user});
			});
		}else{
			res.render('users/input', {user:{_id:'', name:'', age:0}});
		}
	}
};
