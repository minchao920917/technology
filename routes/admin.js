var express = require('express');
var router = express.Router();

// 数据库配置
var mysql = require('mysql');
var config = require('../mysql/config');

var pool = mysql.createPool(config.mysql);

/* GET users listing. */
router.get('/', function(req, res, next) {
      var user = req.query.user;
      var users = new Object();
      var teachers = new Object();
      var data = new Array();
      var data1 = new Array();

  //获得用户列表强求
  pool.getConnection(function(err,connection){
  	 var sql = "select * from users";
  	 connection.query(sql,function(err,result){
  	 	for(var i = 0;i<result.length;i++){
  	 		data.push(result[i]);
  	 	}
      users.data = data;
      res.locals.user = user;
      
      res.locals.users = users;
     

      var sql1 = "select * from teach_table";
        connection.query(sql1,function(err,result){
          // console.log(result);
          for(var i = 0;i<result.length;i++){
            data1.push(result[i]);
          }
          teachers.data = data1;
          // console.log(teachers);
          res.locals.teachers = teachers;
          connection.release();// 释放连接
          res.render('admin');
        });
  	 
     });


  });


});

//GET users DELETE
router.get('/del',function(req,res){

  var username = req.query.username;
  // console.log(username);

  //操作数据库
    pool.getConnection(function(err,connection){
      var sql = "delete from users where user_name = ?";
      connection.query(sql,[username],function(err,result){
        if(err){
          res.send(JSON.stringify({code:3,msg:"数据库方面有问题"}));
        }else{
          //删除判断是否成功
          if(result){
            jsonResult = {
                  code: 1,
                  msg: '删除成功'
                };
          res.json(jsonResult); // 以json形式，把操作结果返回给前台页面
          }else{
          jsonResult = {
                  code: 2,
                  msg: '删除失败'
                };
          res.json(jsonResult); // 以json形式，把操作结果返回给前台页面
          }

        }
      })

    })
});

//get DELETE ALLUSERS
router.get('/delAll',function(req,res){

  //操作数据库
    pool.getConnection(function(err,connection){
      var sql = "truncate users ";
      connection.query(sql,function(err,result){
        if(err){
          res.send(JSON.stringify({code:3,msg:"数据库方面有问题"}));
        }else{

          //删除判断是否成功
          if(result){
            jsonResult = {
                  code: 1,
                  msg: '全部删除成功'
                };
          res.json(jsonResult); // 以json形式，把操作结果返回给前台页面
          }else{
          jsonResult = {
                  code: 2,
                  msg: '全部删除失败'
                };
          res.json(jsonResult); // 以json形式，把操作结果返回给前台页面
          }

        }
      })

    })
});
module.exports = router;
