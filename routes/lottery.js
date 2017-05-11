var express = require('express');
var router = express.Router();

// 数据库配置
var mysql = require('mysql');
var config = require('../mysql/config');

var pool = mysql.createPool(config.mysql);

/* 初始化 */
router.get('/', function(req, res, next) {
	 // res.send('这应该是本期主讲人登录的情况!');
	 var user = req.query.user;
	 var data =[];
	 res.locals.user = user;

	 //操作数据库
	 pool.getConnection(function (err, connection) {

	  var $sql = "select * from users where has_talk !=1";
	   connection.query($sql, function (err, result) {
	      
  	 	var users = new Object();
  	 	var data = new Array();
  	 	for(var i = 0;i<result.length;i++){
  	 		data.push(result[i]);
  	 	}
  	 	users.data = data;
  	 	res.render('lottery',{users:users});
  	 	connection.release();// 释放连接
	   })
	 	
	 });
});
/* 选取下一期主讲人接口 */
router.post('/', function(req, res, next) {	 
	 var true_name = req.body.true_name;
	 var user_name = req.body.user_name;

	 // console.log("postData:"+true_name+","+user_name);
	 //操作数据库
	 pool.getConnection(function (err, connection) {

	 	var serch_username = "select * from teach_table where true_name=?";
	    connection.query(serch_username,[true_name],function(err,result){
	    	var seach_result = result;
	      if(err){
	        res.send(JSON.stringify({code:4,msg:"数据库方面有问题"}));
	      }
	      if(seach_result.length>0){
	        result = {
	          code: "0",
	          msg: '该用户已经添加过了!'
	        };
	        res.json(result); // 以json形式，把操作结果返回给前台页面
	        	connection.release();// 释放连接

			}else{//添加用户分两步，第一步is_talking变为0，第二步，添加新的

				var uddate_zero = "update teach_table set is_talking = 0";
				connection.query(uddate_zero,function (err, result) {
					var update_result = result;
					if(update_result.affectedRows>0){//更新0成功
						//在teach_table表添加进去
						 var add_sql = "INSERT INTO teach_table (true_name,average,is_talking) value(?,0,2)";
						   connection.query(add_sql,[true_name],function (err, result) {
						   	var add_result = result;
						   	// console.log(add_result);
						   	if(add_result.affectedRows>0){
						   		result = {
						          code: "1",
						          msg: '指定成功!'
						        };
						      	res.json(result); // 以json形式，把操作结果返回给前台页面
				        		connection.release();// 释放连接			        
						   	}else{
						   		result = {
						          code: "2",
						          msg: '指定失败!'
						        };
						      	res.json(result); // 以json形式，把操作结果返回给前台页面
				        		connection.release();// 释放连接	
						   	}
						   });
					}else{
						result = {
				          code: "3",
				          msg: '未知错误!'
				        };
				      	res.json(result); // 以json形式，把操作结果返回给前台页面
		        		connection.release();// 释放连接	
					}
				});

			}

		});

	 	
	 });

});


module.exports = router;
